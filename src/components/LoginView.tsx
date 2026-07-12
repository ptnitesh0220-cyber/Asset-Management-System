import React, { useState } from 'react';
import { Boxes, KeyRound, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  AuthError,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

function friendlyAuthError(err: unknown): string {
  const code = (err as AuthError)?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists — check your password.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was closed before completing.';
    case 'auth/network-request-failed':
      return 'Network error — check your connection and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      try {
        // Try signing in first.
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        const code = (err as AuthError)?.code;
        // First time this email is used -> create the account automatically.
        if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw err;
        }
      }
      onLoginSuccess();
    } catch (err) {
      setErrorMsg(friendlyAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onLoginSuccess();
    } catch (err) {
      setErrorMsg(friendlyAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-[#0a1122] flex items-center justify-center p-4 relative overflow-hidden font-sans"
      id="login-view-root"
    >
      {/* Decorative background ambient glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <div
        className="bg-[#0f1830] border border-slate-800 rounded-2xl w-full max-w-md p-8 shadow-2xl relative z-10 space-y-6"
        id="login-card"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Boxes className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-4 font-sans">
            Welcome to <span className="text-blue-500">AssetFlow</span>
          </h1>
          <p className="text-xs text-slate-400">Enterprise IT hardware asset directory and resource organizer</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl px-4 py-2.5" id="login-error-banner">
            {errorMsg}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center text-slate-500 pointer-events-none">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@assetflow.io"
                className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-600 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                id="login-email-input"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center text-slate-500 pointer-events-none">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a1122] text-sm text-white placeholder-slate-600 pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                id="login-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xxs text-slate-500 mt-1.5">
              First time here? Just enter an email + password (6+ characters) — your account is created automatically.
            </p>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            id="login-submit-btn"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-xxs text-slate-500 uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Continue with Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full bg-[#0a1122] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          id="google-login-btn"
        >
          {/* Custom inline G logo */}
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#ea4335"
              d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.6 14.96 1 12 1 7.35 1 3.39 3.65 1.48 7.5l3.76 2.92C6.12 7.12 8.84 5.04 12 5.04z"
            />
            <path
              fill="#4285f4"
              d="M23.52 12.3c0-.82-.07-1.6-.22-2.3H12v4.4h6.48c-.28 1.48-1.12 2.73-2.38 3.58l3.68 2.85c2.16-2 3.74-4.94 3.74-8.53z"
            />
            <path
              fill="#fbbc05"
              d="M5.24 14.58c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3l-3.76-2.92C.54 8.76 0 10.32 0 12c0 1.68.54 3.24 1.48 4.92l3.76-2.34z"
            />
            <path
              fill="#34a853"
              d="M12 23c3.24 0 5.96-1.08 7.96-2.92l-3.68-2.85c-1.12.75-2.56 1.21-4.28 1.21-3.16 0-5.88-2.08-6.84-5.38L1.4 15.4C3.32 19.35 7.28 23 12 23z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
