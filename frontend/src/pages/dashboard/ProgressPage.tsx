import React from 'react';
import { TrendingUp, Activity, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const ProgressPage: React.FC = () => {
  const trendData = [
    { date: 'Aug 10', confidence: 68, risk: 'Moderate' },
    { date: 'Aug 18', confidence: 72, risk: 'Moderate' },
    { date: 'Aug 28', confidence: 74, risk: 'Low' },
    { date: 'Sep 03', confidence: 82, risk: 'Moderate' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Longitudinal Progress Tracking"
        subtitle="Monitor preliminary model confidence and attention level trends across multiple assessments over time."
      />

      {/* Recharts Chart Card */}
      <Card variant="default" className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Model Confidence Trend (%)</CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Statistical indicator consistency over historical checkups
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={12} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="confidence"
                name="Model Confidence"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ r: 5, fill: '#0d9488' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
