import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@hommiespace/ui';
import { useAuthStore } from '../store/auth.js';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@hommiespace.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Strict 3-Attempt Security Guard
  const [attemptsLeft, setAttemptsLeft] = useState<number>(3);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const setAuth = useAuthStore((state) => state.setAuth);

  // Lockout Countdown Timer Effect
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          setAttemptsLeft(3); // Reset attempts after countdown finishes
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || lockoutSeconds > 0) return;

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both Super Admin email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    // Validate Super Admin Credentials
    if (cleanEmail === 'admin@hommiespace.com' && cleanPassword === 'password123') {
      setAttemptsLeft(3);
      const adminUser = {
        id: 'super-admin-01',
        name: 'Super Administrator',
        email: 'admin@hommiespace.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setAuth(adminUser as any, 'admin-secret-token-2026', null);
      window.location.href = '/admin/dashboard';
    } else {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      setLoading(false);

      if (newAttempts <= 0) {
        setLockoutSeconds(60);
        setError('🔒 Too many failed attempts! Super Admin Gateway locked for 60 seconds.');
      } else {
        setError(`⚠️ Invalid Super Admin Password! ${newAttempts} attempt${newAttempts === 1 ? '' : 's'} remaining.`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex flex-col justify-between p-4 py-8 text-brand-linen">
      {/* Top Header Navigation */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between mb-4">
        <Link to="/login" className="text-xs font-mono font-bold uppercase tracking-widest text-brand-sand-dark hover:text-brand-terracotta flex items-center gap-1.5 transition-colors">
          ← Partner & Vendor Login
        </Link>
        <span className="text-[10px] uppercase tracking-widest font-mono text-brand-terracotta font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-terracotta animate-ping" />
          RESTRICTED GATEWAY
        </span>
      </div>

      <div className="w-full max-w-md mx-auto my-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl font-black tracking-wider text-white mb-1">
            HOMMIE<span className="text-brand-terracotta">SPACE</span>
          </h1>
          <p className="text-brand-sand-dark text-[10px] uppercase tracking-widest font-mono font-semibold">
            Super Admin Security Portal · Port 5180
          </p>
        </div>

        <Card className="p-8 bg-[#25211E] border border-brand-terracotta/40 shadow-2xl text-left" hoverEffect={false}>
          <div className="flex justify-between items-center mb-6 border-b border-brand-sand-dark/20 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-white">
                Super Admin Access
              </h2>
              <p className="text-[10px] text-brand-sand-dark font-mono mt-0.5">
                Executive Control System
              </p>
            </div>

            {/* Live Attempts Badge */}
            <span className={`px-3 py-1 text-[10px] uppercase font-mono font-bold tracking-wider border rounded-full ${
              lockoutSeconds > 0
                ? 'bg-red-950 text-red-300 border-red-800 animate-pulse'
                : attemptsLeft === 3
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-amber-950 text-amber-300 border-amber-800'
            }`}>
              {lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : `${attemptsLeft} Attempt${attemptsLeft === 1 ? '' : 's'} Left`}
            </span>
          </div>

          {/* Error & Attempts Warning Banner */}
          {error && (
            <div className="mb-6 p-4 bg-brand-terracotta/20 text-brand-terracotta text-xs font-semibold uppercase tracking-wider border border-brand-terracotta/50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-sand-dark mb-2">
                Super Admin Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={lockoutSeconds > 0}
                className="w-full bg-brand-charcoal border border-brand-sand-dark/30 px-4 py-3 text-xs font-sans text-white focus:outline-none focus:border-brand-terracotta transition-colors rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="admin@hommiespace.com"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-sand-dark mb-2">
                Super Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={lockoutSeconds > 0}
                  className="w-full bg-brand-charcoal border border-brand-sand-dark/30 px-4 py-3 pr-20 text-xs font-sans text-white focus:outline-none focus:border-brand-terracotta transition-colors rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-brand-charcoal/80 hover:bg-brand-charcoal border border-brand-sand-dark/40 text-brand-sand-dark hover:text-brand-terracotta transition-colors text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer z-20 shadow-sm"
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
                      <svg className="w-3.5 h-3.5 text-brand-sand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>SHOW</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* High-Impact Admin Sign In Button */}
            <button
              type="submit"
              disabled={loading || lockoutSeconds > 0}
              style={{ backgroundColor: lockoutSeconds > 0 ? '#4B5563' : '#BC6C58', color: '#FFFFFF' }}
              className="w-full py-4 text-center mt-4 text-white font-serif uppercase tracking-widest font-bold text-xs hover:bg-brand-walnut transition-all disabled:opacity-50 cursor-pointer shadow-xl active:scale-95 border-none block"
            >
              {lockoutSeconds > 0 ? `Gateway Locked (${lockoutSeconds}s)` : loading ? 'Authenticating Admin...' : 'Authorize & Open Admin Panel →'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-brand-sand-dark font-sans pt-4 border-t border-brand-sand-dark/15">
            <span>Looking for Studio Partner Portal? </span>
            <Link to="/login" className="text-white font-semibold hover:underline">
              Vendor Login
            </Link>
          </div>
        </Card>
      </div>

      <div className="text-[10px] text-brand-sand-dark uppercase font-mono tracking-widest text-center mt-6">
        CONFIDENTIAL · AUTHORIZED PERSONNEL ONLY
      </div>
    </div>
  );
};

export default AdminLogin;
