import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { LogIn, UserPlus, Chrome, AlertCircle, Copy, Check, ExternalLink, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

export const Auth: React.FC<{ onSkipLogin: () => void }> = ({ onSkipLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const projectId = firebaseConfig?.projectId || 'gen-lang-client-0124013860';
  const consoleAuthSettingsUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  const formatErrorMessage = (err: any): string => {
    const code = err?.code || '';
    const message = err?.message || String(err);

    if (code === 'auth/unauthorized-domain' || message.includes('auth/unauthorized-domain')) {
      setIsUnauthorizedDomain(true);
      return 'This web domain is not yet authorized in your Firebase Authentication settings.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'Sign-in popup was closed before completing.';
    }
    if (code === 'auth/cancelled-popup-request') {
      return 'Popup request was cancelled.';
    }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      return 'Invalid email or password. Please try again.';
    }
    if (code === 'auth/user-not-found') {
      return 'No account found with this email. Please click "Sign Up" below.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'An account with this email already exists. Please sign in instead.';
    }
    if (code === 'auth/weak-password') {
      return 'Password should be at least 6 characters.';
    }
    if (code === 'auth/operation-not-allowed') {
      return 'Email/password authentication is not enabled in Firebase Console. Please use Google Sign-In or Demo mode.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network connection issue. Please check your internet connection.';
    }
    // Clean up generic "Firebase: Error (auth/...)" strings
    return message.replace(/^Firebase:\s*Error\s*\((auth\/[^)]+)\)\.?/i, '$1').replace(/^auth\//, '');
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsUnauthorizedDomain(false);
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      const friendlyMsg = formatErrorMessage(err);
      setError(friendlyMsg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUnauthorizedDomain(false);
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err: any) {
      console.warn('Email auth error:', err);
      const friendlyMsg = formatErrorMessage(err);
      setError(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const copyDomainToClipboard = async () => {
    if (!currentDomain) return;
    try {
      await navigator.clipboard.writeText(currentDomain);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = currentDomain;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-sm border border-black/5">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-display font-black tracking-tighter text-black">
            CALORIX<span className="text-orange-500">.</span>
          </h1>
          <p className="text-[10px] text-black/40 uppercase tracking-[0.2em] font-bold">Healthy Living Simplified</p>
        </div>

        {/* Specialized Domain Authorization Guidance Card */}
        {isUnauthorizedDomain && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 animate-fade-in shadow-xs">
            <div className="flex items-start gap-2.5 mb-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900">
                  Firebase Domain Authorization Required
                </h3>
                <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                  Firebase blocks Google Sign-In popups from new preview URLs until the domain is added to your authorized list.
                </p>
              </div>
            </div>

            <div className="mt-3 bg-white/90 border border-amber-200 rounded-xl p-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 mb-1">
                Your Current Hostname:
              </div>
              <div className="flex items-center justify-between gap-2 bg-amber-100/50 px-2.5 py-1.5 rounded-lg border border-amber-200/50">
                <code className="text-xs font-mono text-amber-950 break-all select-all font-semibold">
                  {currentDomain || 'ais-dev-...run.app'}
                </code>
                <button
                  type="button"
                  onClick={copyDomainToClipboard}
                  className="shrink-0 flex items-center gap-1 px-2 py-1 text-[11px] font-medium bg-white hover:bg-amber-100 text-amber-900 rounded-md border border-amber-300 shadow-2xs transition-all active:scale-95"
                  title="Copy hostname"
                >
                  {copiedDomain ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-amber-900/90 space-y-1 pl-1">
              <p className="font-semibold text-amber-950">Quick 3-step authorization:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-amber-900">
                <li>Click <strong>Open Firebase Console</strong> below.</li>
                <li>Under <strong>Authorized domains</strong>, click <strong>Add domain</strong>.</li>
                <li>Paste the hostname and save.</li>
              </ol>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <a
                href={consoleAuthSettingsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>Open Firebase Console Settings</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={onSkipLogin}
                className="w-full py-2.5 px-3 bg-white hover:bg-amber-100/50 text-amber-900 border border-amber-300/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Continue with Instant Demo Mode (No Setup Needed)</span>
              </button>
            </div>
          </div>
        )}

        {/* Standard Error Notice (if not already handled by specialized banner) */}
        {error && !isUnauthorizedDomain && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2 text-red-700 animate-fade-in text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 transition-all text-sm outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-black/5 border-none focus:ring-2 focus:ring-black/10 transition-all text-sm outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-black/90 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLogin ? (
              <LogIn size={18} />
            ) : (
              <UserPlus size={18} />
            )}
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-white px-4 text-black/40 font-medium">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          type="button"
          disabled={isLoading || isGoogleLoading}
          className="w-full py-3 border border-black/10 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-black/5 active:scale-[0.99] disabled:opacity-50 transition-all mb-3 cursor-pointer"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-black/60" />
          ) : (
            <Chrome size={18} />
          )}
          {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}
        </button>

        <button
          onClick={onSkipLogin}
          type="button"
          className="w-full py-3 border border-dashed border-orange-500/40 text-orange-600 bg-orange-50/50 hover:bg-orange-100/60 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>Skip Login & Try Demo Mode</span>
        </button>

        <p className="text-center mt-6 text-sm text-black/60">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setIsUnauthorizedDomain(false);
            }}
            className="font-semibold text-black underline underline-offset-4 hover:text-black/80 cursor-pointer"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};
