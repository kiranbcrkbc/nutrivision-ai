import React from 'react';
import { Link } from 'react-router-dom';
export const HowItWorksPage: React.FC = () => <article className="max-w-3xl mx-auto p-6 sm:py-16 space-y-8"><h1 className="text-3xl font-bold">How it works</h1><ol className="space-y-6 list-decimal pl-6">{[
['Create your account','Your assessments and photo records are associated with your account.'],
['Choose a body area and photo','Upload a JPG, PNG, or WebP under 10 MB. Use a well-lit photo at least 224 pixels on each side.'],
['Check quality and record symptoms','We check photo clarity and whether it appears to show your selected body area. Unrelated or uncertain photos need to be replaced. Select the symptoms you want to discuss with a clinician.'],
['Read the actual outcome','Save your photo check and symptoms in one record. The app cannot diagnose a vitamin deficiency; a clinician can assess your concerns and recommend tests when needed.'],
['Explore your next steps','Browse food information, review saved records, print an assessment summary, or find care in Bengaluru.'],
].map(([title,text])=><li key={title}><h2 className="font-semibold text-lg">{title}</h2><p className="text-slate-600 dark:text-slate-300 mt-2">{text}</p></li>)}</ol><Link to="/assessment/new" className="inline-block bg-health-700 text-white px-6 py-3 rounded-xl">Start an assessment</Link></article>;
