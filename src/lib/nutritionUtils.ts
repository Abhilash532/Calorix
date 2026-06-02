export const calculateBMR = (weight: number, height: number, age: number, gender: 'male' | 'female' | 'other') => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};

export const getActivityMultiplier = (level: string) => {
  switch (level) {
    case 'sedentary': return 1.2;
    case 'lightly_active': return 1.375;
    case 'moderately_active': return 1.55;
    case 'very_active': return 1.725;
    case 'extra_active': return 1.9;
    default: return 1.2;
  }
};

export const calculateTargets = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female' | 'other',
  activityLevel: string,
  goal: string
) => {
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = bmr * getActivityMultiplier(activityLevel);

  let calorieTarget = tdee;
  if (goal === 'fat_loss') calorieTarget = tdee - 500;
  if (goal === 'weight_loss') calorieTarget = tdee - 300;
  if (goal === 'muscle_gain') calorieTarget = tdee + 300;

  // Macro split (Protein: 30%, Carbs: 40%, Fats: 30%)
  // Protein: 4 cal/g, Carbs: 4 cal/g, Fats: 9 cal/g
  const proteinTarget = (calorieTarget * 0.3) / 4;
  const carbsTarget = (calorieTarget * 0.4) / 4;
  const fatsTarget = (calorieTarget * 0.3) / 9;
  
  // Fiber: Standard recommendation is 14g of fiber per 1000 calories logged
  const fiberTarget = (calorieTarget / 1000) * 14;

  return {
    dailyCalorieTarget: Math.round(calorieTarget),
    proteinTarget: Math.round(proteinTarget),
    carbsTarget: Math.round(carbsTarget),
    fatsTarget: Math.round(fatsTarget),
    fiberTarget: Math.round(fiberTarget),
  };
};

export const calculateNutrients = (
  item: { calories: number; protein: number; carbs: number; fats: number; fiber?: number },
  weightGrams: number
) => {
  const factor = weightGrams / 100;
  
  // If fiber is not set, we can intelligently estimate it as ~8% of the carbohydrates for vegetable-based/fruit/grain items,
  // or default to 0 for highly clean protein items.
  const baseFiber = typeof item.fiber === 'number' 
    ? item.fiber 
    : (item.carbs > 5 && item.protein < 15 ? item.carbs * 0.08 : 0);

  return {
    calories: Math.round(item.calories * factor),
    protein: Math.round(item.protein * factor * 10) / 10,
    carbs: Math.round(item.carbs * factor * 10) / 10,
    fats: Math.round(item.fats * factor * 10) / 10,
    fiber: Math.round(baseFiber * factor * 10) / 10,
  };
};
