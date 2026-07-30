import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { loginSchema } from '@hommiespace/shared';
import type { LoginInput } from '@hommiespace/shared';
import { Button, Card } from '@hommiespace/ui';
import { useAuthStore } from '../store/auth.js';
import API from '../api/index.js';

export const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('/auth/login', data);
      const { user, token } = response.data.data;
      
      // Fetch full vendor details if vendor role
      let vendor = null;
      if (user.role === 'vendor') {
        const meResponse = await API.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        vendor = meResponse.data.data.vendor;
      }
      
      setAuth(user, token, vendor);

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        setError('Forbidden: This portal is only for administrators or vendor partners.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-brand-terracotta text-[10px] mt-1 font-semibold">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-brand-clay mb-2">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full bg-brand-linen-light border border-brand-sand-dark/35 px-4 py-3 text-xs font-sans text-brand-walnut focus:outline-none focus:border-brand-walnut transition-colors rounded-none"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-brand-terracotta text-[10px] mt-1 font-semibold">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-center mt-2"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
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
