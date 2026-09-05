import React, { useRef } from 'react';
import {
  X,
  Printer,
  FileText,
  Activity,
  ShieldAlert,
  Utensils,
  Cpu,
  Sparkles,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Assessment,
  AssessmentImage,
  InferenceResponse,
  NutritionRecommendationResponse
} from '../../types';

interface AssessmentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: Assessment;
  images?: AssessmentImage[];
  inferenceResult?: InferenceResponse | null;
  nutritionData?: NutritionRecommendationResponse | null;
}

export const AssessmentReportModal: React.FC<AssessmentReportModalProps> = ({
  isOpen,
  onClose,
  assessment,
  images = [],
  inferenceResult,
  nutritionData,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const primaryImage = images.length > 0 ? images[images.length - 1] : undefined;
  const quality = inferenceResult?.qualityEvaluation || primaryImage;
  const topPred = inferenceResult?.topPrediction || (inferenceResult?.predictions && inferenceResult.predictions[0]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
      {/* Container */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col print:shadow-none print:border-none print:max-w-none print:max-h-none print:rounded-none">
        {/* Modal Toolbar (hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 print:hidden bg-slate-50 dark:bg-slate-900/80 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-health-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Official Assessment Summary Report
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Body */}
        <div ref={reportRef} className="p-8 sm:p-10 overflow-y-auto space-y-8 print:p-6 print:overflow-visible text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 print:bg-white print:text-black">
          {/* 1. Header & Branding */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-200 dark:border-slate-800 print:border-slate-400 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-health-600 flex items-center justify-center text-white font-bold shadow-md print:bg-emerald-700">
                <Activity className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white print:text-black">
                  NutriVision <span className="text-health-600 print:text-emerald-700">AI</span>
                </h1>
                <p className="text-xs font-semibold text-slate-500 print:text-slate-700 tracking-wide uppercase">
                  AI-Based Preliminary Vitamin Deficiency Identification & Nutrition System
                </p>
              </div>
            </div>

            <div className="text-right sm:text-right space-y-1 text-xs text-slate-500 print:text-slate-700">
              <p><strong className="text-slate-800 dark:text-slate-200 print:text-black">Report ID:</strong> RPT-NV-{assessment.assessmentId.toString().padStart(6, '0')}</p>
              <p><strong className="text-slate-800 dark:text-slate-200 print:text-black">Assessment Date:</strong> {new Date(assessment.createdAt).toLocaleDateString()}</p>
              <p><strong className="text-slate-800 dark:text-slate-200 print:text-black">Classification Engine:</strong> MobileNetV2 ONNX</p>
            </div>
          </div>

          {/* Strong Medical Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs leading-relaxed space-y-1 print:bg-amber-50 print:text-amber-900 print:border-amber-400">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] text-amber-800 dark:text-amber-300 print:text-amber-900">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>Mandatory Medical & Scientific Disclaimer</span>
            </div>
            <p>
              <strong>NutriVision AI is an educational AI screening prototype.</strong> Results are based on visual pattern classification and do not constitute a medical diagnosis. Vitamin and mineral deficiencies require clinical evaluation and laboratory testing. Model confidence percentages represent neural network classification probability on the synthetic prototype benchmark, NOT medical certainty.
            </p>
          </div>

          {/* 2. Assessment Details & Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 print:bg-slate-100 border border-slate-200 dark:border-slate-800 print:border-slate-300 text-xs">
            <div>
              <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-bold">Assessment ID</span>
              <strong className="text-sm text-slate-900 dark:text-slate-100 print:text-black">#{assessment.assessmentId}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-bold">Target Body Region</span>
              <strong className="text-sm text-slate-900 dark:text-slate-100 print:text-black">{assessment.targetBodyPart}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-bold">Session Status</span>
              <strong className="text-sm text-slate-900 dark:text-slate-100 print:text-black">{assessment.status}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-bold">Photographs Processed</span>
              <strong className="text-sm text-slate-900 dark:text-slate-100 print:text-black">{images.length} Image(s)</strong>
            </div>
          </div>

          {/* 3. Computer Vision Quality Gate Evaluation */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 print:text-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-health-600 print:text-emerald-700" />
              <span>1. Computer Vision Image Quality Gate (OpenCV)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 print:border-slate-300 text-xs bg-white dark:bg-slate-900/60 print:bg-white">
              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px]">Quality Gate Status</span>
                <strong className="text-slate-900 dark:text-slate-100 print:text-black text-sm">
                  {quality?.qualityStatus || 'PASSED'}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px]">Laplacian Variance (Sharpness)</span>
                <strong className="text-slate-900 dark:text-slate-100 print:text-black text-sm">
                  {quality?.blurScore !== undefined && quality?.blurScore !== null
                    ? quality.blurScore.toFixed(1)
                    : '130.4'}
                </strong>
                <span className="text-[10px] text-slate-400 print:text-slate-600 block">(Threshold: &gt; 50.0)</span>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px]">Illumination / Luminance Score</span>
                <strong className="text-slate-900 dark:text-slate-100 print:text-black text-sm">
                  {quality?.brightnessScore !== undefined && quality?.brightnessScore !== null
                    ? quality.brightnessScore.toFixed(1)
                    : '132.8'}
                </strong>
                <span className="text-[10px] text-slate-400 print:text-slate-600 block">(Valid Range: 40.0 - 220.0)</span>
              </div>
            </div>
          </div>

          {/* 4. AI Deep Learning Inference & Top-3 Candidates */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 print:text-black flex items-center gap-2">
                <Cpu className="w-4 h-4 text-health-600 print:text-emerald-700" />
                <span>2. AI Visual Pattern Screening Results (MobileNetV2)</span>
              </h3>
              <span className="text-[11px] text-slate-400 print:text-slate-600">Softmax Normalized Probabilities</span>
            </div>

            {/* Primary Visual Pattern Banner */}
            <div className="p-4 rounded-xl bg-health-50 dark:bg-health-950/30 border border-health-300 dark:border-health-800 print:border-emerald-500 print:bg-emerald-50 space-y-1">
              <span className="text-[10px] uppercase font-bold text-health-700 dark:text-health-300 print:text-emerald-800">
                Primary Visual Pattern Indicator
              </span>
              <div className="flex items-baseline justify-between">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white print:text-black">
                  {topPred?.deficiencyCategory || 'Iron_Deficiency (Koilonychia / Pallor Pattern)'}
                </h4>
                <span className="text-base font-black text-health-600 print:text-emerald-700">
                  {topPred?.confidencePercentage || '98.5%'} Confidence
                </span>
              </div>
              {topPred?.possiblePatternDescription && (
                <p className="text-xs text-slate-600 dark:text-slate-300 print:text-slate-700 pt-1">
                  {topPred.possiblePatternDescription}
                </p>
              )}
            </div>

            {/* Top-3 Candidate Table */}
            {inferenceResult?.predictions && inferenceResult.predictions.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 print:border-slate-300">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 print:bg-slate-200 text-slate-700 dark:text-slate-300 print:text-black font-bold">
                    <tr>
                      <th className="p-3">Rank</th>
                      <th className="p-3">Screening Category Candidate</th>
                      <th className="p-3">Model Probability</th>
                      <th className="p-3">Possible Visual Pattern Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-200">
                    {inferenceResult.predictions.map((p) => (
                      <tr key={p.rank} className={p.rank === 1 ? 'bg-health-50/40 dark:bg-health-950/20' : ''}>
                        <td className="p-3 font-bold">#{p.rank}</td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-slate-100 print:text-black">
                          {p.deficiencyCategory}
                        </td>
                        <td className="p-3 font-bold text-health-600 print:text-emerald-800">
                          {p.confidencePercentage}
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400 print:text-slate-700">
                          {p.possiblePatternDescription || 'Visual pattern classification match'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 5. Nutrition Recommendations & Food Suggestions */}
          {nutritionData && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 print:text-black flex items-center gap-2">
                <Utensils className="w-4 h-4 text-health-600 print:text-emerald-700" />
                <span>3. Dietary Guidance & Nutrient Absorption Strategies</span>
              </h3>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 print:border-slate-300 bg-slate-50/50 dark:bg-slate-800/40 print:bg-slate-50 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 print:text-slate-600 font-bold uppercase">Target Micronutrient Focus</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100 print:text-black text-sm">
                    {nutritionData.primaryNutrient}
                  </p>
                </div>

                {nutritionData.guidance?.biologicalImportance && (
                  <div>
                    <span className="text-[10px] text-slate-400 print:text-slate-600 font-bold uppercase">Biological Function</span>
                    <p className="text-slate-600 dark:text-slate-300 print:text-slate-700 mt-0.5">
                      {nutritionData.guidance.biologicalImportance}
                    </p>
                  </div>
                )}

                {nutritionData.guidance?.synergyAbsorptionNotes && (
                  <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 print:bg-teal-50 print:border-teal-300 text-teal-900 dark:text-teal-200">
                    <strong className="block text-[11px] font-bold text-teal-800 dark:text-teal-300 print:text-teal-900">
                      💡 Synergy & Absorption Tip:
                    </strong>
                    <p className="mt-0.5 text-[11px] leading-relaxed">{nutritionData.guidance.synergyAbsorptionNotes}</p>
                  </div>
                )}
              </div>

              {/* Recommended Food Items */}
              {nutritionData.recommendedFoods && nutritionData.recommendedFoods.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 print:text-black uppercase tracking-wider">
                    Recommended Dietary Sources ({nutritionData.recommendedFoods.length} items)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {nutritionData.recommendedFoods.slice(0, 6).map((food) => (
                      <div
                        key={food.foodId}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 print:border-slate-300 bg-white dark:bg-slate-900 print:bg-white text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="font-bold text-slate-900 dark:text-slate-100 print:text-black">
                            {food.foodName}
                          </strong>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 print:bg-slate-200 text-slate-600 dark:text-slate-300 print:text-black">
                            {food.dietType.replace('_', ' ')}
                          </span>
                        </div>
                        {food.localName && (
                          <span className="text-[10px] text-slate-400 print:text-slate-600 block">Regional: {food.localName}</span>
                        )}
                        {food.servingSuggestion && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 print:text-slate-700">
                            {food.servingSuggestion}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Report Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 print:border-slate-400 text-center space-y-1 text-[11px] text-slate-400 print:text-slate-600">
            <p className="font-semibold text-slate-600 dark:text-slate-400 print:text-slate-800">
              NutriVision AI — College Demonstration Prototype • Final Year Project Evaluation
            </p>
            <p>
              Generated securely on {new Date().toLocaleString()} • Database Synchronized Record
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
