export interface UserProfile {
  uid: string;
  displayName?: string;
  email?: string;
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goal: 'fat_loss' | 'weight_loss' | 'muscle_gain' | 'maintenance';
  dailyCalorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatsTarget: number;
  createdAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number; // per 100g
  protein: number;
  carbs: number;
  fats: number;
  servingSize?: number; // default serving size in grams
}

export interface LoggedItem extends FoodItem {
  weight: number; // actual weight logged in grams
  timestamp: string;
}

export interface DailyLog {
  id?: string;
  uid: string;
  date: string; // YYYY-MM-DD
  items: LoggedItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  type: 'veg' | 'non-veg';
  category: string;
  ingredients: string[];
  instructions: string[];
  calories: number; // per 100g
  protein: number;
  carbs: number;
  fats: number;
  servingSize: number;
  imageUrl?: string;
  authorUid?: string;
  authorName?: string;
  createdAt?: string;
  likesCount?: number;
}
