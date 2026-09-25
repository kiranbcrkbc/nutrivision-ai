import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
interface Summary {totalUsers:number;totalAssessments:number;totalImages:number;activeModel:string;}
export const AdminDashboardPage: React.FC = () => {
  const [data,setData]=useState<Summary|null>(null);const [error,setError]=useState(false);const [loading,setLoading]=useState(true);
  const load=async()=>{setLoading(true);setError(false);try{const response=await api.get('/admin/summary');setData(response.data.data);}catch{setError(true);}finally{setLoading(false);}};
  useEffect(()=>{void load();},[]);
  return <div className="space-y-6"><PageHeader title="Administration" subtitle="Current database totals. No synthetic usage or accuracy statistics." />{loading ? <p role="status">Loading summary...</p> : error ? <Card className="p-6"><p role="alert">The summary could not be loaded.</p><Button onClick={load}>Try again</Button></Card> : data && <><div className="grid sm:grid-cols-3 gap-4">{[['Accounts',data.totalUsers],['Assessments',data.totalAssessments],['Photos',data.totalImages]].map(([label,count])=><Card key={label} className="p-6"><h2 className="text-sm text-slate-500">{label}</h2><p className="text-3xl font-bold mt-3">{count}</p></Card>)}</div><Card className="p-6 space-y-3"><h2 className="font-bold">Model validation</h2><p>{data.activeModel}</p><p className="text-sm">No measured real-photo accuracy or clinical bias evaluation is available. The app does not issue photo-based deficiency predictions.</p></Card></>}</div>;
};
