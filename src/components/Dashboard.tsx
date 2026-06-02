import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { UserProfile, DailyLog, LoggedItem, FoodItem } from '../types';
import { format } from 'date-fns';
import { Plus, Search, Trash2, ChevronRight, ChevronLeft, Utensils, Flame, Zap, Droplets } from 'lucide-react';
import { COMMON_FOODS } from '../constants';
import { calculateNutrients } from '../lib/nutritionUtils';
import { cn } from '../lib/utils';

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

export const Dashboard: React.FC<{ profile: UserProfile; user: any }> = ({ profile, user }) => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [weightInput, setWeightInput] = useState<number>(100);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const currentUser = user || auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.isDemo) {
      const localKey = `calorix_log_${currentUser.uid}_${selectedDate}`;
      const localData = localStorage.getItem(localKey);
      if (localData) {
        setDailyLog(JSON.parse(localData));
      } else {
        setDailyLog({
          uid: currentUser.uid,
          date: selectedDate,
          items: [],
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFats: 0,
        });
      }
      return;
    }

    const logId = `${currentUser.uid}_${selectedDate}`;
    const unsub = onSnapshot(doc(db, 'daily_logs', logId), (docSnap) => {
      console.log('Daily log snapshot received:', docSnap.exists() ? 'exists' : 'new');
      if (docSnap.exists()) {
        const data = docSnap.data() as DailyLog;
        setDailyLog({
          ...data,
          uid: data.uid || currentUser!.uid,
          date: data.date || selectedDate,
          items: data.items || []
        });
      } else {
        setDailyLog({
          uid: currentUser!.uid,
          date: selectedDate,
          items: [],
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFats: 0,
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `daily_logs/${logId}`);
    });

    return () => unsub();
  }, [selectedDate, currentUser]);

  const addFoodToLog = async () => {
    console.log('addFoodToLog triggered', { selectedFood, weightInput, dailyLog, user: currentUser?.uid });
    if (!selectedFood || !currentUser) {
      console.error('Missing selectedFood or currentUser');
      return;
    }
    
    if (!dailyLog) {
      console.warn('Daily log not initialized yet');
      return;
    }

    const nutrients = calculateNutrients(selectedFood, weightInput);
    const newItem: LoggedItem = {
      ...selectedFood,
      weight: weightInput,
      calories: nutrients.calories,
      protein: nutrients.protein,
      carbs: nutrients.carbs,
      fats: nutrients.fats,
      timestamp: new Date().toISOString(),
    };

    const updatedItems = [...dailyLog.items, newItem];
    const totals = updatedItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fats: acc.fats + item.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    const logId = `${currentUser.uid}_${selectedDate}`;
    const payload = {
      uid: currentUser.uid,
      date: selectedDate,
      items: updatedItems,
      totalCalories: Math.round(totals.calories),
      totalProtein: Math.round(totals.protein * 10) / 10,
      totalCarbs: Math.round(totals.carbs * 10) / 10,
      totalFats: Math.round(totals.fats * 10) / 10,
    };
    
    console.log('Saving log to path:', `daily_logs/${logId}`, 'with payload:', payload);

    if (currentUser.isDemo) {
      const localKey = `calorix_log_${currentUser.uid}_${selectedDate}`;
      localStorage.setItem(localKey, JSON.stringify(payload));
      setDailyLog(payload);
    } else {
      try {
        await setDoc(doc(db, 'daily_logs', logId), payload);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `daily_logs/${logId}`);
      }
    }

    setShowSearch(false);
    setSelectedFood(null);
    setSearchQuery('');
  };

  const removeItem = async (index: number) => {
    console.log('removeItem triggered', { index, dailyLog, user: currentUser?.uid });
    if (!dailyLog || !currentUser) return;

    const updatedItems = dailyLog.items.filter((_, i) => i !== index);
    const totals = updatedItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fats: acc.fats + item.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    const logId = `${currentUser.uid}_${selectedDate}`;
    const payload = {
      uid: currentUser.uid,
      date: selectedDate,
      items: updatedItems,
      totalCalories: Math.round(totals.calories),
      totalProtein: Math.round(totals.protein * 10) / 10,
      totalCarbs: Math.round(totals.carbs * 10) / 10,
      totalFats: Math.round(totals.fats * 10) / 10,
    };

    console.log('Removing item, new payload at path:', `daily_logs/${logId}`, 'payload:', payload);

    if (currentUser.isDemo) {
      const localKey = `calorix_log_${currentUser.uid}_${selectedDate}`;
      localStorage.setItem(localKey, JSON.stringify(payload));
      setDailyLog(payload);
    } else {
      try {
        await setDoc(doc(db, 'daily_logs', logId), payload);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `daily_logs/${logId}`);
      }
    }
  };

  const filteredFoods = COMMON_FOODS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const progress = dailyLog ? (dailyLog.totalCalories / profile.dailyCalorieTarget) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Date Selector */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-black/5">
        <button onClick={() => {
          const d = new Date(selectedDate);
          d.setDate(d.getDate() - 1);
          setSelectedDate(format(d, 'yyyy-MM-dd'));
        }} className="p-2 hover:bg-black/5 rounded-full"><ChevronLeft size={20} /></button>
        <span className="font-serif italic text-lg">{format(new Date(selectedDate), 'MMMM d, yyyy')}</span>
        <button onClick={() => {
          const d = new Date(selectedDate);
          d.setDate(d.getDate() + 1);
          setSelectedDate(format(d, 'yyyy-MM-dd'));
        }} className="p-2 hover:bg-black/5 rounded-full"><ChevronRight size={20} /></button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-black text-white p-6 rounded-[32px] relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[11px] uppercase tracking-widest opacity-60 mb-1">Calories Remaining</p>
            <h3 className="text-4xl font-serif italic">{Math.max(0, profile.dailyCalorieTarget - (dailyLog?.totalCalories || 0))}</h3>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-500" style={{ width: `${Math.min(100, progress)}%` }}></div>
            </div>
            <p className="mt-2 text-xs opacity-60">Goal: {profile.dailyCalorieTarget} kcal</p>
          </div>
          <Flame className="absolute -right-4 -bottom-4 opacity-10" size={120} />
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-black/5 flex flex-col justify-between">
          <div>
            <Zap className="text-orange-500 mb-2" size={20} />
            <p className="text-[10px] uppercase tracking-widest text-black/40">Protein</p>
            <p className="text-xl font-serif italic">{dailyLog?.totalProtein || 0}g</p>
          </div>
          <p className="text-[10px] text-black/40">Target: {profile.proteinTarget}g</p>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-black/5 flex flex-col justify-between">
          <div>
            <Droplets className="text-blue-500 mb-2" size={20} />
            <p className="text-[10px] uppercase tracking-widest text-black/40">Carbs</p>
            <p className="text-xl font-serif italic">{dailyLog?.totalCarbs || 0}g</p>
          </div>
          <p className="text-[10px] text-black/40">Target: {profile.carbsTarget}g</p>
        </div>
      </div>

      {/* Food Log */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-black/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif italic">Today's Log</h3>
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 bg-black text-white rounded-full hover:scale-110 transition-transform"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {!dailyLog ? (
            <div className="text-center py-12 text-black/40 animate-pulse">
              <p className="text-sm italic">Loading log...</p>
            </div>
          ) : dailyLog.items.length === 0 ? (
            <div className="text-center py-12 px-6 bg-orange-50 rounded-[32px] border border-orange-100">
              <Utensils className="mx-auto mb-4 text-orange-500 opacity-60" size={48} />
              <h4 className="text-xl font-serif italic text-orange-900 mb-2">What did you eat?</h4>
              <p className="text-sm text-orange-700/70 mb-6">Forgot to share with me? Log your meals now to stay on track with your {profile.goal} goal!</p>
              <button 
                onClick={() => setShowSearch(true)}
                className="px-8 py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
              >
                Log My First Meal
              </button>
            </div>
          ) : (
            dailyLog.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-black/5 rounded-2xl group">
                <div>
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-xs text-black/40">{item.weight}g • {item.calories} kcal</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-black/40 uppercase tracking-tighter">P: {item.protein}g • C: {item.carbs}g • F: {item.fats}g</p>
                  </div>
                  <button 
                    onClick={() => removeItem(idx)} 
                    className="text-red-500 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[32px] p-8 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif italic">Add Food</h3>
              <button onClick={() => setShowSearch(false)} className="text-black/40 hover:text-black">Close</button>
            </div>

            {!selectedFood ? (
              <>
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={18} />
                  <input
                    type="text"
                    placeholder="Search food (e.g. Rice, Paneer...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/5 rounded-xl border-none focus:ring-2 focus:ring-black/10"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto flex-1 space-y-2">
                  {filteredFoods.map(food => (
                    <button
                      key={food.id}
                      onClick={() => {
                        setSelectedFood(food);
                        setWeightInput(food.servingSize || 100);
                      }}
                      className="w-full text-left p-4 hover:bg-black/5 rounded-xl transition-colors flex justify-between items-center"
                    >
                      <span>{food.name}</span>
                      <span className="text-xs text-black/40">{food.calories} kcal / 100g</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-black/5 rounded-2xl">
                  <h4 className="font-serif italic text-lg">{selectedFood.name}</h4>
                  <p className="text-sm text-black/40">{selectedFood.calories} kcal per 100g</p>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Weight (grams)</label>
                  <input
                    type="number"
                    value={weightInput}
                    onChange={(e) => setWeightInput(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-black/5 rounded-lg">
                    <p className="text-[10px] text-black/40 uppercase">Protein</p>
                    <p className="font-bold">{calculateNutrients(selectedFood, weightInput).protein}g</p>
                  </div>
                  <div className="p-2 bg-black/5 rounded-lg">
                    <p className="text-[10px] text-black/40 uppercase">Carbs</p>
                    <p className="font-bold">{calculateNutrients(selectedFood, weightInput).carbs}g</p>
                  </div>
                  <div className="p-2 bg-black/5 rounded-lg">
                    <p className="text-[10px] text-black/40 uppercase">Fats</p>
                    <p className="font-bold">{calculateNutrients(selectedFood, weightInput).fats}g</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setSelectedFood(null)} className="flex-1 py-3 border border-black/10 rounded-xl font-medium">Back</button>
                  <button onClick={addFoodToLog} className="flex-1 py-3 bg-black text-white rounded-xl font-medium">Add to Log</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
