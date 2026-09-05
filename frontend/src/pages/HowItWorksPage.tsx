import React from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Sliders,
  CheckCircle2,
  Cpu,
  Utensils,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Layers,
  Database,
  Server,
  Monitor,
  Code2,
  Sparkles,
  Flame,
  Award
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: 'Step 1',
      title: 'Target Body Region Selection & Photo Capture',
      icon: <Upload className="w-6 h-6 text-health-600 dark:text-health-400" />,
      tag: 'Capture & Input',
      desc: 'Users select an anatomical target region (Nails, Eyes, Tongue, Lips, Skin, or Hair) and photograph the region via live camera or gallery upload.',
      telemetry: 'Multi-region support: NAILS, EYES, TONGUE, SKIN, LIPS, HAIR'
    },
    {
      num: 'Step 2',
      title: 'Computer Vision Image Quality Gate (OpenCV)',
      icon: <Sliders className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      tag: 'OpenCV Engine',
      desc: 'Before deep learning occurs, OpenCV calculates the Laplacian variance (sharpness) and mean luminance (illumination). Blurry (score < 50.0) or poorly lit images (brightness < 40 or > 220) are flagged or rejected with actionable feedback.',
      telemetry: 'Laplacian second derivative variance + Grayscale mean luminance'
    },
    {
      num: 'Step 3',
      title: 'AI Visual Pattern Classification (MobileNetV2 ONNX)',
      icon: <Cpu className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      tag: 'Deep Learning',
      desc: 'Images are preprocessed to 224x224 RGB tensors, normalized with standard ImageNet statistics, and passed through MobileNetV2 with inverted residual bottlenecks to produce raw output logits.',
      telemetry: 'ONNX Runtime CPU Inference • 8.49 MB Model • Fast execution'
    },
    {
      num: 'Step 4',
      title: 'Softmax Top-3 Probability Ranking',
      icon: <CheckCircle2 className="w-6 h-6 text-health-600 dark:text-health-400" />,
      tag: 'Mathematical Softmax',
      desc: 'Output logits are converted via Softmax into normalized probabilities summing to 1.0. The Top-3 ranked candidate classes are presented with discrete model classification probabilities and visual pattern descriptions.',
      telemetry: 'Softmax: P(y=c|x) = exp(z_c) / Σ exp(z_j) • Top-3 Candidates'
    },
    {
      num: 'Step 5',
      title: 'Nutrition Recommendation Engine & Absorption Synergy',
      icon: <Utensils className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      tag: 'Dietary Expert Engine',
      desc: 'The identified screening category queries a database of Indian and South Indian food items. Matches are filtered by diet preference (Vegetarian, Vegan, Non-Veg) and enriched with biochemical absorption synergy tips (e.g., Vitamin C with non-heme Iron).',
      telemetry: 'MySQL 33+ seeded foods • Priority ranks • Bio-synergy advice'
    }
  ];

  const techStack = [
    {
      layer: 'Frontend Client',
      tech: 'React 18 + TypeScript + Vite + Tailwind CSS',
      role: 'Responsive UI, interactive camera capture, real-time charts, i18n localization, and downloadable assessment reports.'
    },
    {
      layer: 'Backend Microservice',
      tech: 'Spring Boot 3 + Spring Security + Spring Data JPA',
      role: 'RESTful API gateway, JWT authentication, user ownership IDOR protection, image storage management, and database transactions.'
    },
    {
      layer: 'Relational Database',
      tech: 'MySQL 8 (InnoDB)',
      role: 'Structured persistence for users, assessments, uploaded photographs, quality telemetry, food items, and nutrition guidance matrices.'
    },
    {
      layer: 'AI Microservice',
      tech: 'Python FastAPI + Uvicorn',
      role: 'High-performance microservice executing computer vision quality evaluations and deep learning inference.'
    },
    {
      layer: 'Computer Vision',
      tech: 'OpenCV (Python)',
      role: 'Automated image quality gate evaluating frame blurriness (Laplacian variance) and illumination balance.'
    },
    {
      layer: 'Neural Network Architecture',
      tech: 'MobileNetV2 (Inverted Residual Blocks)',
      role: 'Lightweight, efficient convolutional neural network trained on multi-region prototype feature patterns.'
    },
    {
      layer: 'Model Runtime',
      tech: 'ONNX Runtime (CPU)',
      role: 'Cross-platform, deterministic model runtime ensuring rapid CPU inference latency without GPU dependencies.'
    }
  ];

  return (
    <div className="space-y-12 py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <PageHeader
        title="How NutriVision AI Works"
        subtitle="Complete technical breakdown of our 5-stage automated screening pipeline, system architecture, and technology stack."
        actions={
          <Link to="/demo">
            <Button variant="primary" size="md" leftIcon={<Flame className="w-4 h-4" />}>
              Launch Live Demo Mode 🎓
            </Button>
          </Link>
        }
      />

      <MedicalDisclaimer variant="banner" />

      {/* 5-Step Pipeline Flow */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-5 h-5 text-health-600" />
            <span>Complete 5-Stage Processing Flow</span>
          </h3>
          <span className="text-xs text-slate-400">End-to-End Pipeline</span>
        </div>

        <div className="space-y-4">
          {steps.map((s, idx) => (
            <Card key={idx} variant="default" className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex-shrink-0 w-fit">
                  {s.icon}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-health-600 dark:text-health-400">
                      {s.num} • {s.tag}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {s.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                  <div className="pt-1.5">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      ⚙️ {s.telemetry}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* System Architecture Section */}
      <Card variant="default" className="p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Server className="w-5 h-5 text-health-600" />
          <span>System Architecture & Communication Flow</span>
        </h3>

        <div className="p-6 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed space-y-2 border border-slate-800">
          <p className="text-health-400 font-bold">[React Frontend Client (Port 5173)]</p>
          <p className="pl-4 text-slate-400">│  ▲  HTTP REST / JSON (Axios)</p>
          <p className="pl-4 text-slate-400">▼  │  JWT Bearer Authentication & IDOR Protection</p>
          <p className="text-blue-400 font-bold">[Spring Boot Backend Gateway (Port 8080)]</p>
          <p className="pl-4 text-slate-400">├──► [MySQL 8 Relational Database (Port 3306)] (Users, Assessments, Images, Nutrition Guidance)</p>
          <p className="pl-4 text-slate-400">│</p>
          <p className="pl-4 text-slate-400">└──► [FastAPI AI Microservice (Port 8000)]</p>
          <p className="pl-8 text-emerald-400">├── OpenCV Image Quality Gate (Blur & Illumination Analysis)</p>
          <p className="pl-8 text-purple-400">└── MobileNetV2 ONNX Runtime (Tensor Normalization & Softmax Predictions)</p>
        </div>
      </Card>

      {/* Technology Stack Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Code2 className="w-5 h-5 text-health-600" />
          <span>Technology Stack</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techStack.map((item, idx) => (
            <Card key={idx} variant="default" className="p-5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-health-600 dark:text-health-400">
                {item.layer}
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {item.tech}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.role}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Important Scientific Limitation */}
      <Card variant="bordered" className="p-6 bg-amber-500/5 border-amber-400/40 dark:border-amber-600/30 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>Important Scientific & Clinical Limitation</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          The current MobileNetV2 neural network was trained on a <strong>synthesized prototype benchmark dataset</strong> parameterizing classical morphological features. The system is strictly an <strong>educational screening prototype and NOT a clinical diagnostic tool</strong>. Model confidence percentages reflect mathematical classification probabilities on the benchmark data and must never be interpreted as medical certainty.
        </p>
      </Card>

      {/* Future Scope */}
      <Card variant="default" className="p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-health-600" />
          <span>Future Scope & Roadmap</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <strong className="block text-slate-900 dark:text-slate-100 mb-1">1. Clinical Cohort Validation</strong>
            Multi-center ethical clinical trial validation across diverse patient skin tones and demographics.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <strong className="block text-slate-900 dark:text-slate-100 mb-1">2. Doctor Verification Loop</strong>
            Clinician dashboard allowing certified medical professionals to verify and calibrate AI screening recommendations.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <strong className="block text-slate-900 dark:text-slate-100 mb-1">3. Laboratory Biomarker Fusion</strong>
            Integration with standard blood serum lab tests (Serum Ferritin, B12, Serum 25-OH-D, Retinol).
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <strong className="block text-slate-900 dark:text-slate-100 mb-1">4. Multi-Modal Symptom Reasoning</strong>
            Joint visual and clinical symptom questionnaire reasoning using multi-modal transformer networks.
          </div>
        </div>
      </Card>

      {/* CTA Footer */}
      <div className="text-center pt-4">
        <Link to="/demo">
          <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Explore Demonstration Mode
          </Button>
        </Link>
      </div>
    </div>
  );
};
