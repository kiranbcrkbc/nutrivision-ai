import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, BookOpen, MapPin, ShieldCheck, Leaf, History } from 'lucide-react';

export const LandingPage: React.FC = () => <div className="bg-[#f7faf8] dark:bg-slate-950">
  <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
    <div className="space-y-7">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-health-700 dark:text-health-400">Understand nutrition. Make informed choices.</p>
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-slate-900 dark:text-white">A clearer picture of your<br /><span className="text-health-700 dark:text-health-400">nutritional wellbeing.</span></h1>
      <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-lg">Keep a record of your concerns, learn about vitamins and everyday foods, and find the right care when you need it.</p>
      <div className="flex flex-wrap gap-3"><Link to="/assessment/new" className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-health-700 text-white font-semibold shadow-sm">Start an assessment <ArrowRight className="w-4 h-4" /></Link><Link to="/how-it-works" className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold">How it works</Link></div>
      <p className="flex gap-2 text-sm text-slate-500"><ShieldCheck className="w-5 h-5 flex-shrink-0" />Educational support, with clear limits. Not a medical diagnosis.</p>
    </div>
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 sm:p-10 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-7">
      <div className="flex items-center gap-3"><div className="p-3 bg-health-50 dark:bg-health-950 rounded-2xl"><Leaf className="w-7 h-7 text-health-700" /></div><div><h2 className="font-bold text-xl">Small steps, better understanding</h2><p className="text-sm text-slate-500">Your personal nutrition companion</p></div></div>
      {[['01','Record your concern','Choose a body area and upload a clear close-up photo.'],['02','Check your photo','Get feedback on photo clarity and body-area suitability.'],['03','Take the next step','Explore food guidance, save your history, or find a clinician.']].map(([number,title,body]) => <div key={number} className="flex gap-4"><span className="text-health-600 font-bold text-sm pt-1">{number}</span><div><h3 className="font-semibold">{title}</h3><p className="text-sm text-slate-500 mt-1 leading-relaxed">{body}</p></div></div>)}
      <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 p-4 text-sm text-amber-900 dark:text-amber-200"><strong>Know what a photo can tell you.</strong> Photo checks help you create a useful record. Vitamin deficiencies require professional assessment and, when appropriate, laboratory tests.</div>
    </div>
  </section>
  <section className="max-w-6xl mx-auto px-6 pb-20"><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[
    {icon:Camera,title:'Smarter photo uploads',text:'Check clarity and body-area suitability before saving.',href:'/assessment/new'},
    {icon:BookOpen,title:'Food & vitamin guidance',text:'Explore everyday food sources and nutrition information.',href:'/recommendations'},
    {icon:History,title:'Your saved history',text:'Review your own assessments and recorded outcomes.',href:'/history'},
    {icon:MapPin,title:'Find professional care',text:'Search Bengaluru for a physician or dietitian.',href:'/doctors'},
  ].map(({icon:Icon,title,text,href}) => <Link key={title} to={href} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-health-500 transition-colors"><Icon className="w-6 h-6 text-health-600 mb-4" /><h2 className="font-semibold mb-2">{title}</h2><p className="text-sm text-slate-500 leading-relaxed">{text}</p></Link>)}</div></section>
</div>;
