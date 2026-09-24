import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid registered email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
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
          Reset password
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter your registered email and we'll send password recovery instructions
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card variant="elevated" className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Instructions Sent
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                If an account exists with <strong className="text-slate-700 dark:text-slate-300">{email}</strong>, a password reset link has been dispatched. (In this development prototype, check console/backend logs).
              </p>
              <Link to="/login" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                leftIcon={<Mail className="w-4 h-4" />}
                autoComplete="email"
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-health-600 dark:hover:text-health-400">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
