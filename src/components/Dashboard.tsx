import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { UserProfile, DailyLog, LoggedItem, FoodItem } from '../types';
import { format } from 'date-fns';
import { Plus, Search, Trash2, ChevronRight, ChevronLeft, Utensils, Flame, Zap, Droplets, Beef, Leaf } from 'lucide-react';
import { COMMON_FOODS } from '../constants';
import { calculateNutrients, calculateTargets } from '../lib/nutritionUtils';
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

export const Dashboard: React.FC<{ profile: UserProfile; user: any; onProfileUpdate?: (profile: UserProfile) => void }> = ({ profile, user, onProfileUpdate }) => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [weightInput, setWeightInput] = useState<number>(100);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [weeklyData, setWeeklyData] = useState<{ date: string; calories: number; protein: number; carbs: number; fats: number; fiber: number }[]>([]);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  // States for weekly measurement & goal check-ins
  const [weeklyWeight, setWeeklyWeight] = useState<number>(profile?.weight || 70);
  const [weeklyActivity, setWeeklyActivity] = useState<string>(profile?.activityLevel || 'moderately_active');
  const [weeklyGoal, setWeeklyGoal] = useState<string>(profile?.goal || 'maintenance');
  const [weeklyUpdateSuccess, setWeeklyUpdateSuccess] = useState<boolean>(false);
  const [dismissWeeklyPrompt, setDismissWeeklyPrompt] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      setWeeklyWeight(profile.weight);
      setWeeklyActivity(profile.activityLevel);
      setWeeklyGoal(profile.goal);
    }
  }, [profile]);

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
          totalFiber: 0,
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
          items: data.items || [],
          totalFiber: data.totalFiber || 0
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
          totalFiber: 0,
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `daily_logs/${logId}`);
    });

    return () => unsub();
  }, [selectedDate, currentUser]);

  // List of the past 7 days ending with today's date
  const getPast7Days = () => {
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      arr.push(format(d, 'yyyy-MM-dd'));
    }
    return arr;
  };

  useEffect(() => {
    if (!currentUser) return;

    const past7 = getPast7Days();

    if (currentUser.isDemo) {
      const data = past7.map((dStr, index) => {
        const localKey = `calorix_log_${currentUser.uid}_${dStr}`;
        const localData = localStorage.getItem(localKey);
        
        if (localData) {
          const parsed = JSON.parse(localData);
          return {
            date: dStr,
            calories: parsed.totalCalories || 0,
            protein: parsed.totalProtein || 0,
            carbs: parsed.totalCarbs || 0,
            fats: parsed.totalFats || 0,
            fiber: parsed.totalFiber || 0,
          };
        } else {
          // If it matches selectedDate and we currently have dailyLog state loaded
          if (dStr === selectedDate && dailyLog) {
            return {
              date: dStr,
              calories: dailyLog.totalCalories || 0,
              protein: dailyLog.totalProtein || 0,
              carbs: dailyLog.totalCarbs || 0,
              fats: dailyLog.totalFats || 0,
              fiber: dailyLog.totalFiber || 0,
            };
          }
          // Fallback static motivation data per day of week to motivate the demo user
          const seedFactor = [0.85, 0.95, 1.05, 0.75, 0.90, 0.98, 1.00][index % 7];
          const seededCalories = Math.round(profile.dailyCalorieTarget * seedFactor);
          const seededProtein = Math.round(profile.proteinTarget * seedFactor * 10) / 10;
          const seededCarbs = Math.round(profile.carbsTarget * seedFactor * 10) / 10;
          const seededFats = Math.round(profile.fatsTarget * seedFactor * 10) / 10;
          const seededFiber = Math.round((profile.fiberTarget || Math.round((profile.dailyCalorieTarget / 1000) * 14)) * seedFactor * 10) / 10;

          const seededPayload = {
            uid: currentUser.uid,
            date: dStr,
            items: [
              { name: 'Healthy Nutritious Meal', weight: 350, calories: seededCalories, protein: seededProtein, carbs: seededCarbs, fats: seededFats, fiber: seededFiber, timestamp: new Date().toISOString() }
            ],
            totalCalories: seededCalories,
            totalProtein: seededProtein,
            totalCarbs: seededCarbs,
            totalFats: seededFats,
            totalFiber: seededFiber,
          };
          localStorage.setItem(localKey, JSON.stringify(seededPayload));

          return {
            date: dStr,
            calories: seededCalories,
            protein: seededProtein,
            carbs: seededCarbs,
            fats: seededFats,
            fiber: seededFiber,
          };
        }
      });
      setWeeklyData(data);
      return;
    }

    // Firebase live database listener for historical nutrition charts
    const logsQuery = query(
      collection(db, 'daily_logs'),
      where('uid', '==', currentUser.uid),
      where('date', 'in', past7)
    );

    const unsubWeekly = onSnapshot(logsQuery, (snapshot) => {
      const dbLogsMap: { [date: string]: any } = {};
      snapshot.docs.forEach(docSnap => {
        const d = docSnap.data();
        dbLogsMap[d.date] = d;
      });

      const data = past7.map(dStr => {
        const log = dbLogsMap[dStr];
        if (log) {
          return {
            date: dStr,
            calories: log.totalCalories || 0,
            protein: log.totalProtein || 0,
            carbs: log.totalCarbs || 0,
            fats: log.totalFats || 0,
            fiber: log.totalFiber || 0,
          };
        } else if (dStr === selectedDate && dailyLog) {
          return {
            date: dStr,
            calories: dailyLog.totalCalories || 0,
            protein: dailyLog.totalProtein || 0,
            carbs: dailyLog.totalCarbs || 0,
            fats: dailyLog.totalFats || 0,
            fiber: dailyLog.totalFiber || 0,
          };
        } else {
          return {
            date: dStr,
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            fiber: 0,
          };
        }
      });
      setWeeklyData(data);
    }, (error) => {
      console.error('Error fetching weekly logs:', error);
    });

    return () => unsubWeekly();
  }, [currentUser, selectedDate, dailyLog, profile]);

  const handleSaveWeeklyCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !profile) return;

    const newTargets = calculateTargets(
      weeklyWeight,
      profile.height,
      profile.age,
      profile.gender,
      weeklyActivity,
      weeklyGoal
    );

    const updatedProfile: UserProfile = {
      ...profile,
      weight: weeklyWeight,
      activityLevel: weeklyActivity as any,
      goal: weeklyGoal as any,
      ...newTargets,
      lastMeasurementsUpdated: new Date().toISOString(),
    };

    if (currentUser.isDemo) {
      localStorage.setItem('calorix_profile_demo', JSON.stringify(updatedProfile));
    } else {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), updatedProfile);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}`);
      }
    }

    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }

    setWeeklyUpdateSuccess(true);
    setTimeout(() => {
      setWeeklyUpdateSuccess(false);
      setDismissWeeklyPrompt(true);
    }, 2800);
  };

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
      fiber: nutrients.fiber,
      timestamp: new Date().toISOString(),
    };

    const updatedItems = [...dailyLog.items, newItem];
    const totals = updatedItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fats: acc.fats + item.fats,
        fiber: acc.fiber + (item.fiber || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
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
      totalFiber: Math.round(totals.fiber * 10) / 10,
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
        fiber: acc.fiber + (item.fiber || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
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
      totalFiber: Math.round(totals.fiber * 10) / 10,
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

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const isTodayOrFuture = selectedDate >= todayStr;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Date Selector */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-black/5">
        <button onClick={() => {
          const d = new Date(selectedDate);
          d.setDate(d.getDate() - 1);
          setSelectedDate(format(d, 'yyyy-MM-dd'));
        }} className="p-2 hover:bg-black/5 rounded-full" title="Previous Day"><ChevronLeft size={20} /></button>
        
        <span 
          style={{ fontFamily: 'Times New Roman', fontWeight: 'bold', fontStyle: 'normal' }}
          className="text-base text-stone-800 px-1.5 text-center"
        >
          {format(new Date(selectedDate), 'MMMM d, yyyy')}
        </span>

        {!isTodayOrFuture ? (
          <button onClick={() => {
            const d = new Date(selectedDate);
            d.setDate(d.getDate() + 1);
            setSelectedDate(format(d, 'yyyy-MM-dd'));
          }} className="p-2 hover:bg-black/5 rounded-full" title="Next Day">
            <ChevronRight size={20} />
          </button>
        ) : (
          <div className="w-9 h-9" /> /* Empty placeholder to maintain classic centered alignment */
        )}
      </div>

      {/* Weekly Measurements & Goals Check-In Form (Triggered precisely after 1 week) */}
      {(() => {
        const joinedDate = profile?.createdAt ? new Date(profile.createdAt) : new Date();
        const now = new Date();
        const diffTime = now.getTime() - joinedDate.getTime();
        const daysSinceJoin = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        const lastUpdate = profile?.lastMeasurementsUpdated ? new Date(profile.lastMeasurementsUpdated) : null;
        const daysSinceLastUpdate = lastUpdate ? Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)) : null;

        const isWeeklyCheckInDue = daysSinceJoin >= 7 && (lastUpdate === null || daysSinceLastUpdate === null || daysSinceLastUpdate >= 7);

        const getNextCheckInDate = () => {
          const baseDate = lastUpdate || joinedDate;
          const nextDate = new Date(baseDate.getTime());
          nextDate.setDate(nextDate.getDate() + 7);
          return format(nextDate, 'MMMM d, yyyy');
        };

        if (!isWeeklyCheckInDue || dismissWeeklyPrompt) {
          return (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-stone-100/50 p-3 px-5 rounded-2xl border border-black/5 text-[11px] text-stone-600 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                <span>Next Weekly Target Check-In: <strong className="text-stone-900">{getNextCheckInDate()}</strong> ({7 - (daysSinceLastUpdate ?? daysSinceJoin % 7)} days left)</span>
              </div>
              <button 
                onClick={() => setDismissWeeklyPrompt(false)} 
                className="text-orange-600 hover:text-orange-700 font-bold underline text-[10px] uppercase cursor-pointer bg-transparent border-none p-0"
                title="Force Trigger Weekly Update Form"
              >
                (Perform Check-In Now)
              </button>
            </div>
          );
        }

        return (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 flex flex-col border border-orange-200/80 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden transition-all duration-300">
            <div className="absolute right-0 top-0 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-orange-700 font-extrabold text-xs uppercase tracking-widest font-mono">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                  Weekly Progress Check-In Due
                </div>
                <h3 className="text-2xl font-serif text-stone-900 font-black italic">Update Your Measurements & Goals</h3>
                <p className="text-xs md:text-sm text-stone-600 max-w-2xl leading-relaxed">
                  Exactly 7 days have passed! Keeping your weight and goals reviewed every single week ensures that your daily targets for <strong className="text-stone-800">calories, proteins, carbs, fats, and fiber</strong> match your body's real-time metabolic shift.
                </p>
              </div>
              <button 
                onClick={() => setDismissWeeklyPrompt(true)} 
                className="text-stone-400 hover:text-stone-600 text-xs font-mono border border-stone-200 hover:bg-stone-50 rounded-lg px-2.5 py-1.5 transition-all self-start"
              >
                Dismiss
              </button>
            </div>

            {weeklyUpdateSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800 space-y-2 animate-bounce">
                <h4 className="font-bold text-lg">🎉 Targets Successfully Recalculated!</h4>
                <p className="text-sm font-mono text-[11px]">Your new weight, activity multiplier, and goal metrics are saved. Your daily dashboard has adapted!</p>
              </div>
            ) : (
              <form onSubmit={handleSaveWeeklyCheckIn} className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/70 p-5 rounded-2xl border border-orange-100">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1.5">Current Weight (kg)</label>
                  <input
                    type="number"
                    value={weeklyWeight}
                    onChange={(e) => setWeeklyWeight(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
                    required
                    min="30"
                    max="300"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1.5">Activity Multiplier</label>
                  <select
                    value={weeklyActivity}
                    onChange={(e) => setWeeklyActivity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-sans cursor-pointer"
                  >
                    <option value="sedentary">Sedentary (Office job)</option>
                    <option value="lightly_active">Lightly Active (1-2 days/week)</option>
                    <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                    <option value="very_active">Very Active (6-7 days/week)</option>
                    <option value="extra_active">Extra Active (Athlete)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1.5">Primary Target Fitness Goal</label>
                  <select
                    value={weeklyGoal}
                    onChange={(e) => setWeeklyGoal(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-sans cursor-pointer"
                  >
                    <option value="fat_loss">Fat Loss</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="muscle_gain">Muscle Gain</option>
                  </select>
                </div>

                <div className="sm:col-span-3 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-black hover:bg-stone-900 text-white font-semibold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    Recalculate & Save New Targets
                  </button>
                </div>
              </form>
            )}
          </div>
        );
      })()}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="col-span-1 sm:col-span-2 lg:col-span-2 bg-black text-white p-6 rounded-[32px] relative overflow-hidden shadow-sm">
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

        {/* Protein */}
        <div className="bg-white p-6 rounded-[32px] border border-black/5 flex flex-col justify-between shadow-sm">
          <div>
            <Zap className="text-orange-500 mb-2" size={20} />
            <p className="text-[10px] uppercase tracking-widest text-black/40">Protein</p>
            <p className="text-xl font-serif italic">{dailyLog?.totalProtein || 0}g</p>
          </div>
          <p className="text-[10px] text-black/40">Target: {profile.proteinTarget}g</p>
        </div>

        {/* Carbs */}
        <div className="bg-white p-6 rounded-[32px] border border-black/5 flex flex-col justify-between shadow-sm">
          <div>
            <Droplets className="text-blue-500 mb-2" size={20} />
            <p className="text-[10px] uppercase tracking-widest text-black/40">Carbs</p>
            <p className="text-xl font-serif italic">{dailyLog?.totalCarbs || 0}g</p>
          </div>
          <p className="text-[10px] text-black/40">Target: {profile.carbsTarget}g</p>
        </div>

        {/* Fats */}
        <div className="bg-white p-6 rounded-[32px] border border-black/5 flex flex-col justify-between shadow-sm">
          <div>
            <Beef className="text-rose-500 mb-2" size={20} />
            <p className="text-[10px] uppercase tracking-widest text-black/40">Fats</p>
            <p className="text-xl font-serif italic">{dailyLog?.totalFats || 0}g</p>
          </div>
          <p className="text-[10px] text-black/40">Target: {profile.fatsTarget}g</p>
        </div>

        {/* Fiber */}
        <div className="bg-white p-6 rounded-[32px] border border-black/5 flex flex-col justify-between shadow-sm">
          <div>
            <Leaf className="text-emerald-500 mb-2" size={20} />
            <p className="text-[10px] uppercase tracking-widest text-black/40">Fiber</p>
            <p className="text-xl font-serif italic">{dailyLog?.totalFiber || 0}g</p>
          </div>
          <p className="text-[10px] text-black/40">
            Target: {profile.fiberTarget || Math.round((profile.dailyCalorieTarget / 1000) * 14)}g
          </p>
        </div>
      </div>

      {/* 7-Day Weekly Nutrition History Card */}
      <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-black/5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif text-stone-900 font-extrabold italic">Weekly Nutrition History</h3>
            <p className="text-xs text-black/50 mt-1">
              Consistent food tracking keeps you motivated on your <strong className="text-orange-500 font-semibold">{profile.goal.replace('_', ' ')}</strong> journey.
            </p>
          </div>
          {/* Interactive Tooltip Pane/Display */}
          {(() => {
            const activeDay = weeklyData.find(d => d.date === (hoveredDay || selectedDate)) || weeklyData.find(d => d.date === selectedDate);
            if (!activeDay) return null;
            const isSel = activeDay.date === selectedDate;
            return (
              <div className="bg-black/5 px-4 py-2.5 rounded-2xl text-xs space-y-1 self-start md:self-auto min-w-[200px]">
                <div className="flex justify-between font-bold text-stone-800">
                  <span>{format(new Date(activeDay.date), 'EEEE, MMM d')}</span>
                  {isSel && <span className="text-orange-600 font-bold text-[10px] uppercase">Selected</span>}
                </div>
                <div className="text-stone-700">
                  <span className="font-semibold text-stone-900">{activeDay.calories} kcal</span> / {profile.dailyCalorieTarget} kcal
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] text-black/50 uppercase font-mono mt-1 pt-1 border-t border-black/5">
                  <span>P: {activeDay.protein}g</span>
                  <span>C: {activeDay.carbs}g</span>
                  <span>F: {activeDay.fats}g</span>
                  <span>Fb: {activeDay.fiber}g</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Visual Columns (7 bars) */}
        <div className="grid grid-cols-7 gap-1.5 md:gap-4 pt-4 relative">
          {/* Guide Line representing Calorie Target */}
          {(() => {
            const maxVal = Math.max(profile.dailyCalorieTarget, ...weeklyData.map(d => d.calories), 1);
            const lineOffsetPct = 100 - (profile.dailyCalorieTarget / maxVal) * 100;
            return (
              <div 
                className="absolute left-0 right-0 border-t border-dashed border-orange-500/30 z-0 select-none pointer-events-none"
                style={{ top: `${lineOffsetPct}%`, marginTop: '16px' }}
              >
                <span className="absolute right-0 -top-4 bg-white/95 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-orange-600 border border-orange-200">
                  TARGET: {profile.dailyCalorieTarget}
                </span>
              </div>
            );
          })()}

          {weeklyData.map((day, idx) => {
            const maxVal = Math.max(profile.dailyCalorieTarget, ...weeklyData.map(d => d.calories), 1);
            const heightPct = (day.calories / maxVal) * 100;
            const isSelected = day.date === selectedDate;
            const dayLabel = format(new Date(day.date), 'EEE');
            const isExceeded = day.calories > profile.dailyCalorieTarget;

            return (
              <div 
                key={day.date}
                className="flex flex-col items-center group cursor-pointer relative z-10"
                onClick={() => setSelectedDate(day.date)}
                onMouseEnter={() => setHoveredDay(day.date)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Vertical Bar Base */}
                <div className="w-full h-32 md:h-40 bg-black/5 rounded-2xl flex flex-col justify-end overflow-hidden transition-all duration-300 relative group-hover:bg-black/10">
                  {/* Dynamic Filled Bar */}
                  <div 
                    className={cn(
                      "w-full rounded-t-xl transition-all duration-500",
                      isSelected 
                        ? (isExceeded ? "bg-amber-500" : "bg-black")
                        : (isExceeded ? "bg-amber-400" : "bg-stone-400 group-hover:bg-stone-500")
                    )}
                    style={{ height: `${Math.max(4, Math.min(100, heightPct))}%` }}
                  />

                  {/* Active highlight Border */}
                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-orange-500 rounded-2xl pointer-events-none" />
                  )}
                </div>

                {/* Day Labels Under Column */}
                <span className={cn(
                  "text-[10px] md:text-xs mt-2 transition-all font-mono",
                  isSelected 
                    ? "text-orange-600 font-bold" 
                    : "text-black/40 group-hover:text-black font-semibold"
                )}>
                  {dayLabel}
                </span>

                {/* Day of Month Under Column */}
                <span className={cn(
                  "text-[8px] md:text-[10px] opacity-60 font-mono",
                  isSelected ? "text-orange-500 font-bold" : "text-black/30"
                )}>
                  {format(new Date(day.date), 'd')}
                </span>
              </div>
            );
          })}
        </div>

        {/* Informative Footer / Call to action */}
        <div className="flex items-center gap-2 bg-stone-50/50 p-4 rounded-2xl text-[11px] text-black/60 border border-stone-200/55 mt-4">
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <p>
            <strong>Interactive Graph View:</strong> Click on any day column in the tracker above to view its logged meals, calories remaining, or add custom entries for that date!
          </p>
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
