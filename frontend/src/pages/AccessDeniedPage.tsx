import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const AccessDeniedPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
      <Card variant="default" className="max-w-md w-full p-8 text-center space-y-5 shadow-health-card">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900/50">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            HTTP 403 Forbidden
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Access Denied
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            You do not have administrative permissions (<code className="text-rose-600 dark:text-rose-400 font-semibold">ROLE_ADMIN</code>) to view this control portal.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full" leftIcon={<Home className="w-4 h-4" />}>
              Return to Dashboard
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Public Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
