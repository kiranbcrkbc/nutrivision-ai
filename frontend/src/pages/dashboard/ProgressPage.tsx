import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { assessmentService, AssessmentSummary } from '../../services/assessmentService';

export const ProgressPage: React.FC = () => {
  const [records, setRecords] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const load = async () => {
    setLoading(true); setError(false);
    try { setRecords(await assessmentService.getUserAssessments()); }
    catch { setError(true); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  const days = new Map<string, { date: string; assessments: number; photos: number }>();
  for (const record of records) {
    const date = record.createdAt.slice(0, 10);
    const day = days.get(date) || { date, assessments: 0, photos: 0 };
    day.assessments++; day.photos += record.imageCount || 0; days.set(date, day);
  }
  const data = [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
  return <div className="space-y-6">
    <PageHeader title="Your assessment activity" subtitle="Your saved records over time. Activity is not a measure of vitamin levels or health improvement." />
    {loading ? <p role="status">Loading your history...</p> : error ? <Card className="p-6 space-y-3"><p role="alert">We could not load your history.</p><Button onClick={load}>Try again</Button></Card> : !data.length ? <Card className="p-8 space-y-3"><h2 className="text-xl font-semibold">Your progress starts here</h2><p>No assessments have been saved yet.</p><Link to="/assessment/new" className="text-health-600 underline">Start an assessment</Link></Card> : <>
      <Card className="p-6"><h2 className="font-semibold mb-6">Assessments and photos by date</h2><div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="date" fontSize={11} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="assessments" name="Assessments" fill="#0d9488" radius={[4,4,0,0]} /><Bar dataKey="photos" name="Photos" fill="#64748b" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></Card>
      <Card className="p-6 overflow-x-auto"><table className="w-full text-sm text-left"><caption className="text-left mb-3 font-semibold">Activity table</caption><thead><tr><th className="p-2">Date</th><th>Assessments</th><th>Photos</th></tr></thead><tbody>{data.map(day => <tr key={day.date} className="border-t border-slate-200 dark:border-slate-800"><td className="p-2">{day.date}</td><td>{day.assessments}</td><td>{day.photos}</td></tr>)}</tbody></table></Card>
    </>}
  </div>;
};
