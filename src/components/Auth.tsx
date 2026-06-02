import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { LogIn, UserPlus, Chrome } from 'lucide-react';
import { cn } from '../lib/utils';

export const Auth: React.FC<{ onSkipLogin: () => void }> = ({ onSkipLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-black tracking-tighter text-black">
            CALORIX<span className="text-orange-500">.</span>
          </h1>
          <p className="text-[10px] text-black/40 uppercase tracking-[0.2em] font-bold">Healthy Living Simplified</p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 transition-all"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-black/90 transition-all"
          >
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/10"></div></div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-white px-4 text-black/40">Or continue with</span></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 border border-black/10 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-black/5 transition-all mb-3"
        >
          <Chrome size={18} />
          Google
        </button>

        <button
          onClick={onSkipLogin}
          type="button"
          className="w-full py-3 border border-dashed border-orange-500/40 text-orange-600 bg-orange-50/50 hover:bg-orange-50 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
        >
          🎁 Skip Login & Try Demo Mode
        </button>

        <p className="text-center mt-6 text-sm text-black/60">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-black underline underline-offset-4">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};
