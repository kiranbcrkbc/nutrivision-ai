import React from 'react';
import { Link } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
export const ForgotPasswordPage: React.FC = () => <div className="max-w-md mx-auto my-16 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
  <LockKeyhole className="w-8 h-8 text-health-600" />
  <h1 className="text-2xl font-bold">Account recovery</h1>
  <p className="text-slate-600 dark:text-slate-300">Email password recovery is not available yet. Contact the project administrator for help accessing your account.</p>
  <p className="text-sm text-slate-500">No reset email has been sent. Never share your password.</p>
  <Link to="/login" className="inline-block text-health-700 font-semibold">Back to sign in</Link>
</div>;
