import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { RECIPES as STATIC_RECIPES } from '../constants';
import { Recipe, UserProfile } from '../types';
import { ChefHat, Flame, Zap, Droplets, Leaf, Beef, Plus, X, Share2, User, Clock, Heart } from 'lucide-react';
import { cn } from '../lib/utils';

const getRelevantFoodImage = (name: string, category: string): string => {
  const normalized = (name || '').toLowerCase();
  
  if (normalized.includes('salad')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop';
  }
  if (normalized.includes('paneer')) {
    return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800&auto=format&fit=crop';
  }
  if (normalized.includes('tofu')) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
  }
  if (normalized.includes('chicken') || normalized.includes('turkey') || normalized.includes('biryani') || normalized.includes('beef') || normalized.includes('poultry') || normalized.includes('meat')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop';
  }
  if (normalized.includes('salmon') || normalized.includes('fish') || normalized.includes('tuna') || normalized.includes('shrimp') || normalized.includes('seafood') || normalized.includes('prawn')) {
    return 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop';
  }
  if (normalized.includes('dal') || normalized.includes('lentil') || normalized.includes('soup') || normalized.includes('chickpea') || normalized.includes('moong')) {
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop';
  }
  if (normalized.includes('idli') || normalized.includes('dosa') || normalized.includes('samber') || normalized.includes('sambar') || normalized.includes('chilla') || normalized.includes('crepe')) {
    return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop';
  }
  if (normalized.includes('egg') || normalized.includes('omelette') || normalized.includes('scramble') || normalized.includes('shakshuka')) {
    return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop';
  }
  if (normalized.includes('yogurt') || normalized.includes('smoothie') || normalized.includes('berry') || normalized.includes('chia') || normalized.includes('pudding') || normalized.includes('fruit') || normalized.includes('mango') || normalized.includes('apple') || normalized.includes('banana')) {
    return 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop';
  }
  if (normalized.includes('oat') || normalized.includes('oatmeal') || normalized.includes('porridge')) {
    return 'https://images.unsplash.com/photo-1517881917431-13488df373ec?q=80&w=800&auto=format&fit=crop';
  }
  if (normalized.includes('rice') || normalized.includes('pulao') || normalized.includes('quinoa') || normalized.includes('grain')) {
    return 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop';
  }
  if (normalized.includes('stir fry') || normalized.includes('soya') || normalized.includes('sauté') || normalized.includes('spinach') || normalized.includes('cauliflower') || normalized.includes('broccoli') || normalized.includes('mushroom') || normalized.includes('beet') || normalized.includes('vegetable')) {
    return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop';
  }
  if (normalized.includes('wrap') || normalized.includes('sandwich') || normalized.includes('taco') || normalized.includes('roll')) {
    return 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?q=80&w=800&auto=format&fit=crop';
  }

  switch (category?.toLowerCase()) {
    case 'breakfast':
      return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop';
    case 'lunch':
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
    case 'dinner':
      return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop';
    case 'snack':
      return 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=800&auto=format&fit=crop';
    default:
      return 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop';
  }
};

export const Recipes: React.FC<{ profile: UserProfile; user: any }> = ({ profile, user }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites' | 'veg' | 'non-veg' | 'salad'>('all');
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());

  const currentUser = user || auth.currentUser;

  // Form State
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    name: '',
    description: '',
    type: 'veg',
    category: 'Lunch',
    ingredients: [],
    instructions: [],
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    servingSize: 100,
  });

  const [tempIngredient, setTempIngredient] = useState('');
  const [tempInstruction, setTempInstruction] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.isDemo) {
      const localKey = `calorix_recipes_${currentUser.uid}`;
      const localRecipes = localStorage.getItem(localKey);
      const parsedRecipes = localRecipes ? JSON.parse(localRecipes) : [];
      setRecipes([...STATIC_RECIPES, ...parsedRecipes]);
      setLoading(false);
      
      const localLikesKey = `calorix_likes_${currentUser.uid}`;
      const localLikes = localStorage.getItem(localLikesKey);
      setUserLikes(new Set(localLikes ? JSON.parse(localLikes) : []));
      return;
    }

    const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const dbRecipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe));
      setRecipes([...STATIC_RECIPES, ...dbRecipes]);
      setLoading(false);
    });

    const likesQuery = query(collection(db, 'likes'), orderBy('recipeId'));
    const unsubLikes = onSnapshot(likesQuery, (snapshot) => {
      const likedIds = new Set(
        snapshot.docs
          .filter(doc => doc.data().uid === currentUser?.uid)
          .map(doc => doc.data().recipeId)
      );
      setUserLikes(likedIds);
    });

    return () => { unsub(); unsubLikes(); };
  }, [currentUser]);

  const handleLike = async (recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;

    const isStatic = STATIC_RECIPES.some(r => r.id === recipeId);

    if (currentUser.isDemo) {
      setUserLikes(prev => {
        const next = new Set(prev);
        if (next.has(recipeId)) {
          next.delete(recipeId);
        } else {
          next.add(recipeId);
        }
        localStorage.setItem(`calorix_likes_${currentUser.uid}`, JSON.stringify(Array.from(next)));
        return next;
      });

      // Update in-memory recipe count
      setRecipes(prev => prev.map(r => {
        if (r.id === recipeId && !isStatic) {
          const isCurrentlyLiked = userLikes.has(recipeId);
          return {
            ...r,
            likesCount: Math.max(0, (r.likesCount || 0) + (isCurrentlyLiked ? -1 : 1))
          };
        }
        return r;
      }));
      return;
    }

    const likeId = `${currentUser.uid}_${recipeId}`;
    const likeRef = doc(db, 'likes', likeId);
    const recipeRef = doc(db, 'recipes', recipeId);
    
    if (userLikes.has(recipeId)) {
      await deleteDoc(likeRef);
      if (!isStatic) {
        const recipeDoc = await getDoc(recipeRef);
        if (recipeDoc.exists()) {
          await updateDoc(recipeRef, { likesCount: Math.max(0, (recipeDoc.data().likesCount || 0) - 1) });
        }
      }
    } else {
      await setDoc(likeRef, { uid: currentUser.uid, recipeId });
      if (!isStatic) {
        const recipeDoc = await getDoc(recipeRef);
        if (recipeDoc.exists()) {
          await updateDoc(recipeRef, { likesCount: (recipeDoc.data().likesCount || 0) + 1 });
        }
      }
    }
  };

  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const recipePayload = {
      ...newRecipe,
      authorUid: currentUser.uid,
      authorName: profile.displayName || 'Anonymous',
      createdAt: new Date().toISOString(),
      likesCount: 0,
      imageUrl: getRelevantFoodImage(newRecipe.name || '', newRecipe.category || 'Lunch'),
    };

    if (currentUser.isDemo) {
      const localKey = `calorix_recipes_${currentUser.uid}`;
      const localRecipes = localStorage.getItem(localKey);
      const parsedRecipes = localRecipes ? JSON.parse(localRecipes) : [];
      const newLocalRecipe = { id: `local_${Date.now()}`, ...recipePayload } as Recipe;
      const updatedRecipes = [newLocalRecipe, ...parsedRecipes];
      localStorage.setItem(localKey, JSON.stringify(updatedRecipes));
      
      setRecipes([...STATIC_RECIPES, ...updatedRecipes]);
      setShowAddForm(false);
      setNewRecipe({
        name: '',
        description: '',
        type: 'veg',
        category: 'Lunch',
        ingredients: [],
        instructions: [],
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        servingSize: 100,
      });
      return;
    }

    try {
      await addDoc(collection(db, 'recipes'), recipePayload);
      setShowAddForm(false);
      setNewRecipe({
        name: '',
        description: '',
        type: 'veg',
        category: 'Lunch',
        ingredients: [],
        instructions: [],
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        servingSize: 100,
      });
    } catch (err) {
      console.error("Error adding recipe:", err);
    }
  };

  const filteredRecipes = recipes.filter(r => {
    if (filter === 'favorites') return userLikes.has(r.id);
    if (filter === 'all') return true;
    if (filter === 'veg') return r.type === 'veg';
    if (filter === 'non-veg') return r.type === 'non-veg';
    if (filter === 'salad') return r.name.toLowerCase().includes('salad') || r.description.toLowerCase().includes('salad');
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-left">
          <h2 className="text-4xl font-serif italic mb-2">Community Kitchen</h2>
          <p className="text-black/60 max-w-lg">Discover and share healthy recipes with the Calorix community.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:scale-105 transition-transform"
        >
          <Share2 size={18} />
          Share Recipe
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['all', 'favorites', 'veg', 'non-veg', 'salad'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
              filter === f ? "bg-black text-white border-black" : "bg-white text-black/40 border-black/5 hover:border-black/20"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[400px] bg-black/5 rounded-[40px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-black/5 group hover:shadow-xl transition-all duration-500">
              <div className="h-48 bg-black/5 relative overflow-hidden">
                <img 
                  src={recipe.imageUrl || getRelevantFoodImage(recipe.name, recipe.category || 'Lunch')} 
                  alt={recipe.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  {recipe.type === 'veg' ? <Leaf size={12} className="text-green-600" /> : <Beef size={12} className="text-red-600" />}
                  {recipe.type}
                </div>
                <button 
                  onClick={(e) => handleLike(recipe.id, e)}
                  className={cn(
                    "absolute top-4 right-4 p-2 rounded-full backdrop-blur transition-all",
                    userLikes.has(recipe.id) ? "bg-red-500 text-white" : "bg-white/80 text-black/40 hover:text-red-500"
                  )}
                >
                  <Heart size={16} fill={userLikes.has(recipe.id) ? "currentColor" : "none"} />
                </button>
                {recipe.authorName && (
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-[10px] text-white font-medium flex items-center gap-1">
                    <User size={10} />
                    {recipe.authorName}
                  </div>
                )}
                {recipe.likesCount !== undefined && recipe.likesCount > 0 && (
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold flex items-center gap-1">
                    <Heart size={10} className="text-red-500" fill="currentColor" />
                    {recipe.likesCount}
                  </div>
                )}
              </div>

              <div className="p-8">
                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">{recipe.category}</p>
                  <h3 className="text-xl font-serif italic line-clamp-1">{recipe.name}</h3>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-8">
                  <div className="text-center p-2 bg-black/5 rounded-2xl">
                    <Flame size={14} className="mx-auto mb-1 text-orange-500" />
                    <p className="text-[10px] font-bold">{recipe.calories}</p>
                  </div>
                  <div className="text-center p-2 bg-black/5 rounded-2xl">
                    <Zap size={14} className="mx-auto mb-1 text-yellow-500" />
                    <p className="text-[10px] font-bold">{recipe.protein}g</p>
                  </div>
                  <div className="text-center p-2 bg-black/5 rounded-2xl">
                    <Droplets size={14} className="mx-auto mb-1 text-blue-500" />
                    <p className="text-[10px] font-bold">{recipe.carbs}g</p>
                  </div>
                  <div className="text-center p-2 bg-black/5 rounded-2xl">
                    <Droplets size={14} className="mx-auto mb-1 text-purple-500" />
                    <p className="text-[10px] font-bold">{recipe.fats}g</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedRecipe(recipe)}
                  className="w-full py-3 border border-black text-black rounded-full font-medium hover:bg-black hover:text-white transition-all"
                >
                  View Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden relative my-8">
            <button 
              onClick={() => setSelectedRecipe(null)}
              className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur rounded-full z-10 hover:bg-white"
            >
              <X size={24} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-full bg-black/5">
                <img 
                  src={selectedRecipe.imageUrl || getRelevantFoodImage(selectedRecipe.name, selectedRecipe.category || 'Lunch')} 
                  alt={selectedRecipe.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 md:p-12 max-h-[80vh] overflow-y-auto">
                <div className="mb-8 flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-black/40 mb-2">{selectedRecipe.category} • {selectedRecipe.type}</p>
                    <h2 className="text-4xl font-serif italic mb-4">{selectedRecipe.name}</h2>
                  </div>
                  <button 
                    onClick={(e) => handleLike(selectedRecipe.id, e)}
                    className={cn(
                      "p-3 rounded-full transition-all",
                      userLikes.has(selectedRecipe.id) ? "bg-red-500 text-white" : "bg-black/5 text-black/40 hover:text-red-500"
                    )}
                  >
                    <Heart size={20} fill={userLikes.has(selectedRecipe.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <p className="text-black/60 leading-relaxed mb-8">{selectedRecipe.description}</p>

                <div className="grid grid-cols-4 gap-4 mb-10">
                  <div className="p-4 bg-black/5 rounded-3xl text-center">
                    <p className="text-[10px] uppercase text-black/40 mb-1">Calories</p>
                    <p className="text-lg font-bold">{selectedRecipe.calories}</p>
                  </div>
                  <div className="p-4 bg-black/5 rounded-3xl text-center">
                    <p className="text-[10px] uppercase text-black/40 mb-1">Protein</p>
                    <p className="text-lg font-bold">{selectedRecipe.protein}g</p>
                  </div>
                  <div className="p-4 bg-black/5 rounded-3xl text-center">
                    <p className="text-[10px] uppercase text-black/40 mb-1">Carbs</p>
                    <p className="text-lg font-bold">{selectedRecipe.carbs}g</p>
                  </div>
                  <div className="p-4 bg-black/5 rounded-3xl text-center">
                    <p className="text-[10px] uppercase text-black/40 mb-1">Fats</p>
                    <p className="text-lg font-bold">{selectedRecipe.fats}g</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-serif italic mb-4 flex items-center gap-2">
                      <ChefHat size={20} /> Ingredients
                    </h4>
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="text-sm flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-black/20 rounded-full" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-serif italic mb-4 flex items-center gap-2">
                      <Clock size={20} /> Instructions
                    </h4>
                    <ol className="space-y-4">
                      {selectedRecipe.instructions.map((step, i) => (
                        <li key={i} className="text-sm flex gap-4">
                          <span className="font-bold text-black/20">{i + 1}.</span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Recipe Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-8 md:p-12 relative my-8">
            <button 
              onClick={() => setShowAddForm(false)}
              className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-3xl font-serif italic mb-8">Share Your Recipe</h2>
            
            <form onSubmit={handleAddRecipe} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Recipe Name</label>
                  <input
                    type="text"
                    required
                    value={newRecipe.name}
                    onChange={e => setNewRecipe({...newRecipe, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10"
                    placeholder="e.g. Quinoa Pulao"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Category</label>
                    <select
                      value={newRecipe.category}
                      onChange={e => setNewRecipe({...newRecipe, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10"
                    >
                      <option>Breakfast</option>
                      <option>Lunch</option>
                      <option>Dinner</option>
                      <option>Snack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Type</label>
                    <select
                      value={newRecipe.type}
                      onChange={e => setNewRecipe({...newRecipe, type: e.target.value as any})}
                      className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10"
                    >
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-Veg</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Description</label>
                <textarea
                  required
                  value={newRecipe.description}
                  onChange={e => setNewRecipe({...newRecipe, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 h-24"
                  placeholder="Tell us about your dish..."
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-tighter font-semibold text-black/50 mb-1">Calories</label>
                  <input type="number" required value={newRecipe.calories} onChange={e => setNewRecipe({...newRecipe, calories: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg bg-black/5 border-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-tighter font-semibold text-black/50 mb-1">Protein (g)</label>
                  <input type="number" required value={newRecipe.protein} onChange={e => setNewRecipe({...newRecipe, protein: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg bg-black/5 border-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-tighter font-semibold text-black/50 mb-1">Carbs (g)</label>
                  <input type="number" required value={newRecipe.carbs} onChange={e => setNewRecipe({...newRecipe, carbs: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg bg-black/5 border-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-tighter font-semibold text-black/50 mb-1">Fats (g)</label>
                  <input type="number" required value={newRecipe.fats} onChange={e => setNewRecipe({...newRecipe, fats: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg bg-black/5 border-none" />
                </div>
              </div>

              {/* Dynamic Ingredients Input Section */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-2">Ingredients List</label>
                <div className="space-y-2 mb-3">
                  {(newRecipe.ingredients || []).map((ing, k) => (
                    <div key={k} className="flex items-center justify-between bg-black/5 px-4 py-2 rounded-xl text-sm gap-2">
                      <span>{ing}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setNewRecipe(p => ({
                            ...p,
                            ingredients: (p.ingredients || []).filter((_, i) => i !== k)
                          }));
                        }}
                        className="text-black/40 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {(newRecipe.ingredients || []).length === 0 && (
                    <p className="text-xs text-black/30 italic">No ingredients added yet. Enter down below.</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempIngredient}
                    onChange={e => setTempIngredient(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (tempIngredient.trim()) {
                          setNewRecipe(p => ({ ...p, ingredients: [...(p.ingredients || []), tempIngredient.trim()] }));
                          setTempIngredient('');
                        }
                      }
                    }}
                    placeholder="Add ingredient e.g. 100g Fresh Paneer..."
                    className="flex-1 px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tempIngredient.trim()) {
                        setNewRecipe(p => ({ ...p, ingredients: [...(p.ingredients || []), tempIngredient.trim()] }));
                        setTempIngredient('');
                      }
                    }}
                    className="px-4 bg-black text-white rounded-xl text-xs font-bold hover:bg-black/90"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Dynamic Instructions Input Section */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-2">Instructions Steps</label>
                <div className="space-y-2 mb-3">
                  {(newRecipe.instructions || []).map((step, k) => (
                    <div key={k} className="flex items-start justify-between bg-black/5 px-4 py-2 rounded-xl text-sm gap-2">
                      <span className="flex gap-2">
                        <strong className="text-black/40">{k + 1}.</strong>
                        <span>{step}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setNewRecipe(p => ({
                            ...p,
                            instructions: (p.instructions || []).filter((_, i) => i !== k)
                          }));
                        }}
                        className="text-black/40 hover:text-red-500 transition-colors shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {(newRecipe.instructions || []).length === 0 && (
                    <p className="text-xs text-black/30 italic">No instruction steps added yet. Enter down below.</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <textarea
                    value={tempInstruction}
                    onChange={e => setTempInstruction(e.target.value)}
                    placeholder="Add step description e.g. Heat honey and almond milk in a pot..."
                    className="flex-1 px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 text-sm h-16 resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tempInstruction.trim()) {
                        setNewRecipe(p => ({ ...p, instructions: [...(p.instructions || []), tempInstruction.trim()] }));
                        setTempInstruction('');
                      }
                    }}
                    className="px-4 bg-black text-white rounded-xl text-xs font-bold hover:bg-black/90 self-end h-11"
                  >
                    Add Step
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-4 border border-black/10 rounded-2xl font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-black text-white rounded-2xl font-medium hover:bg-black/90 transition-all"
                >
                  Post Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Utensils = ({ size }: { size: number }) => <ChefHat size={size} />;

