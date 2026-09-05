import React from 'react';
import { ShieldCheck, Users, Activity, Database, Cpu, Sliders, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Control Center"
        subtitle="System analytics, model versioning, dataset registry, and fairness monitoring."
        badge={<Badge variant="health" size="md">ADMIN ROLE</Badge>}
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Registered Users</span>
            <Users className="w-4 h-4 text-health-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">1,420</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Active patient/student accounts</p>
        </Card>

        <Card variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Assessments</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">3,890</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Screening sessions executed</p>
        </Card>

        <Card variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Active AI Model</span>
            <Cpu className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <Badge variant="health" size="sm">v1.0.0-mobilenetv2</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">Dynamic registry loader</p>
        </Card>

        <Card variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Avg Model Confidence</span>
            <Sliders className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">78.4%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across 6 body parts</p>
        </Card>
      </div>

      {/* Modules Placeholder Info */}
      <Card variant="default" className="p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
          Admin Management Modules (Phase 14 & 15 Foundation)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          The administrative routing and database entities for User Management, Assessment Telemetry, Dataset Registry (F22), Model Benchmarking (F23), Bias & Diversity Stratification (F25), and Feedback Triage (F28) are architected. Full CRUD controls activate in Phase 14.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Dataset Registry (F22)</h4>
            <p className="text-slate-500">Track data source provenance, license types, and class balances.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Model Versioning (F23)</h4>
            <p className="text-slate-500">Benchmark MobileNet vs ResNet vs EfficientNet and swap active weights.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Bias Analysis (F25)</h4>
            <p className="text-slate-500">Monitor model fairness across Fitzpatrick skin tones and lighting conditions.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
