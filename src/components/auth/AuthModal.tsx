import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Leaf } from 'lucide-react';
import { Button } from '../ui/button';
import { useStore } from '@/lib/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp, isLoading, error } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }
    if (!error) {
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl glass-card p-6">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-8 w-8 text-emerald-600" />
          </div>
          <Dialog.Title className="text-xl font-semibold text-center text-emerald-800 mb-2">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </Dialog.Title>
          <Dialog.Close className="absolute right-4 top-4 text-emerald-600 hover:text-emerald-700">
            <X className="h-4 w-4" />
          </Dialog.Close>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-emerald-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg glass-input px-3 py-2 text-emerald-800 placeholder-emerald-400"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-emerald-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg glass-input px-3 py-2 text-emerald-800 placeholder-emerald-400"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white" 
              disabled={isLoading}
            >
              {isLoading
                ? 'Loading...'
                : isSignUp
                ? 'Create account'
                : 'Sign in'}
            </Button>

            <p className="text-center text-sm text-emerald-700">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}