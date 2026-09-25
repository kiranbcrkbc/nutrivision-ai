import React, { useState, useEffect } from 'react';
import { Server, Database, Cpu, Globe, RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { healthService } from '../../services/healthService';
import { ServiceHealth } from '../../types';
import { API_BASE_URL, AI_SERVICE_URL } from '../../services/api';

export const DevStatusPage: React.FC = () => {
  const [health, setHealth] = useState<ServiceHealth>({
    frontend: 'UP',
    backend: 'CHECKING',
    database: 'UNKNOWN',
    aiService: 'CHECKING',
    aiModelStatus: 'unknown',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('');

  const runHealthCheck = async () => {
    setIsRefreshing(true);
    try {
      const res = await healthService.checkAllServices();
      setHealth(res);
      setLastChecked(new Date().toLocaleTimeString());
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const getStatusBadge = (status: 'UP' | 'DOWN' | 'CHECKING' | 'UNKNOWN') => {
    if (status === 'UP') {
      return <Badge variant="success" size="md"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> RUNNING / UP</Badge>;
    }
    if (status === 'CHECKING') {
      return <Badge variant="warning" size="md">CHECKING...</Badge>;
    }
    if (status === 'UNKNOWN') {
      return <Badge variant="neutral" size="md">UNKNOWN</Badge>;
    }
    return <Badge variant="danger" size="md"><AlertCircle className="w-3.5 h-3.5 mr-1" /> OFFLINE / DOWN</Badge>;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="System & Service Diagnostics"
        subtitle="Live development health telemetry across all Vitamin Deficiency architectural layers."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={runHealthCheck}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh Status
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Frontend */}
        <Card variant="default" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-health-50 dark:bg-health-950/70 text-health-600 dark:text-health-400">
              <Globe className="w-6 h-6" />
            </div>
            {getStatusBadge(health.frontend)}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">React Frontend</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Vite 5 + TypeScript + Tailwind</p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span>Port: 5173 • SPA Router Active</span>
          </div>
        </Card>

        {/* Backend */}
        <Card variant="default" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400">
              <Server className="w-6 h-6" />
            </div>
            {getStatusBadge(health.backend)}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Spring Boot Backend</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{API_BASE_URL}</p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 truncate">
            <span>{health.backendMessage || 'Awaiting connection'}</span>
          </div>
        </Card>

        {/* Database */}
        <Card variant="default" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
              <Database className="w-6 h-6" />
            </div>
            {getStatusBadge(health.database)}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">MySQL Database</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">nutrivision_db :3306</p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span>Verified via Spring Data JPA</span>
          </div>
        </Card>

        {/* AI Service */}
        <Card variant="default" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
              <Cpu className="w-6 h-6" />
            </div>
            {getStatusBadge(health.aiService)}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">FastAPI AI Engine</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{AI_SERVICE_URL}</p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>Model: <strong className="text-slate-700 dark:text-slate-300">{health.aiModelStatus}</strong></span>
          </div>
        </Card>
      </div>

      {lastChecked && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Last automated health probe: {lastChecked}</span>
        </div>
      )}
    </div>
  );
};
