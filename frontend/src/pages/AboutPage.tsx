import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  BookOpen,
  Cpu,
  Heart,
  Layers,
  Lock,
  Sparkles,
  Award,
  AlertTriangle,
  ArrowRight,
  Database,
  Globe,
  FileCheck2,
  Flame
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <PageHeader
        title="About NutriVision AI"
        subtitle="An educational AI research prototype exploring non-invasive visual screening and dietary guidance."
        actions={
          <Link to="/demo">
            <Button variant="primary" size="md" leftIcon={<Flame className="w-4 h-4" />}>
              Live Demo Mode 🎓
            </Button>
          </Link>
        }
      />

      <MedicalDisclaimer variant="card" />

      {/* 1. Problem Statement */}
      <Card variant="default" className="p-8 space-y-4">
        <div className="flex items-center gap-2 text-health-600 dark:text-health-400 font-bold text-xs uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>1. Problem Statement</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          The Hidden Hunger Challenge: Micronutrient Malnutrition
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Micronutrient malnutrition—often called <strong>"hidden hunger"</strong>—affects over 2 billion people globally. Deficiencies in essential vitamins and minerals (such as Iron, Vitamin A, Vitamin B12, Vitamin C, Vitamin D, and Zinc) often develop gradually, showing subtle external signs on the nails, eyes, tongue, lips, skin, and hair long before severe clinical symptoms arise.
        </p>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          However, traditional clinical blood testing is expensive, invasive, and inaccessible in underserved or rural communities. NutriVision AI explores how accessible digital computer vision and deep learning can provide preliminary visual pattern awareness to guide timely nutritional intervention.
        </p>
      </Card>

      {/* 2. Project Objective */}
      <Card variant="default" className="p-8 space-y-4">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>2. Project Objective</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Full-Stack AI Screening & Nutrition Decision Prototype
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          The primary engineering objective of NutriVision AI is to architect and deliver an <strong>honest, end-to-end multi-tier system</strong> combining:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <strong className="block text-slate-900 dark:text-slate-100 mb-1">📷 Automated Quality Gate</strong>
            OpenCV image sharpness and illumination validation to prevent garbage-in garbage-out model failures.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <strong className="block text-slate-900 dark:text-slate-100 mb-1">🧠 Edge-Optimized Neural Network</strong>
            MobileNetV2 ONNX Runtime inference delivering Top-3 classification probabilities without cloud lock-in.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <strong className="block text-slate-900 dark:text-slate-100 mb-1">🥗 Localized Nutrition Engine</strong>
            MySQL relational nutrition database delivering diet-filtered (Veg, Vegan, Non-Veg) and bio-synergy food recommendations.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <strong className="block text-slate-900 dark:text-slate-100 mb-1">🔒 Enterprise Security</strong>
            Spring Boot 3 REST gateway with JWT, BCrypt encryption, and strict User Ownership IDOR protection.
          </div>
        </div>
      </Card>

      {/* 3. Engineering Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="default" className="p-6">
          <div className="w-10 h-10 rounded-xl bg-health-50 dark:bg-health-950/70 border border-health-200 dark:border-health-800 text-health-600 dark:text-health-400 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
            Microservice Decoupling
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Spring Boot handles business rules and security, while Python FastAPI executes compute-heavy OpenCV quality checks and ONNX neural network inference.
          </p>
        </Card>

        <Card variant="default" className="p-6">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
            Ethical Non-Diagnostic AI
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All predictions are transparently presented as mathematical Model Classification Probabilities on prototype benchmark data, never medical certainty.
          </p>
        </Card>

        <Card variant="default" className="p-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
            100% Free & Open-Source
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Built using zero paid APIs. Runs locally on open source tools (OpenCV, PyTorch, ONNX, Spring Boot, MySQL, React).
          </p>
        </Card>
      </div>

      {/* 4. Scientific Limitation */}
      <Card variant="bordered" className="p-6 bg-amber-500/5 border-amber-400/40 dark:border-amber-600/30 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>Scientific & Dataset Transparency</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          The current MobileNetV2 model was trained on a synthesized prototype benchmark dataset designed to model classical textbook physical manifestations. It has not undergone formal clinical trials on real hospital patient cohorts. Users must never substitute NutriVision AI screening for professional medical advice or laboratory blood tests.
        </p>
      </Card>
    </div>
  );
};
