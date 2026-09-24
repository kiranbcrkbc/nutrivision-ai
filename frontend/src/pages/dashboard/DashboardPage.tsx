import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuthStore } from '../../services/authStore';
import { analyticsService } from '../../services/analyticsService';
import { DashboardAnalytics } from '../../types';
export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [data,setData]=useState<DashboardAnalytics|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(false);
  const load=async()=>{setLoading(true);setError(false);try{setData(await analyticsService.getDashboardAnalytics());}catch{setError(true);}finally{setLoading(false);}};
  useEffect(()=>{void load();},[]);
  return <div className="space-y-7 max-w-6xl mx-auto">
    <PageHeader title={`Welcome, ${user?.fullName || 'there'}`} subtitle="Your nutrition information and personal assessment records, together in one place." actions={<Link to="/assessment/new"><Button>Start an assessment</Button></Link>} />
    <Card className="p-5 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900"><h2 className="font-semibold">Know what your photo can tell you</h2><p className="text-sm mt-2">We can check photo quality. The current model is not validated to identify a deficiency or verify the body area, so it will not assign a medical result. Food guidance is educational.</p></Card>
    {loading ? <p role="status">Loading your records...</p> : error ? <Card className="p-6 space-y-3"><p role="alert">We could not load your records. Your saved data has not been changed.</p><Button onClick={load}>Try again</Button></Card> : data && <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[['Saved assessments',data.totalAssessments],['Uploaded photos',data.totalImagesUploaded],['Quality passed',data.qualityStatusCounts.PASSED || 0],['Need a clearer photo',data.qualityStatusCounts.REJECTED || 0]].map(([title,count])=><Card key={title} className="p-5"><p className="text-sm text-slate-500">{title}</p><p className="text-3xl font-bold mt-3">{count}</p></Card>)}</div>
      <Card className="p-6"><div className="flex justify-between gap-4 mb-5"><h2 className="font-semibold text-xl">Recent records</h2><Link to="/history" className="text-health-600 underline">View history</Link></div>{data.recentAssessments.length ? <ul className="divide-y divide-slate-200 dark:divide-slate-800">{data.recentAssessments.map(record=><li key={record.assessmentId}><Link to={`/assessment/${record.assessmentId}`} className="flex flex-wrap justify-between gap-3 py-4"><span>#{record.assessmentId} · {record.targetBodyPart.toLowerCase()}</span><span className="text-sm text-slate-500">{new Date(record.createdAt).toLocaleDateString()} · {record.status.replace(/_/g,' ').toLowerCase()}</span></Link></li>)}</ul> : <p className="text-slate-500">No assessments yet. Start one whenever you are ready.</p>}</Card>
    </>}
    <div className="grid sm:grid-cols-2 gap-4">{[['Food guidance','Explore foods and dietary preferences.','/recommendations'],['Activity chart','See your actual saved assessment activity.','/progress'],['Your reports','Print records without invented results.','/reports'],['Nutrition questions','Get educational answers from our rule-based guide.','/chatbot']].map(([title,text,url])=><Link key={url} to={url}><Card className="p-6 h-full hover:border-health-500"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-slate-500">{text}</p></Card></Link>)}</div>
  </div>;
};
