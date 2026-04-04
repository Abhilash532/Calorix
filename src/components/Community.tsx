import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, query, limit, orderBy, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { UserProfile, Recipe } from '../types';
import { Users, Target, TrendingUp, Award, Heart, MessageCircle, Share2, Flame, Zap, Droplets, Trophy, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

const handleFirestoreError = (error: any, operationType: OperationType, path: string) => {
  const errInfo = {
    error: error?.message || String(error),
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    }
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
};

interface Activity {
  id: string;
  type: 'new_member' | 'new_recipe' | 'goal_reached';
  user: Partial<UserProfile>;
  timestamp: string;
  data?: any;
  cheers?: number;
}

export const Community: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCheers, setUserCheers] = useState<Set<string>>(new Set());
  
  const CREATOR_EMAIL = 'aabhi20604@gmail.com';
  const isCreator = auth.currentUser?.email === CREATOR_EMAIL;

  useEffect(() => {
    // Fetch Users
    const usersQuery = query(collection(db, 'users'), limit(50));
    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      const userList = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsers(userList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    // Fetch Recent Recipes for activity
    const recipesQuery = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'), limit(10));
    const unsubRecipes = onSnapshot(recipesQuery, (snapshot) => {
      const recipeList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe));
      setRecipes(recipeList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'recipes');
    });

    // Fetch Cheers (likes for activities)
    if (auth.currentUser) {
      const cheersQuery = query(collection(db, 'cheers'));
      const unsubCheers = onSnapshot(cheersQuery, (snapshot) => {
        const cheeredIds = new Set(
          snapshot.docs
            .filter(doc => doc.data().uid === auth.currentUser?.uid)
            .map(doc => doc.data().activityId)
        );
        setUserCheers(cheeredIds);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'cheers');
      });
      return () => { unsubUsers(); unsubRecipes(); unsubCheers(); };
    }

    return () => { unsubUsers(); unsubRecipes(); };
  }, []);

  // Derive activities from users and recipes
  useEffect(() => {
    const derivedActivities: Activity[] = [];

    // New Members
    users.forEach(user => {
      derivedActivities.push({
        id: `user_${user.uid}`,
        type: 'new_member',
        user: { displayName: user.displayName, email: user.email, uid: user.uid },
        timestamp: user.createdAt || new Date().toISOString(),
        data: { goal: user.goal }
      });
    });

    // New Recipes
    recipes.forEach(recipe => {
      derivedActivities.push({
        id: `recipe_${recipe.id}`,
        type: 'new_recipe',
        user: { displayName: recipe.authorName, uid: recipe.authorUid },
        timestamp: recipe.createdAt || new Date().toISOString(),
        data: { recipeName: recipe.name, recipeId: recipe.id, category: recipe.category }
      });
    });

    // Sort by timestamp
    setActivities(derivedActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 20));
  }, [users, recipes]);

  const handleCheer = async (activityId: string) => {
    if (!auth.currentUser) return;
    const cheerId = `${auth.currentUser.uid}_${activityId}`;
    const cheerRef = doc(db, 'cheers', cheerId);

    if (userCheers.has(activityId)) {
      await deleteDoc(cheerRef);
    } else {
      await setDoc(cheerRef, { uid: auth.currentUser.uid, activityId, timestamp: new Date().toISOString() });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[48px] bg-black p-12 text-white">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-display font-black tracking-tighter mb-6">
              THE FEED<span className="text-orange-500">.</span>
            </h2>
            <p className="text-lg text-white/60 leading-relaxed mb-8">
              Welcome to the heart of Calorix. Real people, real goals, real progress. 
              Cheer for your peers and get inspired by the community's journey.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-orange-500/20 to-transparent" />
          <Users className="absolute -right-12 -top-12 text-white/10" size={400} />
        </div>
      </div>

      {/* Creator Stats Dashboard */}
      {isCreator && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><Users size={20} /></div>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Growth</span>
            </div>
            <h4 className="text-3xl font-display font-bold">{users.length}</h4>
            <p className="text-xs text-black/40">Total Members</p>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 text-green-500 rounded-2xl"><Target size={20} /></div>
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Focus</span>
            </div>
            <h4 className="text-3xl font-display font-bold">{users.filter(u => u.goal === 'weight_loss').length}</h4>
            <p className="text-xs text-black/40">Weight Loss Goal</p>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl"><TrendingUp size={20} /></div>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Power</span>
            </div>
            <h4 className="text-3xl font-display font-bold">{users.filter(u => u.goal === 'muscle_gain').length}</h4>
            <p className="text-xs text-black/40">Muscle Gain Goal</p>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl"><Star size={20} /></div>
              <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Content</span>
            </div>
            <h4 className="text-3xl font-display font-bold">{recipes.length}</h4>
            <p className="text-xs text-black/40">Recipes Shared</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Activity Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-display font-bold">Recent Activity</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-black/40 uppercase tracking-widest">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live Now
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-black/5 rounded-[32px] animate-pulse" />
                ))
              ) : activities.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[48px] border border-dashed border-black/10">
                  <Award className="mx-auto mb-4 text-black/10" size={64} />
                  <p className="text-black/40 font-serif italic">The community is quiet... be the first to share!</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center font-display font-black text-2xl">
                          {activity.user.displayName?.[0] || activity.user.email?.[0] || '?'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                          {activity.type === 'new_member' && <Star size={14} className="text-yellow-500" fill="currentColor" />}
                          {activity.type === 'new_recipe' && <ChefHat size={14} className="text-orange-500" />}
                          {activity.type === 'goal_reached' && <Trophy size={14} className="text-green-500" />}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-lg group-hover:text-orange-500 transition-colors">
                            {activity.user.displayName || 'Anonymous User'}
                          </h4>
                          <span className="text-[10px] font-bold text-black/20 uppercase tracking-widest">
                            {formatDistanceToNow(new Date(activity.timestamp))} ago
                          </span>
                        </div>

                        <div className="text-black/60 mb-6">
                          {activity.type === 'new_member' && (
                            <p>Just joined Calorix with a goal of <span className="text-black font-bold">{activity.data.goal.replace('_', ' ')}</span>. Welcome to the family!</p>
                          )}
                          {activity.type === 'new_recipe' && (
                            <p>Shared a new <span className="text-black font-bold">{activity.data.category}</span> recipe: <span className="italic font-serif">"{activity.data.recipeName}"</span></p>
                          )}
                        </div>

                        <div className="flex items-center gap-6">
                          <button 
                            onClick={() => handleCheer(activity.id)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all",
                              userCheers.has(activity.id) 
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-200" 
                                : "bg-black/5 text-black/40 hover:bg-black hover:text-white"
                            )}
                          >
                            <Heart size={14} fill={userCheers.has(activity.id) ? "currentColor" : "none"} />
                            {userCheers.has(activity.id) ? 'Cheered!' : 'Cheer'}
                          </button>
                          <button className="flex items-center gap-2 text-black/20 hover:text-black transition-colors text-xs font-bold">
                            <MessageCircle size={14} />
                            Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: Community Highlights */}
        <div className="space-y-8">
          <div className="bg-black text-white p-10 rounded-[48px] relative overflow-hidden">
            <div className="relative z-10">
              <Trophy className="text-orange-500 mb-6" size={40} />
              <h3 className="text-2xl font-display font-black tracking-tighter mb-4">COMMUNITY MILESTONE</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                Together, we've tracked over <span className="text-white font-bold">1.2 Million</span> calories this month!
              </p>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-orange-500" 
                />
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-widest opacity-40">75% to Monthly Goal</p>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <Flame size={160} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[48px] border border-black/5 shadow-sm">
            <h4 className="text-xl font-display font-bold mb-6">Top Contributors</h4>
            <div className="space-y-6">
              {users.slice(0, 5).map((user, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center font-bold text-sm">
                      {user.displayName?.[0] || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{user.displayName || 'User'}</p>
                      <p className="text-[10px] text-black/40 uppercase tracking-widest">{user.goal.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="text-orange-500"><Award size={18} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChefHat = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
    <line x1="6" y1="17" x2="18" y2="17" />
  </svg>
);

