import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@hommiespace/ui';
import { useAuthStore } from '../store/auth.js';
import API from '../api/index.js';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      setError('Please fill out all required fields.');
      return;
    }

    if (cleanPassword !== confirmPassword.trim()) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (cleanPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await API.post('/auth/register', {
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        role: 'customer'
      });

      const { user, token } = response.data.data;
      setAuth(user, token);

      // Successfully registered -> Navigate to Customer Orders tracking page
      navigate('/orders');
    } catch (err: any) {
      console.error('Customer Registration Error:', err);
      const msg = err.response?.data?.message || 'Registration failed. Email may already be in use.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-linen flex flex-col justify-between p-4 py-8">
      {/* Top Header Navigation */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between mb-4">
        <Link to="/" className="text-xs font-mono font-bold uppercase tracking-widest text-brand-walnut hover:text-brand-terracotta flex items-center gap-1.5 transition-colors">
          ← Back to Storefront
        </Link>
        <span className="text-[10px] uppercase tracking-widest font-mono text-brand-clay font-semibold">Customer Account</span>
      </div>

      <div className="w-full max-w-md mx-auto my-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <h1 className="font-serif text-3xl font-black tracking-wider">
              <span className="text-[#3D2E26]">HOMMIE</span>
              <span className="text-brand-terracotta">SPACE</span>
            </h1>
          </Link>
          <p className="text-brand-clay text-[10px] uppercase tracking-widest font-semibold mt-1">
            Quiet Luxury Furniture & Decor
          </p>
        </div>

        <Card className="p-8 bg-white border border-brand-sand-dark/25 shadow-xl text-left" hoverEffect={false}>
          <h2 className="font-serif text-xl font-bold text-brand-walnut mb-2 text-center">
            Create Customer Account
          </h2>
          <p className="text-xs text-brand-clay mb-6 text-center font-sans">
            Join HommieSpace to track your orders, save curated pieces, and manage addresses.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-brand-terracotta/10 text-brand-terracotta text-xs font-semibold uppercase tracking-wider border border-brand-terracotta/30">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none"
                placeholder="Jane Doe"
              />
            </div>

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
                placeholder="jane@example.com"
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
                  className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 pr-20 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none"
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

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#3D2E26', color: '#FAF8F5' }}
              className="w-full py-4 text-center mt-4 text-white font-serif uppercase tracking-widest font-bold text-xs hover:bg-[#BC6C58] transition-all disabled:opacity-50 cursor-pointer shadow-lg active:scale-95 border-none block"
            >
              {loading ? 'Creating Account...' : 'Register & Track Orders →'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-brand-clay font-sans flex flex-col gap-2">
            <div>
              <span>Already have an account? </span>
              <Link to="/login" className="text-brand-terracotta font-semibold hover:underline">
                Sign in here
              </Link>
            </div>
            <div className="pt-2 border-t border-brand-sand-dark/15 text-[11px]">
              <span>Want to sell items as a partner studio? </span>
              <a href="http://localhost:5174/register" target="_blank" rel="noopener noreferrer" className="text-brand-walnut font-bold hover:underline">
                Register Studio →
              </a>
            </div>
          </div>
        </Card>
      </div>

      <div className="text-[10px] text-brand-clay uppercase tracking-widest text-center mt-6">
        © 2026 HommieSpace Design Inc.
      </div>
    </div>
  );
};

export default Register;
