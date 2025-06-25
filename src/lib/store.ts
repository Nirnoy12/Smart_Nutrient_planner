import { create } from 'zustand';
import { supabase } from './supabase';

interface UserState {
  user: any | null;
  meals: Meal[];
  calories: number;
  calorieGoal: number;
  isLoading: boolean;
  error: string | null;
  supabase: typeof supabase;
  setUser: (user: any) => void;
  addMeal: (meal: Meal) => void;
  setCalorieGoal: (goal: number) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  calories: number;
  imageUrl?: string;
  createdAt: string;
  items: FoodItem[];
}

interface FoodItem {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export const useStore = create<UserState>((set, get) => ({
  user: null,
  meals: [],
  calories: 0,
  calorieGoal: 2000,
  isLoading: false,
  error: null,
  supabase,

  setUser: (user) => set({ user }),
  
  addMeal: async (meal) => {
    const { data, error } = await supabase
      .from('meals')
      .insert([meal])
      .select();

    if (error) {
      set({ error: error.message });
      return;
    }

    set((state) => ({
      meals: [...state.meals, data[0]],
      calories: state.calories + meal.calories,
    }));
  },

  setCalorieGoal: (goal) => set({ calorieGoal: goal }),

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }

    set({ user: data.user, isLoading: false });
  },

  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }

    set({ user: data.user, isLoading: false });
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      set({ error: error.message });
      return;
    }
    set({ user: null, meals: [], calories: 0 });
  },
}));