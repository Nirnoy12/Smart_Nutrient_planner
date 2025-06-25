import React, { useState, useEffect } from 'react';
import { Camera, Plus, User, Settings, LogOut, Leaf } from 'lucide-react';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { formatCalories } from './lib/utils';
import { AuthModal } from './components/auth/AuthModal';
import { CameraModal } from './components/camera/CameraModal';
import { useStore } from './lib/store';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { user, meals, calories, calorieGoal, signOut } = useStore();

  const progress = (calories / calorieGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-emerald-900 dark:to-green-900">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-md bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-emerald-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                NutriLens
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button variant="ghost" size="icon" className="text-emerald-700">
                    <Settings className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-emerald-700" onClick={() => signOut()}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsAuthOpen(true)} 
                  className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-none">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {user ? (
          <>
            {/* Daily Progress */}
            <div className="mb-8 rounded-xl glass-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-emerald-800">
                Today's Progress
              </h2>
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-emerald-700">
                    Calories
                  </span>
                  <span className="text-sm font-medium text-emerald-800">
                    {formatCalories(calories)} / {formatCalories(calorieGoal)}
                  </span>
                </div>
                <Progress value={progress} className="bg-emerald-100" indicatorClassName="bg-gradient-to-r from-emerald-500 to-green-500" />
              </div>
            </div>

            {/* Recent Meals */}
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-emerald-800">
                Recent Meals
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {meals.length === 0 ? (
                  <div className="flex h-48 items-center justify-center rounded-xl glass-card p-6 text-center">
                    <div>
                      <p className="mb-2 text-sm text-emerald-700">
                        No meals logged today
                      </p>
                      <Button
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-none"
                        onClick={() => setIsCameraOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Meal
                      </Button>
                    </div>
                  </div>
                ) : (
                  meals.map((meal) => (
                    <div
                      key={meal.id}
                      className="rounded-xl glass-card p-4"
                    >
                      {meal.imageUrl && (
                        <img
                          src={meal.imageUrl}
                          alt={meal.name}
                          className="mb-4 aspect-video rounded-lg object-cover"
                        />
                      )}
                      <h3 className="font-medium text-emerald-800">
                        {meal.name}
                      </h3>
                      <p className="text-sm text-emerald-600">
                        {formatCalories(meal.calories)} calories
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Camera FAB */}
            <button
              onClick={() => setIsCameraOpen(true)}
              className="fixed bottom-6 right-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 p-4 text-white shadow-lg transition-all hover:scale-105 hover:shadow-emerald-200/50 hover:from-emerald-600 hover:to-green-600"
            >
              <Camera className="h-6 w-6" />
            </button>
          </>
        ) : (
          <div className="flex min-h-[60vh] flex-col items-center justify-center">
            <div className="rounded-xl glass-card p-8 max-w-md w-full text-center">
              <Leaf className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h2 className="mb-4 text-2xl font-bold text-emerald-800">
                Welcome to NutriLens
              </h2>
              <p className="mb-8 text-emerald-600">
                Sign in to start tracking your meals with AI-powered analysis
              </p>
              <Button 
                onClick={() => setIsAuthOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-none"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CameraModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} />
    </div>
  );
}

export default App;