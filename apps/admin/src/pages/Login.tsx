import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@hommiespace/ui';
import { useAuthStore } from '../store/auth.js';
import API from '../api/index.js';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@hommiespace.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const doLogin = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

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

      if (user.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else if (user.role === 'vendor') {
        window.location.href = '/vendor/dashboard';
      } else {
        setError('Forbidden: Customer accounts cannot access the Partner Portal.');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin();
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
            Partner & Admin Portal
          </p>
        </div>

        <Card className="p-8 bg-white border border-brand-sand-dark/25" hoverEffect={false}>
          <h2 className="font-serif text-xl font-bold text-brand-walnut mb-6 text-center">
            Sign In to Dashboard
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-brand-terracotta/10 text-brand-terracotta text-xs font-semibold uppercase tracking-wider border border-brand-terracotta/20">
              {error}
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
                className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none"
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
                  className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 pr-10 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword(prev => !prev);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-clay hover:text-brand-walnut transition-colors p-2 cursor-pointer z-10"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4 text-brand-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-brand-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 text-center mt-2 bg-brand-walnut text-brand-linen font-serif uppercase tracking-widest font-bold text-xs hover:bg-brand-charcoal transition-all disabled:opacity-50 cursor-pointer shadow-md active:scale-95 border-none"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-brand-clay font-sans">
            <span>Want to sell on HommieSpace? </span>
            <Link to="/register" className="text-brand-terracotta font-semibold hover:underline">
              Register here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
