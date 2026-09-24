import React from 'react';
import { Link } from 'react-router-dom';
export const HowItWorksPage: React.FC = () => <article className="max-w-3xl mx-auto p-6 sm:py-16 space-y-8"><h1 className="text-3xl font-bold">How it works</h1><ol className="space-y-6 list-decimal pl-6">{[
['Create your account','Your assessments and photo records are associated with your account.'],
['Choose a body area and photo','Upload a JPG, PNG, or WebP under 10 MB. Use a well-lit photo at least 224 pixels on each side.'],
['Check quality and record symptoms','We check resolution, sharpness, and lighting. Select the symptoms you want to discuss with a clinician.'],
['Read the actual outcome','The current model is trained on synthetic drawings and is not validated for real photos. The app will explain that screening is unavailable instead of inventing a deficiency, confidence score, or risk level.'],
['Explore your next steps','Browse food information, review saved records, print an assessment summary, or find care in Bengaluru.'],
].map(([title,text])=><li key={title}><h2 className="font-semibold text-lg">{title}</h2><p className="text-slate-600 dark:text-slate-300 mt-2">{text}</p></li>)}</ol><Link to="/assessment/new" className="inline-block bg-health-700 text-white px-6 py-3 rounded-xl">Start an assessment</Link></article>;
