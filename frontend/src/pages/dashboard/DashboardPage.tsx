import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Activity,
  History,
  Utensils,
  TrendingUp,
  FileText,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Clock,
  Sparkles,
  ClipboardList,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  BarChart3,
  Flame
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import { useAuthStore } from '../../services/authStore';
import { analyticsService } from '../../services/analyticsService';
import { DashboardAnalytics } from '../../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsService.getDashboardAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.warn('Could not fetch real dashboard analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const totalAssessments = analytics?.totalAssessments ?? 0;
  const completedAssessments = analytics?.completedAssessments ?? 0;
  const totalImages = analytics?.totalImagesUploaded ?? 0;
  const qualityPassed = analytics?.qualityStatusCounts?.['PASSED'] ?? 0;
  const qualityRejected = analytics?.qualityStatusCounts?.['REJECTED'] ?? 0;
  const qualityWarning = analytics?.qualityStatusCounts?.['WARNING'] ?? 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <PageHeader
        title={`Welcome, ${user?.fullName || 'Health Seeker'} 👋`}
        subtitle="Manage your personal preliminary vitamin and nutrient deficiency screenings and diet recommendations."
        actions={
          <div className="flex flex-wrap gap-2.5">
            <Link to="/demo">
              <Button variant="outline" size="md" leftIcon={<Flame className="w-4 h-4 text-amber-500" />}>
                Demo Mode 🎓
              </Button>
            </Link>
            <Link to="/assessment/new">
              <Button variant="primary" size="md" rightIcon={<PlusCircle className="w-4 h-4" />}>
                Start New Assessment
              </Button>
            </Link>
          </div>
        }
      />

      {/* Safety Notice Banner */}
      <MedicalDisclaimer variant="banner" />

      {/* Summary Stat Cards (Database Synchronized) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Screenings
            </span>
            <div className="p-2 rounded-xl bg-health-50 dark:bg-health-950/60 text-health-600 dark:text-health-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalAssessments}</span>
            <span className="text-xs text-slate-400">({completedAssessments} Completed)</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {totalAssessments > 0 ? 'Active in MySQL database' : 'Ready for first session'}
          </p>
        </Card>

        <Card variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              OpenCV Quality Gate
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {totalImages > 0 ? `${Math.round((qualityPassed / Math.max(1, totalImages)) * 100)}%` : '100%'}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400">Pass Rate</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {totalImages} uploads evaluated ({qualityRejected} rejected)
          </p>
        </Card>

        <Card variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              AI Inference Model
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <Badge variant="success" size="md">
              {analytics?.modelTelemetry?.modelStatus || 'OPERATIONAL'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {analytics?.modelTelemetry?.modelName || 'MobileNetV2 (ONNX)'}
          </p>
        </Card>

        <Card variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Diet Preference
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">
              {user?.dietaryPreference || 'ANY'} Diet Focus
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Region: {user?.city || 'South India'}
          </p>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Activity Feed & Body Part Distribution */}
        <div className="lg:col-span-8 space-y-6">
          <Card variant="default">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Assessments</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Your most recent preliminary visual & symptom screenings
                </p>
              </div>
              <Link to="/history">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View All
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 flex items-center justify-center">
                  <LoadingSpinner size="md" label="Loading database records..." />
                </div>
              ) : !analytics?.recentAssessments || analytics.recentAssessments.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title="No Assessments Yet"
                    description="You have not completed any preliminary deficiency assessments yet. Upload a photo of your nails, eyes, tongue, lips, skin, or hair to get started."
                    actionLabel="Start First Assessment"
                    onAction={() => navigate('/assessment/new')}
                  />
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {analytics.recentAssessments.map((item) => (
                    <div
                      key={item.assessmentId}
                      className="p-5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                            Assessment #{item.assessmentId} — {item.targetBodyPart}
                          </span>
                          <Badge
                            variant={
                              item.status === 'COMPLETED'
                                ? 'success'
                                : item.status === 'IN_PROGRESS'
                                ? 'warning'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span>Severity: <strong>{item.severityRiskLevel || 'Pending'}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <Link to={`/assessment/${item.assessmentId}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Body Part Distribution Card */}
          {analytics?.bodyPartDistribution && Object.keys(analytics.bodyPartDistribution).length > 0 && (
            <Card variant="default" className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-health-600" />
                  <span>Target Region Distribution</span>
                </h4>
                <span className="text-xs text-slate-400">Database Breakdown</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(analytics.bodyPartDistribution).map(([part, count]) => (
                  <div key={part} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{part}</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{count}</span>
                    <span className="text-[10px] text-slate-500 block">Session(s)</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right: Telemetry & College Demonstration Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Demonstration Mode Spotlight Card */}
          <Card variant="default" className="p-6 bg-gradient-to-br from-amber-500/10 via-health-500/5 to-transparent border-amber-400/40 dark:border-amber-600/30 space-y-4">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <Flame className="w-5 h-5 text-amber-600" />
              <span>College Demo Mode</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Step through the complete live 5-stage pipeline with pre-loaded prototype samples for examination and viva presentation.
            </p>
            <Link to="/demo" className="block">
              <Button variant="primary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Live Demonstration
              </Button>
            </Link>
          </Card>

          {/* Quick Shortcuts */}
          <Card variant="default" className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Quick Shortcuts
            </h3>
            
            <div className="space-y-2.5">
              <Link to="/recommendations" className="block">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-health-300 dark:hover:border-health-700 hover:bg-health-50/40 dark:hover:bg-health-950/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Food Recommendations</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Curated nutrient lists</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>

              <Link to="/reports" className="block">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-health-300 dark:hover:border-health-700 hover:bg-health-50/40 dark:hover:bg-health-950/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Official Health Reports</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Structured PDF exports</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>

              <Link to="/chatbot" className="block">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-health-300 dark:hover:border-health-700 hover:bg-health-50/40 dark:hover:bg-health-950/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">AI Nutrition Chatbot</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Ask vitamin & diet questions</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
