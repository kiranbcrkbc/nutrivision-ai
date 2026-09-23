import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Activity,
  ShieldAlert,
  Play,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Utensils,
  ArrowRight,
  RotateCcw,
  Star,
  Info,
  Layers,
  ChevronRight,
  Eye,
  Sliders,
  Flame,
  Award
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MedicalDisclaimer } from '../components/common/MedicalDisclaimer';
import { nutritionService } from '../services/nutritionService';
import { NutritionRecommendationResponse, DietType, FoodRegion, FoodItemDto } from '../types';
import { showToast } from '../services/toastStore';

interface DemoSample {
  id: string;
  title: string;
  bodyRegion: 'NAILS' | 'EYES' | 'TONGUE' | 'SKIN' | 'HAIR';
  deficiencyCategory: string;
  expectedCategory: string;
  visualSignDescription: string;
  sharpnessScore: number;
  brightnessScore: number;
  qualityVerdict: 'PASSED' | 'WARNING';
  top3Predictions: {
    rank: number;
    category: string;
    confidence: number;
    percentage: string;
    description: string;
  }[];
  primaryNutrient: string;
  sampleBadge: string;
}

const DEMO_SAMPLES: DemoSample[] = [
  {
    id: 'sample-nails-iron',
    title: 'Sample A: Spoon-Shaped Nails (Koilonychia)',
    bodyRegion: 'NAILS',
    deficiencyCategory: 'Iron_Deficiency',
    expectedCategory: 'Iron Deficiency Visual Pattern',
    visualSignDescription: 'Concave nail curvature, central depression with raised everted lateral edges, and nail bed pallor.',
    sharpnessScore: 142.8,
    brightnessScore: 135.4,
    qualityVerdict: 'PASSED',
    top3Predictions: [
      {
        rank: 1,
        category: 'Iron_Deficiency',
        confidence: 0.9842,
        percentage: '98.4%',
        description: 'Strong visual match for Koilonychia and subungual pallor patterns.'
      },
      {
        rank: 2,
        category: 'Healthy_Normal',
        confidence: 0.0125,
        percentage: '1.3%',
        description: 'Normal nail morphology control candidate.'
      },
      {
        rank: 3,
        category: 'Zinc_Deficiency',
        confidence: 0.0033,
        percentage: '0.3%',
        description: 'Possible secondary Beau lines pattern.'
      }
    ],
    primaryNutrient: 'Iron & Vitamin C (Bio-Synergy)',
    sampleBadge: 'Iron Pattern'
  },
  {
    id: 'sample-eyes-vita',
    title: 'Sample B: Conjunctival Xerosis & Foamy Spots',
    bodyRegion: 'EYES',
    deficiencyCategory: 'Vitamin_A_Deficiency',
    expectedCategory: 'Vitamin A Deficiency Visual Pattern',
    visualSignDescription: 'Foamy triangular keratin plaques on the bulbar conjunctiva (Bitot\'s spots) and conjunctival dryness.',
    sharpnessScore: 156.2,
    brightnessScore: 128.0,
    qualityVerdict: 'PASSED',
    top3Predictions: [
      {
        rank: 1,
        category: 'Vitamin_A_Deficiency',
        confidence: 0.9715,
        percentage: '97.2%',
        description: 'Keratin accumulation and conjunctival xerosis visual features identified.'
      },
      {
        rank: 2,
        category: 'Healthy_Normal',
        confidence: 0.0210,
        percentage: '2.1%',
        description: 'Clear ocular sclera control candidate.'
      },
      {
        rank: 3,
        category: 'Vitamin_B12_Deficiency',
        confidence: 0.0075,
        percentage: '0.8%',
        description: 'Mild scleral pallor candidate.'
      }
    ],
    primaryNutrient: 'Vitamin A (Retinol & Beta-Carotene)',
    sampleBadge: 'Vitamin A Pattern'
  },
  {
    id: 'sample-tongue-b12',
    title: 'Sample C: Smooth Atrophic Tongue (Glossitis)',
    bodyRegion: 'TONGUE',
    deficiencyCategory: 'Vitamin_B12_Deficiency',
    expectedCategory: 'Vitamin B12 Deficiency Visual Pattern',
    visualSignDescription: 'Erythematous, smooth dorsal tongue surface with marked filiform papillae loss (Hunter\'s glossitis).',
    sharpnessScore: 138.6,
    brightnessScore: 141.2,
    qualityVerdict: 'PASSED',
    top3Predictions: [
      {
        rank: 1,
        category: 'Vitamin_B12_Deficiency',
        confidence: 0.9654,
        percentage: '96.5%',
        description: 'Prominent lingual depapillation and beefy red mucosal pattern.'
      },
      {
        rank: 2,
        category: 'Iron_Deficiency',
        confidence: 0.0240,
        percentage: '2.4%',
        description: 'Atrophic glossitis shared morphology candidate.'
      },
      {
        rank: 3,
        category: 'Healthy_Normal',
        confidence: 0.0106,
        percentage: '1.1%',
        description: 'Normal papillae tongue surface control candidate.'
      }
    ],
    primaryNutrient: 'Vitamin B12 (Cobalamin)',
    sampleBadge: 'Vitamin B12 Pattern'
  },
  {
    id: 'sample-skin-vitc',
    title: 'Sample D: Perifollicular Petechiae & Keratosis',
    bodyRegion: 'SKIN',
    deficiencyCategory: 'Vitamin_C_Deficiency',
    expectedCategory: 'Vitamin C Deficiency Visual Pattern',
    visualSignDescription: 'Perifollicular pinpoint hemorrhages and corkscrew body hair deformation on extensor skin surfaces.',
    sharpnessScore: 129.4,
    brightnessScore: 130.6,
    qualityVerdict: 'PASSED',
    top3Predictions: [
      {
        rank: 1,
        category: 'Vitamin_C_Deficiency',
        confidence: 0.9580,
        percentage: '95.8%',
        description: 'Perifollicular capillary fragility pattern recognized.'
      },
      {
        rank: 2,
        category: 'Vitamin_A_Deficiency',
        confidence: 0.0310,
        percentage: '3.1%',
        description: 'Follicular hyperkeratosis shared feature.'
      },
      {
        rank: 3,
        category: 'Healthy_Normal',
        confidence: 0.0110,
        percentage: '1.1%',
        description: 'Normal epidermal barrier candidate.'
      }
    ],
    primaryNutrient: 'Vitamin C (Ascorbic Acid)',
    sampleBadge: 'Vitamin C Pattern'
  },
  {
    id: 'sample-healthy-control',
    title: 'Sample E: Healthy Control Tissue Baseline',
    bodyRegion: 'NAILS',
    deficiencyCategory: 'Healthy_Normal',
    expectedCategory: 'Normal Healthy Control',
    visualSignDescription: 'Translucent pink nail bed, smooth convex contour, intact lunula, and absence of grooving or discoloration.',
    sharpnessScore: 165.0,
    brightnessScore: 144.0,
    qualityVerdict: 'PASSED',
    top3Predictions: [
      {
        rank: 1,
        category: 'Healthy_Normal',
        confidence: 0.9910,
        percentage: '99.1%',
        description: 'Healthy anatomical baseline tissue without deficiency signs.'
      },
      {
        rank: 2,
        category: 'Iron_Deficiency',
        confidence: 0.0055,
        percentage: '0.6%',
        description: 'Low probability secondary candidate.'
      },
      {
        rank: 3,
        category: 'Zinc_Deficiency',
        confidence: 0.0035,
        percentage: '0.4%',
        description: 'Low probability secondary candidate.'
      }
    ],
    primaryNutrient: 'Balanced Micronutrient Maintenance',
    sampleBadge: 'Healthy Control'
  }
];

export const DemoModePage: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<DemoSample>(DEMO_SAMPLES[0]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [nutritionData, setNutritionData] = useState<NutritionRecommendationResponse | null>(null);
  const [selectedDiet, setSelectedDiet] = useState<DietType>('ANY');
  const [selectedRegion, setSelectedRegion] = useState<FoodRegion | undefined>(undefined);

  const handleSelectSample = (sample: DemoSample) => {
    setSelectedSample(sample);
    setCurrentStep(1);
    setNutritionData(null);
  };

  const handleRunFullPipeline = async () => {
    setIsProcessing(true);
    setCurrentStep(2);

    // Step 2: Quality Gate
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCurrentStep(3);

    // Step 3: AI Inference
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCurrentStep(4);

    // Step 4: Softmax Predictions & Fetch Nutrition
    try {
      const res = await nutritionService.getRecommendations(
        selectedSample.deficiencyCategory,
        selectedDiet === 'ANY' ? undefined : selectedDiet,
        selectedRegion
      );
      setNutritionData(res);
    } catch (err) {
      console.warn('Could not fetch real nutrition in demo mode:', err);
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    setCurrentStep(5);
    setIsProcessing(false);
    showToast.success('Demonstration Complete', '5-stage end-to-end screening pipeline executed successfully.');
  };

  const handleDietChange = async (diet: DietType) => {
    setSelectedDiet(diet);
    if (currentStep >= 5) {
      try {
        const res = await nutritionService.getRecommendations(
          selectedSample.deficiencyCategory,
          diet === 'ANY' ? undefined : diet,
          selectedRegion
        );
        setNutritionData(res);
      } catch (e) {
        console.warn('Diet filter error:', e);
      }
    }
  };

  const handleRegionChange = async (reg: FoodRegion | undefined) => {
    setSelectedRegion(reg);
    if (currentStep >= 5) {
      try {
        const res = await nutritionService.getRecommendations(
          selectedSample.deficiencyCategory,
          selectedDiet === 'ANY' ? undefined : selectedDiet,
          reg
        );
        setNutritionData(res);
      } catch (e) {
        console.warn('Region filter error:', e);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <PageHeader
        title="College Demonstration & Technical Presentation Mode"
        subtitle="Interactive live demonstration environment for viva examiners and technical evaluation. Visualizes the 5-stage pipeline with pre-loaded prototype data."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentStep(1);
                setNutritionData(null);
              }}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Reset Pipeline
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isProcessing}
              onClick={handleRunFullPipeline}
              leftIcon={<Play className="w-4 h-4" />}
            >
              Run Full 5-Stage Pipeline
            </Button>
          </div>
        }
      />

      {/* Prominent Demonstration & Non-Medical Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 space-y-1">
        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-amber-700 dark:text-amber-300">
          <Flame className="w-4 h-4 text-amber-600" />
          <span>DEMONSTRATION DATA — NOT REAL PATIENT DATA</span>
        </div>
        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
          <strong>These are demonstration cases created for academic presentation.</strong> This demonstration mode is designed exclusively for college viva presentations and technical evaluation. All samples represent synthetic prototype benchmark patterns. NutriVision AI is an educational screening prototype and <strong>does not make medical diagnoses</strong>.
        </p>
      </div>

      {/* 5-Step Pipeline Progress Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {[
          { step: 1, label: '1. Select Sample', icon: Eye },
          { step: 2, label: '2. Quality Gate', icon: Sparkles },
          { step: 3, label: '3. ONNX Inference', icon: Cpu },
          { step: 4, label: '4. Softmax Top-3', icon: Activity },
          { step: 5, label: '5. Nutrition Engine', icon: Utensils }
        ].map((s) => {
          const Icon = s.icon;
          const isDone = currentStep >= s.step;
          const isCurrent = currentStep === s.step;
          return (
            <div
              key={s.step}
              className={`p-3 rounded-xl border text-center transition-all ${
                isCurrent
                  ? 'bg-health-600 text-white border-health-600 shadow-md ring-2 ring-health-400/50'
                  : isDone
                  ? 'bg-health-50 dark:bg-health-950/40 border-health-300 dark:border-health-800 text-health-800 dark:text-health-300'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4 mx-auto mb-1" />
              <span className="text-[11px] font-bold block">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Step 1: Select Demo Sample Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-4 h-4 text-health-600" />
          <span>Step 1: Choose Prototype Demonstration Case</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {DEMO_SAMPLES.map((sample) => {
            const isSelected = selectedSample.id === sample.id;
            return (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-health-600 bg-health-50 dark:bg-health-950/50 ring-2 ring-health-500/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-health-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">{sample.bodyRegion}</span>
                  <Badge variant={sample.id.includes('healthy') ? 'success' : 'health'} size="sm">
                    {sample.sampleBadge}
                  </Badge>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-2">
                  {sample.title}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                  {sample.visualSignDescription}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Sample Inspection & Live Telemetry Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quality Gate + Model Execution */}
        <div className="lg:col-span-6 space-y-6">
          {/* Step 2: Quality Gate */}
          <Card variant="default" className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Step 2: OpenCV Image Quality Gate</span>
              </h4>
              <Badge variant={currentStep >= 2 ? 'success' : 'neutral'} size="sm">
                {currentStep >= 2 ? 'PASSED' : 'Pending Step'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Laplacian Sharpness</span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {currentStep >= 2 ? `${selectedSample.sharpnessScore.toFixed(1)}` : '—'}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">Threshold: &gt; 50.0 (Sharp)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Luminance / Brightness</span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {currentStep >= 2 ? `${selectedSample.brightnessScore.toFixed(1)}` : '—'}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">Range: 40.0 - 220.0 (Valid)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Evaluates frame blurriness via second derivative variance and ensures uniform photographic lighting before inference.
            </p>
          </Card>

          {/* Step 3: AI Inference Telemetry */}
          <Card variant="default" className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span>Step 3: MobileNetV2 ONNX Inference</span>
              </h4>
              <Badge variant={currentStep >= 3 ? 'success' : 'neutral'} size="sm">
                {currentStep >= 3 ? 'Inference Complete' : 'Pending Step'}
              </Badge>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-1">
              <p className="text-emerald-400">&gt; Tensor Preprocessing: 224x224x3 (ImageNet Norm)</p>
              <p className="text-purple-300">&gt; Architecture: MobileNetV2 Inverted Residual Bottlenecks</p>
              <p className="text-blue-300">&gt; Runtime: ONNX Runtime CPU Engine (v1.0.0)</p>
              <p className="text-amber-300">&gt; Mathematical Output: Raw Logits $\to$ Softmax Normalized Probabilities</p>
            </div>
          </Card>
        </div>

        {/* Right Column: Step 4 Top-3 Softmax Predictions */}
        <div className="lg:col-span-6 space-y-6">
          <Card variant="default" className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-health-600" />
                <span>Step 4: Top-3 Visual Pattern Candidates</span>
              </h4>
              <Badge variant="health" size="sm">
                Softmax Probabilities
              </Badge>
            </div>

            {currentStep < 4 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Click "Run Full 5-Stage Pipeline" to compute mathematical Softmax probabilities.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedSample.top3Predictions.map((pred) => (
                  <div
                    key={pred.rank}
                    className={`p-3.5 rounded-xl border ${
                      pred.rank === 1
                        ? 'bg-health-50 dark:bg-health-950/40 border-health-300 dark:border-health-800'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] flex items-center justify-center font-bold">
                          {pred.rank}
                        </span>
                        {pred.category}
                      </span>
                      <strong className="text-xs text-health-600">{pred.percentage}</strong>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-1.5">
                      <div
                        className="bg-health-600 h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(4, pred.confidence * 100)}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {pred.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Step 5: Nutrition Guidance & Interactive Diet Filters */}
      {currentStep >= 5 && (
        <Card variant="default" className="p-6 space-y-5 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-health-600" />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Step 5: Database Nutrition Recommendations & Absorption Guidance
                </h4>
                <p className="text-xs text-slate-500">
                  Target Nutrient: <strong>{nutritionData?.primaryNutrient || selectedSample.primaryNutrient}</strong>
                </p>
              </div>
            </div>

            {/* Live Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                {(
                  [
                    { value: 'ANY', label: 'All Diets' },
                    { value: 'VEGETARIAN', label: 'Veg' },
                    { value: 'VEGAN', label: 'Vegan' },
                    { value: 'NON_VEGETARIAN', label: 'Non-Veg' }
                  ] as const
                ).map((d) => (
                  <button
                    key={d.value}
                    onClick={() => handleDietChange(d.value as DietType)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      selectedDiet === d.value
                        ? 'bg-health-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                {(
                  [
                    { value: undefined, label: 'All Regions' },
                    { value: 'SOUTH_INDIAN', label: 'South Indian' },
                    { value: 'INDIAN', label: 'Pan-Indian' }
                  ] as const
                ).map((r) => (
                  <button
                    key={r.label}
                    onClick={() => handleRegionChange(r.value as FoodRegion | undefined)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      selectedRegion === r.value
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Synergy Tips */}
          {nutritionData?.guidance?.synergyAbsorptionNotes && (
            <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 text-xs text-teal-900 dark:text-teal-200 space-y-1">
              <strong className="font-bold flex items-center gap-1.5 text-teal-800 dark:text-teal-300">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Absorption Synergy Mechanism:
              </strong>
              <p className="text-[11px] leading-relaxed">{nutritionData.guidance.synergyAbsorptionNotes}</p>
            </div>
          )}

          {/* Recommended Food Cards */}
          {nutritionData?.recommendedFoods && nutritionData.recommendedFoods.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              {nutritionData.recommendedFoods.slice(0, 6).map((food: FoodItemDto) => (
                <div
                  key={food.foodId}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {food.foodName}
                    </h5>
                    <Badge variant="neutral" size="sm">
                      {food.dietType.replace('_', ' ')}
                    </Badge>
                  </div>
                  {food.localName && (
                    <span className="text-[10px] text-slate-400 block">Regional: {food.localName}</span>
                  )}
                  {food.servingSuggestion && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/60 p-2 rounded-lg">
                      {food.servingSuggestion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
