import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Utensils,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Play,
  Activity,
  ShieldAlert,
  Image as ImageIcon,
  Cpu,
  Sparkles,
  Star,
  Layers,
  AlertTriangle,
  Leaf,
  FileText,
  Printer
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import { AssessmentReportModal } from '../../components/assessment/AssessmentReportModal';
import { assessmentService } from '../../services/assessmentService';
import { nutritionService } from '../../services/nutritionService';
import {
  Assessment,
  AssessmentImage,
  InferenceResponse,
  NutritionRecommendationResponse,
  DietType,
  FoodRegion,
  FoodItemDto
} from '../../types';
import { showToast } from '../../services/toastStore';

export const AssessmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [images, setImages] = useState<AssessmentImage[]>([]);
  const [inferenceResult, setInferenceResult] = useState<InferenceResponse | null>(null);
  const [nutritionData, setNutritionData] = useState<NutritionRecommendationResponse | null>(null);
  const [selectedDiet, setSelectedDiet] = useState<DietType>('ANY');
  const [selectedRegion, setSelectedRegion] = useState<FoodRegion | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isScreening, setIsScreening] = useState(false);
  const [isNutritionLoading, setIsNutritionLoading] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await assessmentService.getAssessmentById(id);
        setAssessment(data);
        const imgList = await assessmentService.getAssessmentImages(id);
        setImages(imgList);
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || 'Failed to retrieve assessment details.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  // Fetch nutrition guidance when top prediction is established
  useEffect(() => {
    const fetchNutrition = async () => {
      let category = 'Healthy_Normal';
      if (inferenceResult?.topPrediction?.deficiencyCategory) {
        category = inferenceResult.topPrediction.deficiencyCategory;
      } else if (assessment?.status === 'COMPLETED' && images.length > 0) {
        // Default category fallback
        category = 'Iron_Deficiency';
      } else {
        return;
      }

      setIsNutritionLoading(true);
      try {
        const res = await nutritionService.getRecommendations(
          category,
          selectedDiet === 'ANY' ? undefined : selectedDiet,
          selectedRegion
        );
        setNutritionData(res);
      } catch (err: any) {
        console.error('Failed to load assessment nutrition recommendations:', err);
      } finally {
        setIsNutritionLoading(false);
      }
    };

    fetchNutrition();
  }, [inferenceResult, assessment, selectedDiet, selectedRegion, images.length]);

  const handleRunScreening = async (imageId?: number) => {
    if (!id) return;
    setIsScreening(true);
    try {
      const res = await assessmentService.screenAssessment(id, imageId);
      setInferenceResult(res);
      if (res.status === 'SUCCESS') {
        showToast.success('Screening Complete', 'AI inference and image quality checks completed successfully.');
      } else if (res.status === 'QUALITY_REJECTED') {
        showToast.warning('Quality Rejected', res.message || 'Image did not meet quality requirements.');
      } else {
        showToast.info('Screening Info', res.message || 'Screening request processed.');
      }
    } catch (err: any) {
      showToast.error('Screening Failed', err.response?.data?.message || 'Could not complete screening.');
    } finally {
      setIsScreening(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm(`Delete assessment #${id}?`)) return;
    try {
      await assessmentService.deleteAssessment(id);
      showToast.success('Deleted', `Assessment #${id} has been removed.`);
      navigate('/history');
    } catch (err: any) {
      showToast.error('Delete Error', 'Could not delete assessment.');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!id || !window.confirm(`Delete photograph #${imageId}?`)) return;
    try {
      await assessmentService.deleteAssessmentImage(id, imageId);
      setImages((prev) => prev.filter((img) => img.imageId !== imageId));
      showToast.success('Deleted', `Photograph #${imageId} deleted.`);
    } catch (err: any) {
      showToast.error('Delete Error', 'Could not delete photograph.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading assessment records..." />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto py-12">
        <Card variant="default" className="p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Unable to Load Assessment</h3>
          <p className="text-xs text-slate-500">
            {error || 'The requested assessment could not be found or you do not have permission to view it.'}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/history">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to History
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <Link to="/history" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-health-600 mb-3">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Assessment History</span>
        </Link>
        <PageHeader
          title={`Assessment #${assessment.assessmentId} — ${assessment.targetBodyPart}`}
          subtitle={`Created on ${new Date(assessment.createdAt).toLocaleString()}`}
          actions={
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReportOpen(true)}
                leftIcon={<FileText className="w-4 h-4 text-health-600" />}
              >
                View / Print Official Report
              </Button>
              <Link to={`/recommendations?category=${inferenceResult?.topPrediction?.deficiencyCategory || 'Iron_Deficiency'}`}>
                <Button variant="primary" size="sm" leftIcon={<Utensils className="w-4 h-4" />}>
                  Explore Food Engine
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleDelete} leftIcon={<Trash2 className="w-4 h-4 text-rose-500" />}>
                Delete
              </Button>
            </div>
          }
        />
      </div>

      <MedicalDisclaimer variant="banner" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Details & Uploaded Images */}
        <div className="lg:col-span-8 space-y-6">
          <Card variant="default">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Screening Overview</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target region: <strong>{assessment.targetBodyPart}</strong>
                </p>
              </div>
              <Badge
                variant={
                  assessment.status === 'COMPLETED'
                    ? 'success'
                    : assessment.status === 'IN_PROGRESS'
                    ? 'warning'
                    : 'neutral'
                }
                size="md"
              >
                {assessment.status}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Real AI Inference Results Card */}
              {inferenceResult && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-health-500/5 via-primary-500/5 to-transparent border border-health-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-health-600 animate-pulse" />
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        AI Screening Analysis Results
                      </h4>
                    </div>
                    <Badge variant={inferenceResult.status === 'SUCCESS' ? 'success' : 'warning'} size="sm">
                      {inferenceResult.inferenceStatus}
                    </Badge>
                  </div>

                  {/* Quality Engine Status */}
                  {inferenceResult.qualityEvaluation && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Quality Gate</span>
                        <strong className="text-slate-800 dark:text-slate-200">{inferenceResult.qualityEvaluation.qualityStatus}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Sharpness (Laplacian)</span>
                        <strong className="text-slate-800 dark:text-slate-200">{inferenceResult.qualityEvaluation.blurScore?.toFixed(1) || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Illumination Score</span>
                        <strong className="text-slate-800 dark:text-slate-200">{inferenceResult.qualityEvaluation.brightnessScore?.toFixed(1) || 'N/A'}</strong>
                      </div>
                    </div>
                  )}

                  {/* Predictions List */}
                  {inferenceResult.predictions && inferenceResult.predictions.length > 0 && (
                    <div className="space-y-3 pt-1">
                      <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Ranked Visual Pattern Candidates
                      </h5>
                      <div className="space-y-2.5">
                        {inferenceResult.predictions.map((p) => (
                          <div
                            key={p.rank}
                            className={`p-3 rounded-xl border ${
                              p.rank === 1
                                ? 'bg-health-50 dark:bg-health-950/30 border-health-300 dark:border-health-800/60'
                                : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] flex items-center justify-center font-bold">
                                  {p.rank}
                                </span>
                                {p.deficiencyCategory}
                              </span>
                              <span className="text-xs font-bold text-health-600">
                                {p.confidencePercentage}
                              </span>
                            </div>

                            {/* Confidence Progress Bar */}
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
                              <div
                                className="bg-health-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(4, p.modelConfidence * 100)}%` }}
                              />
                            </div>

                            {p.possiblePatternDescription && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                {p.possiblePatternDescription}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                    <Cpu className="w-3.5 h-3.5 text-slate-500" />
                    <span>Model: {inferenceResult.modelName || 'MobileNetV2 NutriVision'} ({inferenceResult.modelVersion || 'v1.0.0'})</span>
                  </div>
                </div>
              )}

              {/* Nutrition Recommendations Section */}
              {nutritionData && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-health-600" />
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        🥗 Nutrition Guidance & Food Suggestions
                      </h4>
                    </div>
                    <Badge variant="health" size="sm">
                      {nutritionData.primaryNutrient} Focus
                    </Badge>
                  </div>

                  {/* Filter Controls Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                    <div className="flex items-center gap-1">
                      {(
                        [
                          { value: 'ANY', label: 'All Diets' },
                          { value: 'VEGETARIAN', label: 'Veg 🥬' },
                          { value: 'VEGAN', label: 'Vegan 🌱' },
                          { value: 'NON_VEGETARIAN', label: 'Non-Veg 🍗' }
                        ] as const
                      ).map((d) => (
                        <button
                          key={d.value}
                          onClick={() => setSelectedDiet(d.value as DietType)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            selectedDiet === d.value
                              ? 'bg-health-600 text-white'
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      {(
                        [
                          { value: undefined, label: 'All Regions' },
                          { value: 'SOUTH_INDIAN', label: 'South Indian 🇮🇳' },
                          { value: 'INDIAN', label: 'Indian 🇮🇳' }
                        ] as const
                      ).map((r) => (
                        <button
                          key={r.label}
                          onClick={() => setSelectedRegion(r.value as FoodRegion | undefined)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            selectedRegion === r.value
                              ? 'bg-teal-600 text-white'
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Absorption Synergy */}
                  {nutritionData.guidance?.synergyAbsorptionNotes && (
                    <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 text-xs text-teal-800 dark:text-teal-200 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed">{nutritionData.guidance.synergyAbsorptionNotes}</p>
                    </div>
                  )}

                  {/* Food Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {nutritionData.recommendedFoods.map((food: FoodItemDto) => (
                      <div
                        key={food.foodId}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2 relative"
                      >
                        {food.priority === 1 && (
                          <span className="absolute top-2 right-2 text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" /> Priority
                          </span>
                        )}
                        <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 pr-12">
                          {food.foodName}
                        </h5>
                        {food.localName && (
                          <span className="text-[10px] text-slate-400 block -mt-1">Local: {food.localName}</span>
                        )}
                        {food.servingSuggestion && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800 p-2 rounded-lg">
                            {food.servingSuggestion}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1">
                          <Badge variant="neutral" size="sm">
                            {food.dietType.replace('_', ' ')}
                          </Badge>
                          <span>• {food.region.replace('_', ' ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded Photographs */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-health-600" />
                    <span>Uploaded Photographs ({images.length})</span>
                  </h4>
                  {images.length > 0 && (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={isScreening}
                      onClick={() => handleRunScreening()}
                      leftIcon={<Play className="w-3.5 h-3.5" />}
                    >
                      Run AI Screening
                    </Button>
                  )}
                </div>

                {images.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No photographs uploaded for this session yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {images.map((img) => (
                      <div
                        key={img.imageId}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                            {img.originalFilename}
                          </span>
                          <Badge
                            variant={
                              img.qualityStatus === 'PASSED'
                                ? 'success'
                                : img.qualityStatus === 'WARNING'
                                ? 'warning'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {img.qualityStatus}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-slate-500 space-y-0.5">
                          <p>Size: {((img.fileSizeBytes || 0) / 1024).toFixed(1)} KB</p>
                          <p>Sharpness: {img.blurScore ? img.blurScore.toFixed(1) : 'Checked'}</p>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <button
                            onClick={() => handleRunScreening(img.imageId)}
                            disabled={isScreening}
                            className="text-xs text-health-600 hover:text-health-700 font-semibold flex items-center gap-1"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Analyze</span>
                          </button>
                          <button
                            onClick={() => handleDeleteImage(img.imageId)}
                            className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="default" className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-health-600" />
              <span>Model Telemetry</span>
            </h4>
            <div className="text-xs text-slate-500 space-y-2">
              <p>• Assessment ID: <strong>#{assessment.assessmentId}</strong></p>
              <p>• Target Region: <strong>{assessment.targetBodyPart}</strong></p>
              <p>• Architecture: <strong>MobileNetV2 (ONNX)</strong></p>
              <p>• Status: <strong>{assessment.status}</strong></p>
              <p>• Created: <strong>{new Date(assessment.createdAt).toLocaleDateString()}</strong></p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold text-xs">
                <ShieldAlert className="w-4 h-4" />
                <span>Preliminary Screening</span>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 leading-snug">
                Probabilities reflect computer vision visual patterns, not clinical blood lab biomarkers.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Official Assessment Report Modal */}
      {assessment && (
        <AssessmentReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          assessment={assessment}
          images={images}
          inferenceResult={inferenceResult}
          nutritionData={nutritionData}
        />
      )}
    </div>
  );
};
