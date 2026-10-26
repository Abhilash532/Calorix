import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Dumbbell, 
  Flame, 
  CheckCircle, 
  Info, 
  Activity, 
  Apple, 
  Scale, 
  Clock, 
  Heart, 
  Layers, 
  RotateCcw,
  Plus,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { UserProfile, FoodItem } from '../types';
import { COMMON_FOODS } from '../constants';

interface BioLabProps {
  profile: UserProfile;
}

interface AlchemistIngredient {
  foodId: string;
  weight: number; // in grams
}

export const BioLab: React.FC<BioLabProps> = ({ profile }) => {
  const [activeSubTab, setActiveSubTab] = useState<'alchemist' | 'futurist'>('alchemist');

  // --- SUBTAB 1: PLATE ALCHEMIST STATES ---
  const [plateIngredients, setPlateIngredients] = useState<AlchemistIngredient[]>([
    { foodId: '6', weight: 150 }, // Chicken Breast
    { foodId: '1', weight: 150 }, // Cooked White Rice
    { foodId: '17', weight: 100 }, // Broccoli (Cooked)
  ]);
  const [customFoodForm, setCustomFoodForm] = useState({
    name: '',
    calories: 120,
    protein: 5,
    carbs: 20,
    fats: 2,
    fiber: 1
  });
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [localFoods, setLocalFoods] = useState<FoodItem[]>(COMMON_FOODS);

  // --- SUBTAB 2: METABOLIC FUTURIST STATES ---
  const [dailyCalorieBudget, setDailyCalorieBudget] = useState(profile.dailyCalorieTarget - 300);
  const [dailyProteinGrams, setDailyProteinGrams] = useState(Math.round(profile.proteinTarget + 10));
  const [cardioSessionsPerWeek, setCardioSessionsPerWeek] = useState(3);
  const [sleepScore, setSleepScore] = useState<'poor' | 'optimal'>('optimal');
  const [activeSimulationPreset, setActiveSimulationPreset] = useState<string>('custom');

  // Multiplier or modifiers or simulations calculations
  const [alchemistStats, setAlchemistStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    satietyIndex: 0,
    glycemicIndex: 0,
    thermicEffect: 0,
    mpsPotential: 0,
    synergyTips: [] as string[]
  });

  // Calculate Plate Nutrition values
  useEffect(() => {
    let totalCals = 0;
    let totalProt = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalFiber = 0;

    plateIngredients.forEach(ping => {
      const food = localFoods.find(f => f.id === ping.foodId);
      if (food) {
        const factor = ping.weight / 100;
        totalCals += food.calories * factor;
        totalProt += food.protein * factor;
        totalCarbs += food.carbs * factor;
        totalFats += food.fats * factor;
        totalFiber += (food.fiber || 0) * factor;
      }
    });

    totalCals = Math.round(totalCals);
    totalProt = Math.round(totalProt * 10) / 10;
    totalCarbs = Math.round(totalCarbs * 10) / 10;
    totalFats = Math.round(totalFats * 10) / 10;
    totalFiber = Math.round(totalFiber * 10) / 10;

    // Satiety Index calculation (custom heuristic formula centered around protein, fiber density vs simple carbs & calorie density)
    // Scale: 0 to 100
    // Factors: Protein weight relative to calories, Fiber relative to carbs, Fat satiety, volume.
    let satiety = 0;
    if (totalCals > 0) {
      const proteinWeightRatio = (totalProt * 4) / totalCals;
      const fiberCarbRatio = totalCarbs > 0 ? (totalFiber / totalCarbs) : 0;
      satiety = (proteinWeightRatio * 130) + (fiberCarbRatio * 180) + (totalFiber * 4);
      satiety = Math.min(100, Math.max(10, Math.round(satiety * 100) / 100 + 40));
    }

    // Glycemic Response Score (insulin response prediction)
    // Scale: 0 to 100
    // Higher is faster sugar spike. Carbs boost it, fiber, fat, and protein blunt it.
    let glycemic = 0;
    if (totalCarbs > 0) {
      const basicGlycemic = 70; // assume moderate carbohydrate base index
      const fiberBluntFactor = Math.min(0.5, totalFiber / (totalCarbs || 1));
      const fatProteinBluntFactor = Math.min(0.4, (totalProt + totalFats) / (totalCals || 1));
      glycemic = Math.max(15, Math.round(basicGlycemic * (1 - fiberBluntFactor * 1.2 - fatProteinBluntFactor * 0.9)));
    } else {
      glycemic = 10; // purely fat or protein
    }

    // Thermic Effect of Food (Calories burned digesting matching items)
    // 25% of protein calories, 8% of carbs, 2% of fats
    const tefCals = Math.round((totalProt * 4 * 0.25) + (totalCarbs * 4 * 0.08) + (totalFats * 9 * 0.02));

    // Muscle Protein Synthesis potential (threshold trigger is ~2.5 - 3g leucine which equates roughly to 25g - 30g total high quality protein)
    // Scale: 0 to 100% trigger rate
    const mps = Math.min(100, Math.round((totalProt / 25) * 100));

    // Generate smart nutritional synergy coaching feedback
    const synergyTips: string[] = [];
    if (totalCals > 0) {
      if (totalProt < 15) {
        synergyTips.push("⚠️ Sourcing extra protein triggers optimal muscle preservation during fat-loss campaigns.");
      } else if (totalProt >= 30) {
        synergyTips.push("✅ Excellent Protein Dose! Reaching 25g+ unlocks Muscle Protein Synthesis (MPS) thresholds.");
      }

      if (glycemic > 60) {
        synergyTips.push("🚨 Elevated Glycemic Response detected! Blunt this insulin spike by adding dietary fibers (like chia seeds or green veggies) to buffer glucose transit.");
      } else if (glycemic < 45 && totalCarbs > 15) {
        synergyTips.push("🌱 Metabolic Stability! High fiber content ensures a gradual slow-release glucose curve keeping insulin fully stabilized.");
      }

      if (totalFiber < 5 && totalCarbs > 20) {
        synergyTips.push("💡 Carb-to-Fiber mismatch: Integrate raw fiber inputs (e.g. spinach or seeds) to improve microbiome diversity & fullness.");
      }

      if (totalFats > 0 && totalFats < 5) {
        synergyTips.push("🥑 Absorption hint: Some vitamins (A, D, E, K) need healthy lipids. Consider adding 5-10g of healthy fats like avocado or almonds.");
      }

      if (tefCals > 40) {
        synergyTips.push(`🔥 High Thermic digestion: Because of high protein elements, your body burns about ${tefCals} kcal merely digesting this meal!`);
      }
    } else {
      synergyTips.push("Add ingredients above to start simulated nutritional synergy calculations.");
    }

    setAlchemistStats({
      calories: totalCals,
      protein: totalProt,
      carbs: totalCarbs,
      fats: totalFats,
      fiber: totalFiber,
      satietyIndex: satiety,
      glycemicIndex: glycemic,
      thermicEffect: tefCals,
      mpsPotential: mps,
      synergyTips
    });

  }, [plateIngredients, localFoods]);

  // Handle ingredient addition
  const addIngredientToPlate = (foodId: string) => {
    const existing = plateIngredients.find(p => p.foodId === foodId);
    if (existing) {
      setPlateIngredients(plateIngredients.map(p => 
        p.foodId === foodId ? { ...p, weight: p.weight + 50 } : p
      ));
    } else {
      setPlateIngredients([...plateIngredients, { foodId, weight: 100 }]);
    }
  };

  const removeIngredientFromPlate = (foodId: string) => {
    setPlateIngredients(plateIngredients.filter(p => p.foodId !== foodId));
  };

  const updateWeight = (foodId: string, value: number) => {
    setPlateIngredients(plateIngredients.map(p => 
      p.foodId === foodId ? { ...p, weight: Math.max(10, value) } : p
    ));
  };

  // Add custom food to local alchemy dataset
  const handleAddCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFoodForm.name) return;
    const newFood: FoodItem = {
      id: `custom_${Date.now()}`,
      name: customFoodForm.name,
      calories: Number(customFoodForm.calories),
      protein: Number(customFoodForm.protein),
      carbs: Number(customFoodForm.carbs),
      fats: Number(customFoodForm.fats),
      fiber: Number(customFoodForm.fiber),
    };
    setLocalFoods([newFood, ...localFoods]);
    addIngredientToPlate(newFood.id);
    setCustomFoodForm({ name: '', calories: 120, protein: 5, carbs: 20, fats: 2, fiber: 1 });
    setShowAddCustom(false);
  };

  // --- SUBTAB 2: SIMULATOR CALCULATIONS ---
  // Generate 12 weeks of data points
  // 1. Weekly calorie deficit rate
  // 2. Weight changes over time
  // 3. Metabolic slowdown representing natural body adjustment
  const run12WeekSimulation = () => {
    const dataPoints = [];
    let currentWeight = profile.weight;
    let bmrAdaptation = 0; // adaptation rate in kcal

    // Basic BMR based on user profile
    const baseBMR = profile.gender === 'male' 
      ? 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age)
      : 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    
    // TDEE estimate
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    };
    const mult = activityMultipliers[profile.activityLevel] || 1.375;
    const initialTDEE = baseBMR * mult;

    // Simulation loops for 12 weeks
    for (let week = 0; week <= 12; week++) {
      // Calculate adjusted BMR as weight decreases/increases
      const adjustedBMR = profile.gender === 'male'
        ? 88.362 + (13.397 * currentWeight) + (4.799 * profile.height) - (5.677 * profile.age)
        : 447.593 + (9.247 * currentWeight) + (3.098 * profile.height) - (4.330 * profile.age);

      const dynamicTDEE = adjustedBMR * mult - bmrAdaptation;

      // Calories from active target + extra cardio burned
      const workoutKcalBurn = (cardioSessionsPerWeek * 350) / 7; // spread daily
      const totalDailyExpenditure = dynamicTDEE + workoutKcalBurn;

      // Caloric Intake Gap
      const dailyGap = dailyCalorieBudget - totalDailyExpenditure; // negative means weight loss
      
      // Weekly change (1lb or 0.45kg is roughly 3500 kcal)
      // Modify weight change based on sleep and protein quality
      // If protein is too low, muscle mass is lost, BMR drops faster
      const proteinRequirementTarget = profile.weight * 1.6; // 1.6g per kg
      const proteinPercentageSatisfied = Math.min(1.5, dailyProteinGrams / (proteinRequirementTarget || 1));
      
      let weightModifier = 1.0; 
      if (sleepScore === 'poor') {
        weightModifier = 0.8; // harder to burn fat, metabolic stress
      }

      const weeklyKcalGap = dailyGap * 7;
      let weightDeltaKg = (weeklyKcalGap / 7700) * weightModifier;

      if (week > 0) {
        currentWeight += weightDeltaKg;
        // Natural metabolic slowdown model (higher deficit & low protein = higher metabolic adaptation)
        const deficitPercent = Math.max(0, (totalDailyExpenditure - dailyCalorieBudget) / totalDailyExpenditure);
        const adaptationDelta = (deficitPercent * 18 * (2 - proteinPercentageSatisfied));
        bmrAdaptation += Math.min(10, Math.max(0, adaptationDelta));
      }

      dataPoints.push({
        week,
        weight: Math.round(currentWeight * 10) / 10,
        metabolicSlowdown: Math.round(bmrAdaptation),
        leanRetentionRate: Math.round(Math.min(100, Math.max(60, 75 + (proteinPercentageSatisfied * 20) + (sleepScore === 'optimal' ? 5 : -10)))),
      });
    }

    return dataPoints;
  };

  const simulationData = run12WeekSimulation();
  const finalWeight = simulationData[12].weight;
  const totalChange = Math.round((finalWeight - profile.weight) * 10) / 10;
  const slowdown = simulationData[12].metabolicSlowdown;
  const retention = simulationData[12].leanRetentionRate;

  // Presets trigger state modification
  const handleApplyPreset = (presetKey: string) => {
    setActiveSimulationPreset(presetKey);
    const maintenanceCal = profile.dailyCalorieTarget;
    
    if (presetKey === 'lean_gain') {
      setDailyCalorieBudget(maintenanceCal + 250);
      setDailyProteinGrams(Math.round(profile.weight * 2.2));
      setCardioSessionsPerWeek(1);
      setSleepScore('optimal');
    } else if (presetKey === 'aggressive_cut') {
      setDailyCalorieBudget(maintenanceCal - 600);
      setDailyProteinGrams(Math.round(profile.weight * 2.4));
      setCardioSessionsPerWeek(5);
      setSleepScore('optimal');
    } else if (presetKey === 'weekend_splurge') {
      // Net average is fine but cheat days ruin structure
      setDailyCalorieBudget(maintenanceCal + 150);
      setDailyProteinGrams(Math.round(profile.weight * 1.4));
      setCardioSessionsPerWeek(1);
      setSleepScore('poor');
    } else if (presetKey === 'healthy_recomp') {
      setDailyCalorieBudget(maintenanceCal - 200);
      setDailyProteinGrams(Math.round(profile.weight * 2.0));
      setCardioSessionsPerWeek(3);
      setSleepScore('optimal');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 pb-20">
      
      {/* Visual Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-tr from-orange-400 to-amber-500 rounded-2xl text-white shadow-md shadow-orange-500/10">
              <Sparkles size={20} className="fill-white/20 animate-pulse" />
            </div>
            <span className="text-[10px] uppercase font-black bg-stone-900 text-white px-2.5 py-1 rounded-full tracking-widest leading-none">Aesthetic Bio-Lab</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-stone-900">
            METABOLIC & BIO-SYNERGY <span className="text-orange-500 font-serif italic">LAB</span>
          </h2>
          <p className="text-stone-500 text-sm mt-1 max-w-2xl font-medium">
            Step beyond static counts. Analyze biological synergy indices of your food combinations, or simulate habits to forecast your exact weight & muscle changes across a 12-week horizon.
          </p>
        </div>

        {/* Action Toggle Switch */}
        <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-black/5 self-start md:self-center">
          <button
            onClick={() => setActiveSubTab('alchemist')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${activeSubTab === 'alchemist' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
          >
            <Apple size={14} className={activeSubTab === 'alchemist' ? 'text-orange-500' : ''} />
            Plate Alchemist
          </button>
          <button
            onClick={() => setActiveSubTab('futurist')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${activeSubTab === 'futurist' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
          >
            <Activity size={14} className={activeSubTab === 'futurist' ? 'text-orange-500' : ''} />
            Metabolic Futurist
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- PANEL 1: PLATE ALCHEMIST --- */}
        {activeSubTab === 'alchemist' && (
          <motion.div
            key="alchemist-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            
            {/* Ingredients Selection Column */}
            <div className="lg:col-span-4 bg-white p-6 rounded-[36px] border border-black/5 shadow-sm flex flex-col h-[740px]">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-black text-stone-900 text-base uppercase tracking-tight">Plate Ingredients</h3>
                  <button
                    onClick={() => setShowAddCustom(!showAddCustom)}
                    className="text-xs bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full font-bold flex items-center gap-1 hover:bg-orange-100 transition-colors cursor-pointer"
                  >
                    <Plus size={12} /> Custom
                  </button>
                </div>
                <p className="text-xs text-stone-500 font-medium">Select and stack nutritional blocks on your metabolic plate.</p>
              </div>

              {/* Add Custom Food Form */}
              <AnimatePresence>
                {showAddCustom && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddCustomFood}
                    className="bg-stone-50 p-4 rounded-2xl mb-4 border border-black/5 overflow-hidden"
                  >
                    <h4 className="text-[10px] uppercase font-black text-stone-700 tracking-wider mb-2">New Alchemist Ingredient</h4>
                    <input
                      type="text"
                      placeholder="Ingredient Name (e.g. Avocado)"
                      value={customFoodForm.name}
                      onChange={(e) => setCustomFoodForm({ ...customFoodForm, name: e.target.value })}
                      required
                      className="w-full text-xs px-3 py-2 bg-white border border-black/5 rounded-xl mb-2 focus:outline-none focus:border-orange-400 font-semibold"
                    />
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <label className="text-[8px] font-bold text-stone-500 uppercase">Kcal/100g</label>
                        <input
                          type="number"
                          value={customFoodForm.calories}
                          onChange={(e) => setCustomFoodForm({ ...customFoodForm, calories: parseInt(e.target.value) || 0 })}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-black/5 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-stone-500 uppercase">Protein g/100g</label>
                        <input
                          type="number"
                          value={customFoodForm.protein}
                          onChange={(e) => setCustomFoodForm({ ...customFoodForm, protein: parseFloat(e.target.value) || 0 })}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-black/5 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-stone-500 uppercase">Carbs g/100g</label>
                        <input
                          type="number"
                          value={customFoodForm.carbs}
                          onChange={(e) => setCustomFoodForm({ ...customFoodForm, carbs: parseFloat(e.target.value) || 0 })}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-black/5 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-stone-500 uppercase">Fats g/100g</label>
                        <input
                          type="number"
                          value={customFoodForm.fats}
                          onChange={(e) => setCustomFoodForm({ ...customFoodForm, fats: parseFloat(e.target.value) || 0 })}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-black/5 rounded-lg"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-stone-900 text-white rounded-xl py-2 text-xs font-bold hover:bg-stone-800 tracking-wider"
                    >
                      Synthesize Ingredient
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Scrollable Food Choice List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {localFoods.map(food => {
                  const alreadyAdded = plateIngredients.some(p => p.foodId === food.id);
                  return (
                    <div 
                      key={food.id}
                      onClick={() => addIngredientToPlate(food.id)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex justify-between items-center ${alreadyAdded ? 'bg-orange-50/50 border-orange-200 shadow-sm' : 'bg-stone-50/30 border-black/5 hover:border-black/20'}`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="text-xs font-extrabold text-stone-900 truncate">{food.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5 mt-1 text-[10px] text-stone-500 font-semibold uppercase">
                          <span>{food.calories} kcal</span>
                          <span>•</span>
                          <span>P: {food.protein}g</span>
                          <span>•</span>
                          <span>C: {food.carbs}g</span>
                          <span>•</span>
                          <span>F: {food.fats}g</span>
                        </div>
                      </div>
                      <div className={`p-1.5 rounded-full ${alreadyAdded ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-500'}`}>
                        <Plus size={12} className="stroke-[3px]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Plate Interactive Workspace */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visual Customization & Sliders */}
                <div className="bg-white p-6 rounded-[36px] border border-black/5 shadow-sm flex flex-col justify-between min-h-[440px]">
                  <div>
                    <h3 className="font-black text-stone-900 text-base uppercase tracking-tight mb-1 flex items-center gap-1.5">
                      <Layers size={16} className="text-orange-500" /> Meal Plate Sliders
                    </h3>
                    <p className="text-xs text-stone-500 font-medium mb-4">Dynamically shift the food gram weights on the scale.</p>

                    {plateIngredients.length === 0 ? (
                      <div className="text-center py-12 flex flex-col items-center justify-center">
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Plate is Empty</p>
                        <p className="text-xs text-stone-400 mt-1 max-w-[200px]">Click elements from the menu to populate your meal.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                        {plateIngredients.map(ping => {
                          const food = localFoods.find(f => f.id === ping.foodId);
                          if (!food) return null;
                          return (
                            <div key={ping.foodId} className="space-y-1.5 bg-stone-50/50 p-3 rounded-2xl border border-black/5">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-extrabold text-stone-900 truncate max-w-[140px]">{food.name}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-black text-orange-600">{ping.weight}g</span>
                                  <button
                                    onClick={() => removeIngredientFromPlate(ping.foodId)}
                                    className="p-1 text-stone-400 hover:text-red-500 rounded-full transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="400"
                                step="10"
                                value={ping.weight}
                                onChange={(e) => updateWeight(ping.foodId, parseInt(e.target.value))}
                                className="w-full accent-orange-500 h-1 bg-stone-200 rounded-lg cursor-pointer"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {plateIngredients.length > 0 && (
                    <button
                      onClick={() => setPlateIngredients([])}
                      className="mt-6 w-full py-2.5 rounded-xl border border-dashed border-red-500/20 text-red-500 hover:bg-red-50/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw size={12} /> Clear Entire Plate
                    </button>
                  )}
                </div>

                {/* Simulated Biomarkers Results (Satiety, Glycemic response, etc.) */}
                <div className="bg-stone-900 text-white p-6 rounded-[36px] shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#FFF500] leading-none mb-1 block">Bio-Evaluation Engine</span>
                        <h3 className="font-black text-lg uppercase tracking-tight text-white m-0">Dynamic Synergy Biomarkers</h3>
                      </div>
                      <div className="p-2 bg-white/10 rounded-full">
                        <Activity size={16} className="text-[#FFF500]" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      
                      {/* Satiety Index Bar */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="opacity-75 font-semibold flex items-center gap-1">
                            Satiety / Fullness Rating
                            <span className="group relative text-white/50 cursor-help">
                              <Info size={11} />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 w-48 p-2 bg-stone-950 text-[9px] rounded-lg shadow-xl opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all font-medium leading-relaxed pointer-events-none mb-1 text-white z-50">
                                Satiety Index measures physical fullness duration based on protein density, complex carbohydrates vs sugars, and dietary fiber content.
                              </span>
                            </span>
                          </span>
                          <span className="font-black text-[#FFF500]">{alchemistStats.satietyIndex}%</span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-[#FFF500] transition-all duration-500" 
                            style={{ width: `${alchemistStats.satietyIndex}%` }}
                          />
                        </div>
                        <p className="text-[9px] opacity-50 mt-1 font-semibold uppercase tracking-wider text-right">
                          {alchemistStats.satietyIndex > 75 ? '🔥 LONG SATIATION (3-4 Hrs)' : alchemistStats.satietyIndex > 50 ? '⚡ MODERATE SATIATION' : '⚠️ METABOLIC CRASH POTENTIAL'}
                        </p>
                      </div>

                      {/* Glycemic Response Curve Predictor */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="opacity-75 font-semibold flex items-center gap-1">
                            Glycemic Response/Sugar Surge
                            <span className="group relative text-white/50 cursor-help">
                              <Info size={11} />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 w-48 p-2 bg-stone-950 text-[9px] rounded-lg shadow-xl opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all font-medium leading-relaxed pointer-events-none mb-1 text-white z-50">
                                Predicts blood glucose surge height. Soluble fibers, lipids, and direct protein sources buffer insulin spikes, distributing energy smoothly.
                              </span>
                            </span>
                          </span>
                          <span className={`font-black uppercase tracking-wider ${alchemistStats.glycemicIndex > 60 ? 'text-rose-400' : alchemistStats.glycemicIndex > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {alchemistStats.glycemicIndex} ({alchemistStats.glycemicIndex > 60 ? 'High Spike' : alchemistStats.glycemicIndex > 40 ? 'Moderate' : 'Smooth Curve'})
                          </span>
                        </div>
                        
                        {/* 4-Hour Post-Prandial Glycemic Projection (SVG Graph Line) */}
                        <div className="h-16 bg-white/5 rounded-2xl p-2 relative overflow-hidden flex flex-col justify-end">
                          <svg className="w-full h-12" strokeWidth="2.5" fill="none">
                            {/* Baseline sugar line */}
                            <line x1="0" y1="38" x2="100%" y2="38" stroke="rgba(255,255,255,0.15)" strokeDasharray="3,3" />
                            {/* Glucose fluctuation line */}
                            <path 
                              className="transition-all duration-500"
                              d={
                                alchemistStats.calories === 0 
                                  ? "M 5 38 Q 30 38 60 38 T 200 38"
                                  : alchemistStats.glycemicIndex > 55
                                    ? `M 5 38 Q 40 ${38 - alchemistStats.glycemicIndex * 0.55} 80 ${38 + (alchemistStats.glycemicIndex - 50) * 0.25} T 240 38`
                                    : `M 5 38 Q 45 ${38 - alchemistStats.glycemicIndex * 0.4} 110 ${38 - alchemistStats.glycemicIndex * 0.15} T 240 38`
                              }
                              stroke={alchemistStats.glycemicIndex > 60 ? "#F87171" : alchemistStats.glycemicIndex > 40 ? "#FBBF24" : "#34D399"} 
                              strokeLinecap="round"
                            />
                            {/* Shading fill */}
                            <path 
                              className="transition-all duration-500 pointer-events-none"
                              d={
                                alchemistStats.calories === 0 
                                  ? "M 5 38 Q 30 38 60 38 T 200 38 L 100% 48 L 0 48 Z"
                                  : alchemistStats.glycemicIndex > 55
                                    ? `M 5 38 Q 40 ${38 - alchemistStats.glycemicIndex * 0.55} 80 ${38 + (alchemistStats.glycemicIndex - 50) * 0.25} T 240 38 L 100% 48 L 0 48 Z`
                                    : `M 5 38 Q 45 ${38 - alchemistStats.glycemicIndex * 0.4} 110 ${38 - alchemistStats.glycemicIndex * 0.15} T 240 38 L 100% 48 L 0 48 Z`
                              }
                              fill={alchemistStats.glycemicIndex > 60 ? "rgba(248,113,113,0.05)" : "rgba(52,211,153,0.05)"} 
                            />
                          </svg>
                          <div className="flex justify-between text-[7px] text-white/30 px-1 font-semibold uppercase tracking-wider">
                            <span>Ingested</span>
                            <span>1 Hour Peak</span>
                            <span>3 Hour Fast</span>
                            <span>Post-Absorptive</span>
                          </div>
                        </div>
                      </div>

                      {/* Thermic Effect Info */}
                      <div className="flex gap-4 p-3 bg-white/5 rounded-2xl items-center border border-white/5">
                        <Flame className="text-orange-400 shrink-0" size={20} />
                        <div>
                          <p className="text-[10px] text-white/50 uppercase font-bold">Digestive Thermogenesis (TEF)</p>
                          <p className="text-xs font-extrabold text-white">
                            ✦ {alchemistStats.thermicEffect} extra calories burned automatically in digestion metabolism.
                          </p>
                        </div>
                      </div>

                      {/* Muscle Synthesis Trigger Rate */}
                      <div>
                        <div className="flex justify-between text-xs mb-1.5 items-center">
                          <span className="opacity-75 font-semibold flex items-center gap-1">
                            <Dumbbell size={12} className="text-orange-400" /> Muscle Synthesis Dose Target
                          </span>
                          <span className="font-extrabold text-xs">{alchemistStats.protein}g / 25g</span>
                        </div>
                        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-400 transition-all duration-500" 
                            style={{ width: `${alchemistStats.mpsPotential}%` }}
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Total Calorie & Macros Summary */}
                  <div className="border-t border-white/10 pt-4 mt-4 grid grid-cols-5 text-center gap-1.5">
                    <div className="p-1 px-1.5 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[8px] text-white/50 uppercase font-black tracking-widest">Kcal</p>
                      <p className="text-sm font-black text-[#FFF500] line-clamp-1">{alchemistStats.calories}</p>
                    </div>
                    <div className="p-1 px-1.5 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[8px] text-white/50 uppercase font-black tracking-widest">Prot</p>
                      <p className="text-sm font-black overflow-hidden truncate">{alchemistStats.protein}g</p>
                    </div>
                    <div className="p-1 px-1.5 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[8px] text-white/50 uppercase font-black tracking-widest">Carb</p>
                      <p className="text-sm font-black overflow-hidden truncate">{alchemistStats.carbs}g</p>
                    </div>
                    <div className="p-1 px-1.5 bg-[#FFF500]/10 rounded-xl border border-[#FFF500]/15">
                      <p className="text-[8px] text-stone-900/40 font-black tracking-widest text-[#FFF500]">Fat</p>
                      <p className="text-sm font-black overflow-hidden truncate text-white">{alchemistStats.fats}g</p>
                    </div>
                    <div className="p-1 px-1.5 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[8px] text-white/50 uppercase font-black tracking-widest">Fiber</p>
                      <p className="text-sm font-black overflow-hidden truncate text-[#34D399]">{alchemistStats.fiber}g</p>
                    </div>
                  </div>

                </div>

              </div>
              
              {/* Intelligent Synergy Coaching Prompt Box */}
              <div className="bg-white p-6 rounded-[36px] border border-black/5 shadow-sm">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles size={16} className="text-amber-500 fill-amber-500/20" />
                  <h4 className="text-xs uppercase font-extrabold text-stone-900 tracking-wider">Dynamic Synergy Synergy Analysis</h4>
                </div>
                
                <div className="space-y-2.5">
                  {alchemistStats.synergyTips.map((tip, i) => (
                    <div key={i} className="flex gap-2.5 items-start bg-stone-50/50 p-3 rounded-2xl border border-black/5">
                      <div className="p-1 bg-white border border-black/5 rounded-lg shrink-0 mt-0.5">
                        <CheckCircle size={12} className="text-orange-500" />
                      </div>
                      <p className="text-xs text-stone-600 font-semibold leading-relaxed m-0">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* --- PANEL 2: METABOLIC FUTURIST PANEL --- */}
        {activeSubTab === 'futurist' && (
          <motion.div
            key="futurist-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            
            {/* Control Sliders Column */}
            <div className="lg:col-span-4 bg-white p-6 rounded-[36px] border border-black/5 shadow-sm space-y-6 flex flex-col justify-between">
              
              <div>
                <h3 className="font-black text-stone-900 text-base uppercase tracking-tight mb-1 flex items-center gap-1.5">
                  <Clock size={16} className="text-orange-500" /> Dynamic Prognosis
                </h3>
                <p className="text-xs text-stone-500 font-medium mb-6">Dial in your daily averages to run dynamic BMR & cortisol mathematical curves over 12 weeks of calorie habits.</p>

                {/* Habits Presets Row */}
                <div className="mb-4">
                  <label className="block text-[10px] uppercase font-black text-stone-400 tracking-wider mb-2">Preset Habit Regimens</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('healthy_recomp')}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all duration-300 ${activeSimulationPreset === 'healthy_recomp' ? 'border-amber-500 bg-amber-50/40 text-stone-900' : 'border-stone-100 bg-stone-50/50 text-stone-500 hover:bg-stone-50'}`}
                    >
                      💪 Recomp / Clean
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('aggressive_cut')}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all duration-300 ${activeSimulationPreset === 'aggressive_cut' ? 'border-amber-500 bg-amber-50/40 text-stone-900' : 'border-stone-100 bg-stone-50/50 text-stone-500 hover:bg-stone-50'}`}
                    >
                      🔥 Aggressive Cut
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('lean_gain')}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all duration-300 ${activeSimulationPreset === 'lean_gain' ? 'border-amber-500 bg-amber-50/40 text-stone-900' : 'border-stone-100 bg-stone-50/50 text-stone-500 hover:bg-stone-50'}`}
                    >
                      👑 Lean Gain Bulk
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('weekend_splurge')}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all duration-300 ${activeSimulationPreset === 'weekend_splurge' ? 'border-amber-500 bg-amber-50/40 text-stone-900' : 'border-stone-100 bg-stone-50/50 text-stone-500 hover:bg-stone-50'}`}
                    >
                      🍕 Weekend Cheat Ping-Pong
                    </button>
                  </div>
                </div>

                <hr className="border-stone-100 my-4" />

                <div className="space-y-4">
                  {/* Calorie Budget Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-stone-600 font-bold">
                      <span className="flex items-center gap-1">Daily Calorie Target Intake</span>
                      <span className="font-extrabold text-orange-600">{dailyCalorieBudget} kcal</span>
                    </div>
                    <input
                      type="range"
                      min={profile.dailyCalorieTarget - 1000}
                      max={profile.dailyCalorieTarget + 1000}
                      step="50"
                      value={dailyCalorieBudget}
                      onChange={(e) => {
                        setDailyCalorieBudget(parseInt(e.target.value));
                        setActiveSimulationPreset('custom');
                      }}
                      className="w-full accent-orange-500 h-1 bg-stone-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-stone-400 font-bold uppercase tracking-wider">
                      <span>Cut Deficit</span>
                      <span>Target: {profile.dailyCalorieTarget}</span>
                      <span>Gain Surplus</span>
                    </div>
                  </div>

                  {/* Protein Budget Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-stone-600 font-bold">
                      <span className="flex items-center gap-1">Daily Protein Target</span>
                      <span className="font-extrabold text-orange-600">{dailyProteinGrams}g</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="220"
                      step="5"
                      value={dailyProteinGrams}
                      onChange={(e) => {
                        setDailyProteinGrams(parseInt(e.target.value));
                        setActiveSimulationPreset('custom');
                      }}
                      className="w-full accent-orange-500 h-1 bg-stone-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-stone-400 font-bold uppercase tracking-wider">
                      <span>Low-protein: {Math.round(profile.weight * 0.8)}g</span>
                      <span>High threshold: {Math.round(profile.weight * 2.2)}g</span>
                    </div>
                  </div>

                  {/* Cardio per week Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-stone-600 font-bold">
                      <span className="flex items-center gap-1">Cardio Sessions / Wk (350 kcal)</span>
                      <span className="font-extrabold text-orange-600">{cardioSessionsPerWeek} sessions</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="7"
                      step="1"
                      value={cardioSessionsPerWeek}
                      onChange={(e) => {
                        setCardioSessionsPerWeek(parseInt(e.target.value));
                        setActiveSimulationPreset('custom');
                      }}
                      className="w-full accent-orange-500 h-1 bg-stone-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Sleep and Stress Quality Choice */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-600">Cortisol & Recovery State (Sleep Quality)</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSleepScore('poor');
                          setActiveSimulationPreset('custom');
                        }}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${sleepScore === 'poor' ? 'border-red-500 bg-red-50/30 text-stone-900' : 'border-stone-100 text-stone-400'}`}
                      >
                        ⚠️ Cortisol Spikes / Poor sleep
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSleepScore('optimal');
                          setActiveSimulationPreset('custom');
                        }}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${sleepScore === 'optimal' ? 'border-emerald-500 bg-emerald-50/30 text-stone-900' : 'border-stone-100 text-stone-400'}`}
                      >
                        🌱 8 Hrs Deep Rest
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Disclaimer / Informative Alert Footnote */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/30 mt-4">
                <p className="text-[10px] text-amber-800 leading-relaxed font-semibold m-0 flex gap-2">
                  <Info size={14} className="shrink-0 text-amber-600" />
                  Note: This algorithm simulates baseline weight fluctuation using cumulative calorie deficits, muscle-protein retention math, and natural hormonal adaptation curves. Individual results may shift and adapt dynamically.
                </p>
              </div>

            </div>

            {/* Results Output Column with Gorgeous SVG Grid Weight Line */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-white p-6 rounded-[36px] border border-black/5 shadow-sm">
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-orange-500 leading-none mb-1 block">12-Week Habitation Curve</span>
                    <h3 className="font-display font-black text-xl uppercase tracking-tight text-stone-900">Dynamic Weight Progression Forecast</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-stone-400 uppercase font-black tracking-wider leading-none">Starting Weight</p>
                    <p className="text-lg font-black text-stone-400 leading-none mt-1">{profile.weight} kg</p>
                  </div>
                </div>

                {/* SVG Live Simulation Chart rendering 12 Week Timeline */}
                <div className="h-64 md:h-80 w-full relative">
                  
                  {/* Grid Lines helper */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[8px] text-black/20 font-bold uppercase">
                    <div className="border-b border-dashed border-stone-200/60 pb-1 flex justify-between">
                      <span>Max Peak</span>
                      <span>Target Goal Cap</span>
                    </div>
                    <div className="border-b border-dashed border-stone-200/60 pb-1" />
                    <div className="border-b border-dashed border-stone-200/60 pb-1" />
                    <div className="border-b border-dashed border-stone-200/60 pb-1" />
                    <div className="pt-1 flex justify-between">
                      <span>Min Valley</span>
                      <span>Metabolic Base</span>
                    </div>
                  </div>

                  {/* Core Chart Body */}
                  <svg className="w-full h-full pt-4 pb-6" fill="none" viewBox="0 0 500 200">
                    {/* Construct weight coordinates path */}
                    {(() => {
                      const weights = simulationData.map(d => d.weight);
                      const minW = Math.min(...weights) - 0.5;
                      const maxW = Math.max(...weights) + 0.5;
                      const hRange = maxW - minW || 1;

                      // Map points dynamically to viewport
                      const points = simulationData.map((d, index) => {
                        const x = (index / 12) * 500;
                        const y = 180 - ((d.weight - minW) / hRange) * 160;
                        return `${x},${y}`;
                      }).join(' ');

                      return (
                        <>
                          {/* Weight Line Shaded Shadow */}
                          <path
                            d={`M 0,200 L ${points} L 500,200 Z`}
                            fill="url(#weight-shading-grad)"
                            className="transition-all duration-700"
                          />
                          {/* Main weight line */}
                          <polyline
                            points={points}
                            stroke="#f97316"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            className="transition-all duration-700"
                          />

                          {/* Data point dot anchors */}
                          {simulationData.map((d, index) => {
                            const x = (index / 12) * 500;
                            const y = 180 - ((d.weight - minW) / hRange) * 160;
                            return (
                              <g key={index} className="group cursor-help">
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="4"
                                  fill="#f97316"
                                  stroke="#fff"
                                  strokeWidth="1.5"
                                  className="transition-all duration-500 hover:r-6"
                                />
                                <text
                                  x={x}
                                  y={y - 10}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-black text-[8px] font-black text-center text-stone-900"
                                  textAnchor="middle"
                                >
                                  W{d.week}: {d.weight}kg
                                </text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                    
                    {/* Definitions for gradient fills */}
                    <defs>
                      <linearGradient id="weight-shading-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(249,115,22,0.14)" />
                        <stop offset="100%" stopColor="rgba(249,115,22,0.00)" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Horizontal Time Labels */}
                  <div className="absolute bottom-0 inset-x-0 flex justify-between text-[9px] text-[#A3A39F] font-bold uppercase tracking-wider px-1">
                    <span>Week 0</span>
                    <span>Week 2</span>
                    <span>Week 4</span>
                    <span>Week 6</span>
                    <span>Week 8</span>
                    <span>Week 10</span>
                    <span>Week 12</span>
                  </div>

                </div>

              </div>

              {/* Simulated Impact Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Net Result Change Card */}
                <div className={`p-6 rounded-[32px] border flex flex-col justify-between shadow-sm min-h-[140px] transition-all duration-300 ${totalChange < 0 ? 'bg-emerald-50/50 border-emerald-500/20 text-emerald-800' : 'bg-orange-50/50 border-orange-500/20 text-orange-800'}`}>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase font-black tracking-widest leading-none">Net Change Target</span>
                      <Scale size={16} />
                    </div>
                    <p className="text-3xl font-black font-sans mt-2">
                      {totalChange > 0 ? `+${totalChange}` : totalChange} <span className="text-sm font-bold">kg</span>
                    </p>
                  </div>
                  <p className="text-[10px] text-stone-500 font-semibold uppercase mt-2">
                    {totalChange === 0 ? '✦ STABLE EQUILIBRIUM' : totalChange < 0 ? '✅ Healthy tissue deficit' : '▲ Calorie surplus development'}
                  </p>
                </div>

                {/* 2. Metabolic Slowdown Safety Dial */}
                <div className="p-6 bg-white rounded-[32px] border border-black/5 flex flex-col justify-between shadow-sm min-h-[140px]">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-stone-500">
                      <span className="text-[10px] uppercase font-black tracking-widest leading-none">Metabolic Slowdown</span>
                      <Flame size={16} className="text-[#A3A39F]" />
                    </div>
                    <p className="text-3xl font-black font-sans mt-2 text-stone-800">
                      -{slowdown} <span className="text-sm font-bold">kcal</span>
                    </p>
                  </div>
                  <p className="text-[10px] text-stone-500 font-semibold uppercase mt-2">
                    Adaptive reduction in TDEE
                  </p>
                </div>

                {/* 3. Lean Tissue (Muscle) Retention Rate Chart */}
                <div className="p-6 bg-stone-900 text-white rounded-[32px] flex flex-col justify-between min-h-[140px]">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase font-black tracking-widest text-orange-300 leading-none">Lean Preservation Code</span>
                      <Dumbbell size={16} className="text-orange-400" />
                    </div>
                    <p className="text-3xl font-black font-sans mt-2 text-white">
                      {retention}% <span className="text-xs font-medium text-orange-300">muscle preserved</span>
                    </p>
                  </div>
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden mt-1 w-full">
                    <div 
                      className="h-full bg-orange-400 transition-all duration-500" 
                      style={{ width: `${retention}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-white/50 font-semibold uppercase mt-2">
                    {retention >= 90 ? '🌟 GOLD STAR RETENTION' : retention >= 80 ? '✦ SAFE PROGRESS' : '⚠️ ATROPHY / PROTEIN MISMATCH'}
                  </p>
                </div>

              </div>

              {/* Personalized Timeline Habits Advice Generator */}
              <div className="bg-gradient-to-tr from-stone-950 to-stone-900 text-white p-6 rounded-[36px] border border-black/5 shadow-md">
                <div className="flex items-center gap-1.5 mb-3 text-orange-400">
                  <TrendingUp size={16} />
                  <h4 className="text-xs uppercase font-black text-orange-400 tracking-wider">Metabolic Progression Coaching Report</h4>
                </div>

                <div className="space-y-4">
                  
                  {totalChange < 0 && (
                    <div className="border-l-2 border-orange-500 pl-4 space-y-1">
                      <h5 className="font-extrabold text-xs text-white uppercase">Phase 1: Direct Fat Mobilization</h5>
                      <p className="text-[11px] leading-relaxed text-stone-300 font-semibold">
                        During weeks 1 to 4, cumulative deficits in glycogen reserves will force adipose cellular lipid oxidation. Keep meals high in fiber to sustain high satiety and blunt insulin.
                      </p>
                    </div>
                  )}

                  {retention < 80 ? (
                    <div className="border-l-2 border-red-400 pl-4 space-y-1">
                      <h5 className="font-extrabold text-xs text-red-200 uppercase">Warning: Low Daily Protein Adaptations ({dailyProteinGrams}g)</h5>
                      <p className="text-[11px] leading-relaxed text-stone-300 font-semibold">
                        Your muscle tissue retention code indicates potential protein degradation. Increase daily protein to at least {Math.round(profile.weight * 1.8)}g to safeguard essential metabolically-dense lean body mass.
                      </p>
                    </div>
                  ) : (
                    <div className="border-l-2 border-emerald-400 pl-4 space-y-1">
                      <h5 className="font-extrabold text-xs text-emerald-300 uppercase font-sans">Optimized Protein Preservation Locked In</h5>
                      <p className="text-[11px] leading-relaxed text-stone-300 font-semibold">
                        Sufficient protein intake of {dailyProteinGrams}g guarantees amino acid availability, encouraging cellular retention inside active myofibrous proteins and limiting metabolic deceleration.
                      </p>
                    </div>
                  )}

                  {sleepScore === 'poor' && (
                    <div className="border-l-2 border-rose-400 pl-4 space-y-1">
                      <h5 className="font-extrabold text-xs text-rose-300 uppercase">Adrenal Cortisol Blockage Blocked</h5>
                      <p className="text-[11px] leading-relaxed text-stone-300 font-semibold">
                        Resting less than 7-8 hours signals high systemic stress, spiking cortisol. High cortisol encourages visceral water retention, leptin resistance, and muscle fiber deterioration. Aim for regular circadian rest.
                      </p>
                    </div>
                  )}

                </div>
              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
