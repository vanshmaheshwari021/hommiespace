import React, { useState } from 'react';
import { Card } from '@hommiespace/ui';
import { useAuthStore } from '../store/auth.js';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@hommiespace.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const adminUser = {
      id: 'super-admin-01',
      name: 'Super Administrator',
      email: 'admin@hommiespace.com',
      role: 'admin' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAuth(adminUser as any, 'admin-secret-token-2026', null);
    window.location.href = '/admin/dashboard';
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

        <Card className="p-8 bg-white border border-brand-sand-dark/25 shadow-xl text-left" hoverEffect={false}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-sand-dark/20">
            <div>
              <h2 className="font-serif text-xl font-bold text-brand-walnut">
                Super Admin Sign In
              </h2>
              <p className="text-xs text-brand-clay mt-0.5 font-sans">
                Executive Control System
              </p>
            </div>

            <span className="px-2.5 py-1 text-[10px] uppercase font-mono font-bold tracking-wider border rounded-full bg-emerald-100 text-emerald-800 border-emerald-300">
              Authorized Mode
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
                Super Admin Email
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
                Super Admin Password
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

            {/* Direct Action Submit Button */}
            <button
              type="button"
              onClick={() => handleSubmit()}
              style={{ backgroundColor: '#3D2E26', color: '#FAF8F5' }}
              className="w-full py-4 text-center mt-4 text-white font-serif uppercase tracking-widest font-bold text-xs hover:bg-[#BC6C58] transition-all cursor-pointer shadow-lg active:scale-95 border-none block"
            >
              Sign In to Super Admin Panel →
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
