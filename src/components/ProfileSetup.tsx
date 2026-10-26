import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { calculateTargets } from '../lib/nutritionUtils';
import { Save, AlertCircle, Loader2, Flame, Zap, Beef, Droplets, Sparkles, X } from 'lucide-react';

interface ProfileSetupProps {
  user: any;
  initialProfile?: UserProfile | null;
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, initialProfile, onComplete, onCancel }) => {
  const [formData, setFormData] = useState({
    height: initialProfile?.height ?? 170,
    weight: initialProfile?.weight ?? 70,
    age: initialProfile?.age ?? 25,
    gender: (initialProfile?.gender ?? 'male') as 'male' | 'female' | 'other',
    activityLevel: (initialProfile?.activityLevel ?? 'moderately_active') as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active',
    goal: (initialProfile?.goal ?? 'maintenance') as 'fat_loss' | 'weight_loss' | 'muscle_gain' | 'maintenance',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live state of calculated targets
  const [calculatedTargets, setCalculatedTargets] = useState<{
    dailyCalorieTarget: number;
    proteinTarget: number;
    carbsTarget: number;
    fatsTarget: number;
    fiberTarget: number;
  } | null>(() => {
    try {
      const initialH = initialProfile?.height ?? 170;
      const initialW = initialProfile?.weight ?? 70;
      const initialA = initialProfile?.age ?? 25;
      const initialG = initialProfile?.gender ?? 'male';
      const initialAct = initialProfile?.activityLevel ?? 'moderately_active';
      const initialGoal = initialProfile?.goal ?? 'maintenance';
      return calculateTargets(initialW, initialH, initialA, initialG, initialAct, initialGoal);
    } catch {
      return null;
    }
  });

  // Re-compute calculated targets whenever user changes form values
  useEffect(() => {
    const h = Number(formData.height);
    const w = Number(formData.weight);
    const a = Number(formData.age);

    if (h > 0 && w > 0 && a > 0) {
      try {
        const computed = calculateTargets(w, h, a, formData.gender, formData.activityLevel, formData.goal);
        setCalculatedTargets(computed);
      } catch {
        setCalculatedTargets(null);
      }
    }
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    setError(null);

    // 1. Validate inputs
    const heightNum = Number(formData.height);
    const weightNum = Number(formData.weight);
    const ageNum = Number(formData.age);

    if (!formData.height || isNaN(heightNum) || heightNum < 50 || heightNum > 260) {
      setError('Please enter a valid height between 50 cm and 260 cm.');
      return;
    }
    if (!formData.weight || isNaN(weightNum) || weightNum < 20 || weightNum > 350) {
      setError('Please enter a valid weight between 20 kg and 350 kg.');
      return;
    }
    if (!formData.age || isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
      setError('Please enter a valid age between 10 and 120 years.');
      return;
    }
    if (!['male', 'female', 'other'].includes(formData.gender)) {
      setError('Please select a valid gender option.');
      return;
    }
    if (!['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'].includes(formData.activityLevel)) {
      setError('Please select a valid activity level.');
      return;
    }
    if (!['fat_loss', 'weight_loss', 'maintenance', 'muscle_gain'].includes(formData.goal)) {
      setError('Please select a valid fitness goal.');
      return;
    }

    const effectiveUser = user || auth.currentUser;
    if (!effectiveUser) {
      setError('Authentication session not found. Please log in or use Demo mode.');
      return;
    }

    setLoading(true);

    try {
      // 2 & 3. Calculate targets
      const targets = calculateTargets(
        weightNum,
        heightNum,
        ageNum,
        formData.gender,
        formData.activityLevel,
        formData.goal
      );

      if (
        isNaN(targets.dailyCalorieTarget) ||
        isNaN(targets.proteinTarget) ||
        isNaN(targets.carbsTarget) ||
        isNaN(targets.fatsTarget)
      ) {
        throw new Error('Calculated targets resulted in invalid numbers. Please check your inputs.');
      }

      // 4. Update React state with calculated targets
      setCalculatedTargets(targets);

      // 5. Construct clean UserProfile object with NO undefined fields (preventing Firestore errors)
      const cleanProfile: UserProfile = {
        uid: effectiveUser.uid,
        displayName: effectiveUser.displayName || effectiveUser.email?.split('@')[0] || 'User',
        email: effectiveUser.email || 'demo@calorix.com',
        height: Math.round(heightNum),
        weight: Math.round(weightNum * 10) / 10,
        age: Math.round(ageNum),
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        dailyCalorieTarget: targets.dailyCalorieTarget,
        proteinTarget: targets.proteinTarget,
        carbsTarget: targets.carbsTarget,
        fatsTarget: targets.fatsTarget,
        fiberTarget: targets.fiberTarget,
        createdAt: initialProfile?.createdAt || new Date().toISOString(),
      };

      if (initialProfile?.lastMeasurementsUpdated) {
        cleanProfile.lastMeasurementsUpdated = initialProfile.lastMeasurementsUpdated;
      }

      // 6. Save using appropriate data storage architecture
      if (effectiveUser.isDemo) {
        localStorage.setItem('calorix_profile_demo', JSON.stringify(cleanProfile));
      } else {
        await setDoc(doc(db, 'users', effectiveUser.uid), cleanProfile);
      }

      // 7. Transition to dashboard only after save succeeds
      onComplete(cleanProfile);
    } catch (err: any) {
      console.error('Failed to calculate or save profile:', err);
      setError(err?.message || 'Failed to save profile. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-black/5 relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif italic text-black">Set Up Your Profile</h2>
            <p className="text-xs text-black/50 mt-1">Calorix calculates your personalized metabolic targets based on science.</p>
          </div>
          {initialProfile && (
            <button
              onClick={() => onCancel ? onCancel() : onComplete(initialProfile)}
              className="p-2 text-black/40 hover:text-black rounded-full hover:bg-black/5 transition-all"
              title="Close and return to Dashboard"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle size={18} className="shrink-0 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Height (cm)</label>
            <input
              type="number"
              min="50"
              max="260"
              value={formData.height === 0 ? '' : formData.height}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : Number(e.target.value);
                setFormData({ ...formData, height: val });
                if (error) setError(null);
              }}
              className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-black"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Weight (kg)</label>
            <input
              type="number"
              min="20"
              max="350"
              step="0.1"
              value={formData.weight === 0 ? '' : formData.weight}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : Number(e.target.value);
                setFormData({ ...formData, weight: val });
                if (error) setError(null);
              }}
              className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-black"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Age</label>
            <input
              type="number"
              min="10"
              max="120"
              value={formData.age === 0 ? '' : formData.age}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : Number(e.target.value);
                setFormData({ ...formData, age: val });
                if (error) setError(null);
              }}
              className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-black"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => {
                setFormData({ ...formData, gender: e.target.value as any });
                if (error) setError(null);
              }}
              className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-black"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Activity Level</label>
            <select
              value={formData.activityLevel}
              onChange={(e) => {
                setFormData({ ...formData, activityLevel: e.target.value as any });
                if (error) setError(null);
              }}
              className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-black"
            >
              <option value="sedentary">Sedentary (Office job)</option>
              <option value="lightly_active">Lightly Active (1-2 days/week)</option>
              <option value="moderately_active">Moderately Active (3-5 days/week)</option>
              <option value="very_active">Very Active (6-7 days/week)</option>
              <option value="extra_active">Extra Active (Athlete)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Goal</label>
            <select
              value={formData.goal}
              onChange={(e) => {
                setFormData({ ...formData, goal: e.target.value as any });
                if (error) setError(null);
              }}
              className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-black"
            >
              <option value="fat_loss">Fat Loss (-500 kcal)</option>
              <option value="weight_loss">Weight Loss (-300 kcal)</option>
              <option value="maintenance">Maintenance</option>
              <option value="muscle_gain">Muscle Gain (+300 kcal)</option>
            </select>
          </div>

          {/* Live Calculated Target Preview */}
          {calculatedTargets && (
            <div className="md:col-span-2 bg-[#F9F9F6] border border-black/5 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles size={14} className="text-orange-500" />
                <span className="text-[11px] uppercase font-bold tracking-widest text-black/60">Estimated Daily Nutritional Targets</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white rounded-xl p-2.5 border border-black/5">
                  <span className="text-[10px] uppercase font-semibold text-black/40 block">Daily Cal</span>
                  <span className="text-base font-black text-black">{calculatedTargets.dailyCalorieTarget.toLocaleString()} <span className="text-[10px] font-normal text-black/50">kcal</span></span>
                </div>
                <div className="bg-white rounded-xl p-2.5 border border-black/5">
                  <span className="text-[10px] uppercase font-semibold text-black/40 block">Protein (30%)</span>
                  <span className="text-base font-black text-orange-600">{calculatedTargets.proteinTarget}g</span>
                </div>
                <div className="bg-white rounded-xl p-2.5 border border-black/5">
                  <span className="text-[10px] uppercase font-semibold text-black/40 block">Carbs (40%)</span>
                  <span className="text-base font-black text-amber-600">{calculatedTargets.carbsTarget}g</span>
                </div>
                <div className="bg-white rounded-xl p-2.5 border border-black/5">
                  <span className="text-[10px] uppercase font-semibold text-black/40 block">Fats (30%)</span>
                  <span className="text-base font-black text-blue-600">{calculatedTargets.fatsTarget}g</span>
                </div>
              </div>
            </div>
          )}

          <div className="md:col-span-2 mt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-black/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Calculating & Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Calculate Targets & Save</span>
                </>
              )}
            </button>
            {initialProfile && (
              <button
                type="button"
                disabled={loading}
                onClick={() => onCancel ? onCancel() : onComplete(initialProfile)}
                className="w-full py-3 bg-transparent text-black/50 hover:text-black rounded-xl text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-30"
              >
                Cancel & Return to Dashboard
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
