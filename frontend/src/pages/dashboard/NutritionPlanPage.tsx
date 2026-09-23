import React, { useState } from 'react';
import { CalendarDays, Utensils, CheckCircle2, Download, Leaf, Apple, ShieldAlert, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import {
  MEDICAL_KNOWLEDGE_CATALOG,
  NutrientProfile,
} from '../../services/medicalKnowledge';
import { showToast } from '../../services/toastStore';

export const NutritionPlanPage: React.FC = () => {
  const [selectedNutrientKey, setSelectedNutrientKey] = useState<string>('Vitamin_B12_Deficiency');
  const [dietPreference, setDietPreference] = useState<'VEGETARIAN' | 'VEGAN' | 'NON_VEGETARIAN'>('VEGETARIAN');

  const profile: NutrientProfile = MEDICAL_KNOWLEDGE_CATALOG[selectedNutrientKey] || MEDICAL_KNOWLEDGE_CATALOG.Vitamin_B12_Deficiency;

  const nutrientOptions = [
    { key: 'Vitamin_B12_Deficiency', label: 'Vitamin B12' },
    { key: 'Iron_Deficiency', label: 'Iron' },
    { key: 'Vitamin_C_Deficiency', label: 'Vitamin C' },
    { key: 'Vitamin_A_Deficiency', label: 'Vitamin A' },
    { key: 'Zinc_Deficiency', label: 'Zinc' },
    { key: 'Healthy_Normal', label: 'Healthy Baseline' },
  ];

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="7-Day Nutritional Food Plan"
          subtitle={`A balanced outline of culturally familiar Indian foods tailored to support ${profile.plainName} optimization.`}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPdf}
          leftIcon={<Download className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Print / Save PDF
        </Button>
      </div>

      <MedicalDisclaimer variant="compact" />

      {/* Selector Controls */}
      <Card variant="default" className="p-6 space-y-4">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Select Nutrient Focus:
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {nutrientOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSelectedNutrientKey(opt.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedNutrientKey === opt.key
                    ? 'bg-health-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-slate-500 font-medium">Dietary Preference:</span>
          <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['VEGETARIAN', 'VEGAN', 'NON_VEGETARIAN'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDietPreference(d)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  dietPreference === d
                    ? 'bg-white dark:bg-slate-900 text-health-700 dark:text-health-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {d === 'VEGETARIAN' ? 'Vegetarian' : d === 'VEGAN' ? 'Strict Vegan' : 'Non-Vegetarian'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Nutrient Focus Card */}
      <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-teal-900 dark:text-teal-200 space-y-1">
          <strong className="font-bold block text-sm">
            Focus: {profile.nutrientName}
          </strong>
          <p className="leading-relaxed">
            {profile.summarySentence} These realistic meals emphasize natural culinary sources like fresh dahi, paneer, amla, leafy greens, legumes, and eggs.
          </p>
        </div>
      </div>

      {/* 7-Day Schedule Cards */}
      <div className="space-y-4">
        {profile.sevenDayPlan.map((item, idx) => (
          <Card key={idx} variant="default" className="p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <h4 className="font-bold text-sm text-health-700 dark:text-health-300 flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                {item.day}
              </h4>
              <Badge variant="health" size="sm">
                {profile.plainName} Focus
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="font-bold text-slate-400 block text-[11px] uppercase tracking-wide">
                  Breakfast
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {item.breakfast}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="font-bold text-slate-400 block text-[11px] uppercase tracking-wide">
                  Lunch
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {item.lunch}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="font-bold text-slate-400 block text-[11px] uppercase tracking-wide">
                  Evening Snack
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {item.snack}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="font-bold text-slate-400 block text-[11px] uppercase tracking-wide">
                  Dinner
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {item.dinner}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
        * Food suggestions support a well-rounded diet and are not a substitute for professional medical nutrition therapy. If you suspect a clinical deficiency, consult a registered dietitian or general physician.
      </div>
    </div>
  );
};
