import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  Hand,
  Smile,
  HeartPulse,
  Utensils,
  CheckCircle2,
  TrendingUp,
  FileText,
  MessageSquare,
  Search,
  Sliders,
  AlertTriangle,
  Zap,
  Flame,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardContent } from '../components/common/Card';
import { SectionHeader } from '../components/common/SectionHeader';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';

export const LandingPage: React.FC = () => {
  const bodyParts = [
    { name: 'Nails', icon: <Hand className="w-6 h-6" />, desc: 'Detects spooning, brittleness, and pallor associated with Iron and B-complex deficiencies.', color: 'from-amber-500/20 to-teal-500/20' },
    { name: 'Eyes', icon: <Eye className="w-6 h-6" />, desc: 'Analyzes conjunctival pallor and dry-eye signs linked to Vitamin A and Iron deficiencies.', color: 'from-blue-500/20 to-teal-500/20' },
    { name: 'Tongue', icon: <Smile className="w-6 h-6" />, desc: 'Screening for glossitis and surface inflammation associated with Vitamin B12 and Folate.', color: 'from-rose-500/20 to-amber-500/20' },
    { name: 'Lips', icon: <Smile className="w-6 h-6" />, desc: 'Evaluates angular cheilitis and cracking often seen in B2/B6 and Iron deficiencies.', color: 'from-pink-500/20 to-purple-500/20' },
    { name: 'Skin', icon: <HeartPulse className="w-6 h-6" />, desc: 'Checks for follicular hyperkeratosis, slow wound repair, and dryness linked to Vitamins A & C.', color: 'from-emerald-500/20 to-teal-500/20' },
    { name: 'Hair', icon: <Sparkles className="w-6 h-6" />, desc: 'Observes brittleness and diffuse shedding indicators related to Vitamin D and Zinc.', color: 'from-purple-500/20 to-indigo-500/20' },
  ];

  const features = [
    { title: 'Multi-Body-Part Visual Analysis', desc: 'Targeted computer vision feature extraction tailored to specific anatomical regions.', icon: <Search className="w-5 h-5 text-health-600 dark:text-health-400" /> },
    { title: 'AI Quality Validation', desc: 'Automated pre-screening rejecting blurry or poorly illuminated images with helpful feedback.', icon: <Sliders className="w-5 h-5 text-health-600 dark:text-health-400" /> },
    { title: 'Top-3 Predictions & Confidence', desc: 'Ranked candidate indicators accompanied by statistical Model Confidence percentages.', icon: <Zap className="w-5 h-5 text-health-600 dark:text-health-400" /> },
    { title: 'Symptom Fusion Assessment', desc: 'Combines visual photograph indicators with structured self-reported user symptoms.', icon: <HeartPulse className="w-5 h-5 text-health-600 dark:text-health-400" /> },
    { title: 'Personalized Nutrition Guidance', desc: 'Diet-filtered food recommendations (Vegetarian, Vegan, Non-Veg) for each deficiency class.', icon: <Utensils className="w-5 h-5 text-health-600 dark:text-health-400" /> },
    { title: '7-Day Meal Planning', desc: 'Practical weekly nutrient-focused meal outlines to support balanced nutritional habits.', icon: <CalendarDaysIcon className="w-5 h-5 text-health-600 dark:text-health-400" /> },
    { title: 'Downloadable Health Reports', desc: 'Structured PDF summaries of your assessment history and recommendations with disclaimers.', icon: <FileText className="w-5 h-5 text-health-600 dark:text-health-400" /> },
    { title: 'Longitudinal Progress Tracking', desc: 'Visual trend charts tracking your symptoms and risk levels across recurring assessments.', icon: <TrendingUp className="w-5 h-5 text-health-600 dark:text-health-400" /> },
    { title: 'Educational AI Assistant', desc: 'Interactive nutrition chatbot and one-click clinical terminology explanations.', icon: <MessageSquare className="w-5 h-5 text-health-600 dark:text-health-400" /> },
  ];

  const workflowSteps = [
    { step: '01', title: 'Select Body Part', desc: 'Choose the anatomical area you wish to assess: nails, eyes, tongue, lips, skin, or hair.' },
    { step: '02', title: 'Capture or Upload Photo', desc: 'Submit a clear, well-lit photo verified by our automated quality engine.' },
    { step: '03', title: 'Select Symptoms', desc: 'Answer a quick questionnaire to contextualize your visual signs.' },
    { step: '04', title: 'Review Model Confidence', desc: 'Inspect your Top-3 possible indicators with explicit Model Confidence scores.' },
    { step: '05', title: 'Receive Nutrition Plan', desc: 'Explore customized dietary guidance and structured 7-day meal schedules.' },
  ];

  return (
    <div className="space-y-24 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-health-50 dark:bg-health-950/70 border border-health-200 dark:border-health-800 text-xs font-semibold text-health-700 dark:text-health-300">
                <Sparkles className="w-3.5 h-3.5 text-health-600 dark:text-health-400" />
                <span>AI-Assisted Preliminary Nutrition Screening</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15]">
                Smart Preliminary <span className="text-transparent bg-clip-text bg-gradient-to-r from-health-600 to-teal-500">Vitamin & Nutrition</span> Assessment
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Empowering individuals with fast, non-invasive screening of visual deficiency indicators paired with personalized, culturally adaptable dietary recommendations.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link to="/demo" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md hover:shadow-health-glow bg-amber-600 hover:bg-amber-700 text-white border-amber-600" rightIcon={<Flame className="w-5 h-5 text-amber-200" />}>
                    Live Demo Mode 🎓
                  </Button>
                </Link>
                <Link to="/register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md hover:shadow-health-glow" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Start Free Assessment
                  </Button>
                </Link>
                <Link to="/how-it-works" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    How It Works
                  </Button>
                </Link>
              </div>

              {/* Safety Highlight */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-health-600 dark:text-health-400" />
                <span>Preliminary Screening Tool • Non-Diagnostic • 100% Free & Open Source</span>
              </div>
            </div>

            {/* Right Abstract Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Glow Background */}
                <div className="absolute -inset-2 bg-gradient-to-r from-health-500 to-teal-400 rounded-3xl blur-2xl opacity-20 dark:opacity-30" />
                
                <Card variant="elevated" className="relative p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-health-500 animate-pulse" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Demonstration Preview UI
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Sample Result
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Sample Candidate: Iron Deficiency Pattern</span>
                        <span className="font-bold text-health-600 dark:text-health-400">Illustrative Match: 82.4%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-health-500 rounded-full w-[82.4%]" />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Visual Marker: Koilonychia pattern (spoon-shaped nail concavity)
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Dietary Guidance Preview</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Plant-Based</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        Spinach & Dark Leafy Greens (Palak) with Lemon Juice
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Rich in plant-based iron; Vitamin C pairing enhances absorption.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                      <span>Model confidence reflects visual classification probability and does not represent medical certainty. Always consult a qualified doctor for clinical diagnosis.</span>
                    </div>
                  </div>

                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MedicalDisclaimer variant="card" />
      </section>

      {/* How It Works Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Workflow"
          title="How NutriVision AI Works"
          subtitle="A simple, non-invasive 5-step process from photograph upload to personalized dietary plan."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {workflowSteps.map((ws, i) => (
            <Card key={i} variant="default" className="p-5 flex flex-col justify-between hoverable">
              <div>
                <span className="text-2xl font-black text-health-600 dark:text-health-400">{ws.step}</span>
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-2 mb-1.5">{ws.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{ws.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Supported Body Parts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Supported Body Parts"
          title="Multi-Anatomical Visual Screening"
          subtitle="NutriVision AI is trained to observe characteristic deficiency manifestations across 6 distinct body parts."
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bodyParts.map((bp, idx) => (
            <Card key={idx} variant="default" className="p-6 hoverable group">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${bp.color} flex items-center justify-center text-health-700 dark:text-health-300 mb-4 group-hover:scale-105 transition-transform`}>
                {bp.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                {bp.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {bp.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="System Capabilities"
          title="Comprehensive Health & AI Features"
          subtitle="Everything you need for preliminary screening, tracking trends, and understanding nutrition."
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <Card key={idx} variant="default" className="p-5">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-health-50 dark:bg-health-950/60 border border-health-100 dark:border-health-800/80 flex-shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">{feat.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Ethical Safety & Non-Diagnostic Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-health-500/20 text-health-300 text-xs font-semibold uppercase tracking-wider border border-health-500/30">
              Our Safety Commitment
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ethical AI Designed to Support, Never Replace Healthcare Providers
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              NutriVision AI is built as a college educational prototype to demonstrate how computer vision can aid early health awareness. We strictly label all predictions as statistical Model Confidence and mandate medical disclaimers to ensure responsible usage.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link to="/disclaimer">
                <Button variant="primary" size="md">
                  Read Full Disclaimer
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="md" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                  About Our Architecture
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Ready to run your first preliminary check?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Create an account to upload photos, record your symptoms, and view personalized nutrition recommendations.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

function CalendarDaysIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
      <path d="M8 14h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 18h.01"/>
      <path d="M12 18h.01"/>
      <path d="M16 18h.01"/>
    </svg>
  );
}
