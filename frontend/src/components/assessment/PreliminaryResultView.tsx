import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Utensils,
  MapPin,
  MessageSquare,
  Download,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  Stethoscope,
  HeartPulse,
  Leaf,
  Apple,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  getNutrientProfile,
  formatHumanConfidence,
  NutrientProfile,
} from '../../services/medicalKnowledge';
import { InferenceResponse, Assessment, AssessmentImage } from '../../types';

interface PreliminaryResultViewProps {
  screeningResult: InferenceResponse | null;
  assessment: Assessment | null;
  uploadedImage: AssessmentImage | null;
  selectedBodyPart?: string | null;
  selectedSymptoms?: string[];
}

export const PreliminaryResultView: React.FC<PreliminaryResultViewProps> = ({
  screeningResult,
  assessment,
  uploadedImage,
  selectedBodyPart,
  selectedSymptoms = [],
}) => {
  // Determine top prediction
  const topPrediction = screeningResult?.predictions?.[0];
  const categoryCode = topPrediction?.categoryCode || '';
  const confidenceScore = topPrediction?.modelConfidence ?? 0;

  const profile: NutrientProfile = getNutrientProfile(categoryCode);
  const confidenceMeta = formatHumanConfidence(confidenceScore);

  // Personalization state
  const [dietFilter, setDietFilter] = useState<'ALL' | 'VEGETARIAN' | 'VEGAN' | 'NON_VEGETARIAN'>('ALL');
  const [ageGroup, setAgeGroup] = useState<'ADULT' | 'OLDER_ADULT' | 'TEEN' | 'CHILD'>('ADULT');
  const [show7DayPlan, setShow7DayPlan] = useState<boolean>(false);

  // Filter foods by diet preference
  const getDisplayFoods = () => {
    if (dietFilter === 'VEGETARIAN') return profile.foods.vegetarian;
    if (dietFilter === 'VEGAN') return profile.foods.vegan;
    if (dietFilter === 'NON_VEGETARIAN') return profile.foods.nonVegetarian;
    return [
      ...profile.foods.vegetarian,
      ...profile.foods.vegan.filter((v) => !profile.foods.vegetarian.includes(v)),
      ...profile.foods.nonVegetarian,
    ];
  };

  if (screeningResult?.status !== 'SUCCESS' || !topPrediction) {
    return <Card className="p-6 sm:p-8 space-y-5 max-w-3xl mx-auto">
      <AlertCircle className="w-9 h-9 text-amber-600" />
      <h2 className="text-2xl font-bold">No reliable photo result available</h2>
      <p className="text-slate-600 dark:text-slate-300">{screeningResult?.message || 'The analysis did not return a result. Please try again later.'}</p>
      <p className="text-sm">A photo quality check only measures lighting and sharpness. It does not confirm the body area or a deficiency. No confidence score or risk level has been assigned.</p>
      {selectedSymptoms.length > 0 && <div><h3 className="font-semibold">Symptoms you selected</h3><ul className="list-disc pl-5">{selectedSymptoms.map(s => <li key={s}>{s}</li>)}</ul><p className="text-sm mt-2">These are self-reported symptoms, not findings from your photo.</p></div>}
      <div className="flex flex-wrap gap-3">
        <Link to="/recommendations"><Button>Explore food guidance</Button></Link>
        <Link to="/doctors"><Button variant="secondary">Find a clinician</Button></Link>
        <Link to="/history"><Button variant="secondary">View saved record</Button></Link>
      </div>
      <p className="text-xs text-slate-500">Educational information only. Persistent symptoms need professional evaluation.</p>
    </Card>;
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* 1. TOP RESULT CARD — Understandable within 5 seconds */}
      <Card
        variant="default"
        className="p-6 sm:p-8 border-2 border-health-500/30 bg-gradient-to-br from-white via-health-50/20 to-teal-50/30 dark:from-slate-900 dark:via-health-950/20 dark:to-slate-900 shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold text-health-700 dark:text-health-400 uppercase tracking-wider block">
              Preliminary Screening Assessment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              Your Preliminary Result
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={confidenceMeta.badgeVariant} size="md" className="font-semibold text-xs sm:text-sm">
              {confidenceMeta.label}
            </Badge>
          </div>
        </div>

        {/* Primary Nutritional Association */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Possible Nutritional Association:
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-health-700 dark:text-health-300">
                {profile.plainName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Scientific Term: {profile.nutrientName}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                What the Image May Show:
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {profile.whatImageMayShow}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Simple Explanation:
              </span>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                "{profile.plainExplanation}"
              </p>
            </div>
          </div>

          {/* Clean Visual Preview */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Target Area Analyzed
            </span>
            <div className="w-14 h-14 rounded-2xl bg-health-100 dark:bg-health-950 flex items-center justify-center text-health-700 dark:text-health-300">
              <HeartPulse className="w-7 h-7" />
            </div>
            <strong className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {selectedBodyPart || profile.primaryBodyPart}
            </strong>
            <span className="text-[11px] text-slate-500">
              Quality verified (Sharpness & Lighting clear)
            </span>
          </div>
        </div>

        {/* Strict Medical Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong className="font-bold block mb-0.5">IMPORTANT SAFETY NOTICE:</strong>
            {profile.importantNotice} Vitamin Deficiency provides preliminary AI-based educational indications only. It cannot confirm a diagnosis or replace a clinical blood test.
          </div>
        </div>
      </Card>

      {/* 2. IMMEDIATE FOOD & NUTRITION GUIDANCE (No navigation required!) */}
      <Card variant="default" className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-health-600" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                What You Can Do Now: Food Guidance
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Nutrient-dense culinary food ideas mapped to {profile.plainName}.
            </p>
          </div>

          {/* Diet Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['ALL', 'VEGETARIAN', 'VEGAN', 'NON_VEGETARIAN'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDietFilter(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  dietFilter === d
                    ? 'bg-white dark:bg-slate-900 text-health-700 dark:text-health-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {d === 'ALL'
                  ? 'All Foods'
                  : d === 'VEGETARIAN'
                  ? 'Vegetarian'
                  : d === 'VEGAN'
                  ? 'Vegan'
                  : 'Non-Veg'}
              </button>
            ))}
          </div>
        </div>

        {/* Personalized Age Selector (Section 10) */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-slate-500 font-medium">Personalize for age group:</span>
          {(['CHILD', 'TEEN', 'ADULT', 'OLDER_ADULT'] as const).map((ag) => (
            <button
              key={ag}
              onClick={() => setAgeGroup(ag)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                ageGroup === ag
                  ? 'bg-health-50 dark:bg-health-950/60 border-health-500 text-health-700 dark:text-health-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {ag === 'CHILD'
                ? 'Child (Under 12)'
                : ag === 'TEEN'
                ? 'Teenager'
                : ag === 'ADULT'
                ? 'Adult'
                : 'Older Adult (60+)'}
            </button>
          ))}
        </div>

        {/* Food Sources Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Foods to Consider Incorporating in Daily Meals:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getDisplayFoods().map((food, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{food}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Simple Daily Meal Ideas (Section 9) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Simple Daily Food Ideas (Realistic Indian Meals):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {profile.dailyIdeas.map((idea, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 space-y-1.5"
              >
                <span className="font-bold text-teal-800 dark:text-teal-300 block text-xs">
                  {idea.meal}
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {idea.suggestion}
                </p>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 block font-medium">
                  • Focus: {idea.focus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Nutrition Plan Toggle (Section 11) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            size="md"
            onClick={() => setShow7DayPlan(!show7DayPlan)}
            leftIcon={<Calendar className="w-4 h-4 text-health-600" />}
            className="w-full sm:w-auto"
          >
            {show7DayPlan ? 'Hide 7-Day Food Schedule' : 'View Complete 7-Day Meal Schedule'}
          </Button>

          {show7DayPlan && (
            <div className="mt-4 space-y-3 animate-fadeIn">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                These suggestions support a balanced diet and are not a substitute for clinical medical treatment.
              </div>
              <div className="space-y-2.5">
                {profile.sevenDayPlan.map((d, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2"
                  >
                    <strong className="text-health-700 dark:text-health-300 font-bold block text-sm">
                      {d.day}
                    </strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-slate-600 dark:text-slate-300">
                      <p><strong>Breakfast:</strong> {d.breakfast}</p>
                      <p><strong>Lunch:</strong> {d.lunch}</p>
                      <p><strong>Snack:</strong> {d.snack}</p>
                      <p><strong>Dinner:</strong> {d.dinner}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 3. COMMON SIGNS THAT MAY OCCUR — Plain English Symptom Engine (Section 8) */}
      <Card variant="default" className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-health-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Common Signs Explained in Everyday Words
          </h3>
        </div>

        <div className="space-y-4">
          {profile.symptoms.map((sym, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {sym.plainEnglishName}
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  Medical Term: {sym.medicalTerm}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>What it means:</strong> {sym.whatItMeans}
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Why it may matter:</strong> {sym.whyItMayMatter}
              </p>
              <p className="text-health-700 dark:text-health-400 font-medium">
                <strong>When to see a doctor:</strong> {sym.whenToSeeDoctor}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* 4. ACTIONS & REFERRALS — Clear Next Steps */}
      <Card
        variant="default"
        className="p-6 sm:p-8 bg-slate-900 text-white dark:bg-slate-900 border border-slate-800 space-y-6"
      >
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">
            Recommended Next Steps
          </h3>
          <p className="text-xs text-slate-400">
            Take action based on your preliminary evaluation:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/doctors" className="flex-1">
            <Button
              variant="primary"
              size="md"
              className="w-full text-xs justify-center"
              leftIcon={<MapPin className="w-4 h-4" />}
            >
              Find Doctors in Bengaluru
            </Button>
          </Link>

          <Link to="/chatbot" className="flex-1">
            <Button
              variant="outline"
              size="md"
              className="w-full text-xs justify-center text-white border-slate-700 hover:bg-slate-800"
              leftIcon={<MessageSquare className="w-4 h-4" />}
            >
              Ask AI Assistant
            </Button>
          </Link>

          <Link to="/reports" className="flex-1">
            <Button
              variant="outline"
              size="md"
              className="w-full text-xs justify-center text-white border-slate-700 hover:bg-slate-800"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download PDF Report
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
