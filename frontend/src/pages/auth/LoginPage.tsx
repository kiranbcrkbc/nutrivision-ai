import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { useAuthStore } from '../../services/authStore';
import { showToast } from '../../services/toastStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await login(email, password);
      showToast.success('Login Successful', 'Welcome back to Vitamin Deficiency.');
      navigate(from, { replace: true });
    } catch (err: any) {
      const errorMsg = err.message || 'Invalid email or password. Please verify credentials.';
      setErrors({ form: errorMsg });
      showToast.error('Authentication Error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-health-600 flex items-center justify-center text-white shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-slate-100 tracking-tight">
            Vitamin <span className="text-health-600 dark:text-health-400">Deficiency</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Sign in to access your assessment history and nutrition plans
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card variant="elevated" className="p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-health-600 hover:text-health-700 dark:text-health-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
                autoComplete="current-password"
              />
            </div>

            {errors.form && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errors.form}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-semibold text-health-600 dark:text-health-400 hover:underline">
                Create free account
              </Link>
            </p>
          </div>
        </Card>

        {/* Development Helper Badge */}
        <div className="mt-4 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-health-600" />
          <span>Sign in to your personal account</span>
        </div>
      </div>
    </div>
  );
};
