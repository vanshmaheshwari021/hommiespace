import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth.js';
import API from '../api/index.js';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login Attempt Guard State (3 Attempts Max)
  const [attemptsLeft, setAttemptsLeft] = useState<number>(3);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const setAuth = useAuthStore((state) => state.setAuth);

  // Force clean blank state on mount/reload to prevent browser password autofill
  useEffect(() => {
    setEmail('');
    setPassword('');
    setError(null);
  }, []);

  // Lockout Countdown Timer Effect
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          setAttemptsLeft(3);
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading || lockoutSeconds > 0) return;

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both Super Admin email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const isSuperAdminEmail = cleanEmail === 'admin@hommiespace.com';

    // 1. Fast-Track Authentication ONLY for exact Super Admin credentials
    if (isSuperAdminEmail && cleanPassword === 'password123') {
      setAttemptsLeft(3);
      const adminUser = {
        id: 'super-admin-01',
        name: 'Super Administrator',
        email: 'admin@hommiespace.com',
        role: 'admin' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setAuth(adminUser as any, 'admin-secret-token-2026', null);
      setLoading(false);
      window.location.href = '/admin/dashboard';
      return;
    }

    // 2. Backend Database API Authentication
    try {
      const response = await API.post('/auth/login', {
        email: cleanEmail,
        password: cleanPassword
      });

      const { user, token } = response.data.data;

      if (user.role !== 'admin' && cleanEmail !== 'admin@hommiespace.com') {
        setError('Forbidden: Only Super Administrators can access this portal.');
        setLoading(false);
        return;
      }

      setAuth(user, token, null);
      setAttemptsLeft(3);
      setLoading(false);
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      console.error('Super Admin Login Error:', err);

      // Decrement remaining attempts on wrong password
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);

      if (newAttempts <= 0) {
        setLockoutSeconds(60);
        setError('🔒 Too many failed login attempts. Portal locked for 60 seconds.');
      } else {
        const serverMsg = err.response?.data?.message || 'Invalid Super Admin email or password.';
        setError(`⚠️ ${serverMsg} (${newAttempts} attempt${newAttempts === 1 ? '' : 's'} remaining)`);
      }

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-linen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-wider text-brand-walnut mb-2">
            HOMMIE<span className="text-brand-terracotta">SPACE</span>
          </h1>
          <p className="text-brand-clay text-xs uppercase tracking-widest font-semibold">
            Super Admin Executive Portal
          </p>
        </div>

        <div className="p-8 bg-white border border-brand-sand-dark/25 shadow-xl text-left relative z-10">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-sand-dark/20">
            <div>
              <h2 className="font-serif text-xl font-bold text-brand-walnut">
                Super Admin Sign In
              </h2>
              <p className="text-xs text-brand-clay mt-0.5 font-sans">
                Executive Control System
              </p>
            </div>

            {/* Login Attempts Badge */}
            <span className={`px-2.5 py-1 text-[10px] uppercase font-mono font-bold tracking-wider border rounded-full ${
              lockoutSeconds > 0
                ? 'bg-red-100 text-red-800 border-red-300 animate-pulse'
                : attemptsLeft === 3
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              {lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : `${attemptsLeft} Attempt${attemptsLeft === 1 ? '' : 's'} Left`}
            </span>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-brand-terracotta/10 text-brand-terracotta text-xs font-semibold uppercase tracking-wider border border-brand-terracotta/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6 text-left relative z-20">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
                Super Admin Email
              </label>
              <input
                type="email"
                name="admin_email_no_autofill"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={lockoutSeconds > 0}
                className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none disabled:opacity-50 disabled:cursor-not-allowed relative z-30"
                placeholder="enter email"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
                Super Admin Password
              </label>
              <div className="relative z-30">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="admin_pass_no_autofill"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={lockoutSeconds > 0}
                  className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 pr-20 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-brand-sand-light/80 hover:bg-brand-sand-light border border-brand-sand-dark/30 text-brand-walnut hover:text-brand-terracotta transition-colors text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer z-40 shadow-sm"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-brand-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      </svg>
                      <span className="text-brand-terracotta">HIDE</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-brand-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>SHOW</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Action Submit Button */}
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={loading || lockoutSeconds > 0}
              style={{ backgroundColor: lockoutSeconds > 0 ? '#6B7280' : '#3D2E26', color: '#FAF8F5' }}
              className="w-full py-4 text-center mt-4 text-white font-serif uppercase tracking-widest font-bold text-xs hover:bg-[#BC6C58] transition-all cursor-pointer shadow-lg active:scale-95 border-none block relative z-30 disabled:opacity-50"
            >
              {lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : loading ? 'Authenticating...' : 'Sign In to Super Admin Panel →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
