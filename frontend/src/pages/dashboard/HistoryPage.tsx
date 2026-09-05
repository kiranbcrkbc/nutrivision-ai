import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, PlusCircle, ArrowRight, Clock, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { assessmentService, AssessmentSummary } from '../../services/assessmentService';
import { showToast } from '../../services/toastStore';

export const HistoryPage: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await assessmentService.getUserAssessments();
      setAssessments(data);
    } catch (err: any) {
      showToast.error('Load Error', 'Failed to retrieve assessment history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete assessment #${id}?`)) return;

    try {
      await assessmentService.deleteAssessment(id);
      setAssessments((prev) => prev.filter((a) => a.assessmentId !== id));
      showToast.success('Deleted', `Assessment #${id} has been removed.`);
    } catch (err: any) {
      showToast.error('Delete Error', 'Could not delete assessment.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading assessment history..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assessment History"
        subtitle="Review and track all your previous preliminary visual and symptom screening sessions."
        actions={
          <Link to="/assessment/new">
            <Button variant="primary" size="sm" rightIcon={<PlusCircle className="w-4 h-4" />}>
              New Assessment
            </Button>
          </Link>
        }
      />

      {assessments.length === 0 ? (
        <EmptyState
          title="No Assessment History Found"
          description="You have not created any assessments yet. Begin your first screening session using our 6-step guided wizard."
          actionLabel="Start New Assessment"
          onAction={() => window.location.assign('/assessment/new')}
        />
      ) : (
        <div className="space-y-4">
          {assessments.map((item) => (
            <Card key={item.assessmentId} variant="default" className="p-5 hoverable">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-base text-slate-900 dark:text-slate-100">
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
                    <span>Severity: <strong>{item.severityRiskLevel || 'Pending Review'}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/assessment/${item.assessmentId}`}>
                    <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDelete(item.assessmentId)}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Assessment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
