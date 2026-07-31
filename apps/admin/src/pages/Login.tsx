import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@hommiespace/ui';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || lockoutSeconds > 0) return;

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both email address and password.');
      return;
    }

    setLoading(true);
    setError(null);

    // Super Admin Credentials Validation: admin@hommiespace.com / password123
    const isSuperAdminEmail = cleanEmail.toLowerCase() === 'admin@hommiespace.com';
    const isSuperAdminPass = cleanPassword === 'password123';

    if (isSuperAdminEmail) {
      if (isSuperAdminPass) {
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
        return;
      } else {
        // Failed attempt handling for Admin
        const newAttempts = attemptsLeft - 1;
        setAttemptsLeft(newAttempts);
        setLoading(false);
        if (newAttempts <= 0) {
          setLockoutSeconds(60);
          setError('🔒 Too many failed attempts! Security Lockout active. Please wait 60 seconds.');
        } else {
          setError(`⚠️ Invalid Admin Password! ${newAttempts} attempt${newAttempts === 1 ? '' : 's'} remaining.`);
        }
        return;
      }
    }

    // Backend Authentication for Vendor / Partner Accounts
    try {
      const response = await API.post('/auth/login', {
        email: cleanEmail,
        password: cleanPassword
      });

      const { user, token } = response.data.data;

      let vendor = null;
      if (user.role === 'vendor') {
        try {
          const meResponse = await API.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          vendor = meResponse.data.data.vendor;
        } catch (meErr) {
          console.warn('Vendor details fetch fallback:', meErr);
        }
      }

      setAuth(user, token, vendor);
      setAttemptsLeft(3); // Reset attempts on successful login

      // Role-Based Navigation
      if (user.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else if (user.role === 'vendor') {
        window.location.href = '/vendor/dashboard';
      } else if (user.role === 'customer') {
        window.location.href = 'http://localhost:5173/profile';
      } else {
        setError('Forbidden access role.');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);

      if (newAttempts <= 0) {
        setLockoutSeconds(60);
        setError('🔒 Too many failed login attempts! Account locked for 60 seconds.');
      } else {
        setError(
          `⚠️ Invalid credentials! ${newAttempts} attempt${newAttempts === 1 ? '' : 's'} remaining before lockout.`
        );
      }
    } finally {
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
            Partner & Admin Gateway Portal · Port 5180
          </p>
        </div>

        <Card className="p-8 bg-white border border-brand-sand-dark/25 shadow-xl" hoverEffect={false}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-xl font-bold text-brand-walnut">
              Sign In to Dashboard
            </h2>

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

          {/* Error & Attempts Banner */}
          {error && (
            <div className="mb-6 p-4 bg-brand-terracotta/10 text-brand-terracotta text-xs font-semibold uppercase tracking-wider border border-brand-terracotta/30 text-left space-y-2">
              <div>{error}</div>
              {attemptsLeft < 3 && lockoutSeconds === 0 && (
                <div className="pt-2 border-t border-brand-terracotta/20 flex justify-between items-center text-[10px]">
                  <span>Need help signing in?</span>
                  <Link to="/register" className="underline font-bold hover:text-brand-walnut uppercase">
                    Register Studio Account →
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={lockoutSeconds > 0}
                className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="admin@hommiespace.com"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={lockoutSeconds > 0}
                  className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 pr-20 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-brand-sand-light/80 hover:bg-brand-sand-light border border-brand-sand-dark/30 text-brand-walnut hover:text-brand-terracotta transition-colors text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer z-20 shadow-sm"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || lockoutSeconds > 0}
              style={{ backgroundColor: lockoutSeconds > 0 ? '#6B7280' : '#3D2E26', color: '#FAF8F5' }}
              className="w-full py-4 text-center mt-4 text-white font-serif uppercase tracking-widest font-bold text-xs hover:bg-[#BC6C58] transition-all disabled:opacity-50 cursor-pointer shadow-lg active:scale-95 border-none block"
            >
              {lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : loading ? 'Authenticating...' : 'Sign In to Dashboard →'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-brand-clay font-sans">
            <span>Want to sell on HommieSpace? </span>
            <Link to="/register" className="text-brand-terracotta font-semibold hover:underline">
              Register Studio Partner Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
