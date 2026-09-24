import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Hand,
  Eye,
  Smile,
  HeartPulse,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Sliders,
  Utensils,
  Download,
  Trash2,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import { CameraCapture } from '../../components/common/CameraCapture';
import { BodyPart, Assessment, AssessmentImage, InferenceResponse } from '../../types';
import { assessmentService } from '../../services/assessmentService';
import { showToast } from '../../services/toastStore';
import { PreliminaryResultView } from '../../components/assessment/PreliminaryResultView';

export const NewAssessmentPage: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Step State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [uploadedImage, setUploadedImage] = useState<AssessmentImage | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [consentAcknowledged, setConsentAcknowledged] = useState<boolean>(false);
  const [screeningResult, setScreeningResult] = useState<InferenceResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);


  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  // Anatomical Region Options (Section 6)
  const bodyParts = [
    { id: 'EYES' as BodyPart, name: 'Eyes', icon: <Eye className="w-7 h-7" />, desc: 'Take a clear photo of the visible eye area and lower eyelid in good lighting.' },
    { id: 'TONGUE' as BodyPart, name: 'Tongue', icon: <Smile className="w-7 h-7" />, desc: 'Take a clear photo of the tongue surface in good lighting.' },
    { id: 'NAILS' as BodyPart, name: 'Nails', icon: <Hand className="w-7 h-7" />, desc: 'Upload a clear photo of your fingernails.' },
    { id: 'LIPS' as BodyPart, name: 'Lips', icon: <Smile className="w-7 h-7" />, desc: 'Take a clear photo of the mouth corners and lips.' },
    { id: 'SKIN' as BodyPart, name: 'Skin', icon: <HeartPulse className="w-7 h-7" />, desc: 'Take a clear photo of the affected skin area in bright light.' },
    { id: 'HAIR' as BodyPart, name: 'Hair', icon: <Sparkles className="w-7 h-7" />, desc: 'Take a clear photo of the visible hair or scalp.' },
  ];

  // Symptom Catalog per Body Part
  const symptomCatalog: Record<BodyPart, string[]> = {
    NAILS: [
      'Brittle or easily cracking nails',
      'Spoon-shaped concave nails (Koilonychia)',
      'Pale nail beds without healthy pink hue',
      'White transverse spots or ridges (Leukonychia)',
      'Slow nail growth and peeling edges',
    ],
    EYES: [
      'Pale inner lower eyelids (Conjunctival Pallor)',
      'Dry or gritty sensation in eyes (Xerophthalmia)',
      'Foamy white/gray spots on outer eye (Bitot’s spots)',
      'Difficulty seeing in low light (Night blindness)',
      'Excessive eye strain or redness',
    ],
    TONGUE: [
      'Swollen, beefy-red tongue (Glossitis)',
      'Smooth tongue surface due to papillae loss',
      'Burning or sore sensation on tongue',
      'Pale or unusually light pink tongue color',
      'Frequent mouth ulcers and tender spots',
    ],
    LIPS: [
      'Cracking or fissures at corners of mouth (Angular Cheilitis)',
      'Chronically chapped or peeling lips',
      'Pale lips with reduced blood coloration',
      'Dryness and burning around mouth edges',
    ],
    SKIN: [
      'Dry, rough patches with goosebump-like texture (Follicular Hyperkeratosis)',
      'Slow wound or cut healing',
      'Easy bruising with minor impact',
      'Unexplained pale skin tone (General Pallor)',
      'Hyper-pigmentation or flaky dry spots',
    ],
    HAIR: [
      'Diffuse hair thinning or shedding',
      'Dry, brittle, easily breakable hair strands',
      'Premature graying or pigment loss',
      'Dry, flaky scalp condition',
    ],
    FACE: [
      'General facial pallor or tired appearance',
      'Dull skin tone and puffiness',
    ],
  };

  // Step 1: Initialize Session in Spring Boot Backend
  const handleStartSession = async () => {
    if (!selectedBodyPart) return;

    setIsLoading(true);
    try {
      const created = await assessmentService.createAssessment(selectedBodyPart);
      setAssessment(created);
      showToast.success('Session Created', `Assessment #${created.assessmentId} initiated for ${selectedBodyPart}.`);
      setCurrentStep(2);
    } catch (err: any) {
      showToast.error('Session Error', err.response?.data?.message || err.message || 'Could not initiate assessment.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Real File Upload to Backend API
  const handleFileUpload = async (file: File) => {
    if (!assessment) {
      showToast.error('Session Error', 'No active assessment session.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast.error('File Limit Exceeded', 'Please select an image smaller than 10 MB.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast.error('Unsupported Format', 'Please upload a JPG, PNG, or WebP image.');
      return;
    }

    setUploadedImage(null);
    setScreeningResult(null);
    setIsUploading(true);
    setShowCameraModal(false);
    try {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Perform real multipart upload with OpenCV Quality Evaluation
      const imageResult = await assessmentService.uploadAssessmentImage(assessment.assessmentId, file);
      setUploadedImage(imageResult);

      if (imageResult.qualityStatus === 'PASSED') {
        showToast.success('Quality Passed', `Sharpness and lighting verified (Blur: ${imageResult.blurScore}, Brightness: ${imageResult.brightnessScore}).`);
      } else if (imageResult.qualityStatus === 'REJECTED') {
        showToast.warning('Quality Issue Detected', imageResult.rejectionReason || 'Photograph does not meet quality requirements.');
      } else {
        showToast.info('Image Uploaded', 'Stored on server. Quality analysis is pending.');
      }

      setCurrentStep(3);
    } catch (err: any) {
      showToast.error('Upload Failed', err.response?.data?.message || err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Step 3: Delete Image Action
  const handleDeleteImage = async () => {
    if (!assessment || !uploadedImage) return;

    setIsLoading(true);
    try {
      await assessmentService.deleteAssessmentImage(assessment.assessmentId, uploadedImage.imageId);
      setUploadedImage(null);
      setPreviewUrl(null);
      showToast.info('Image Removed', 'Photograph was deleted from server.');
      setCurrentStep(2);
    } catch (err: any) {
      showToast.error('Delete Error', err.response?.data?.message || err.message || 'Could not delete image.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Re-Analyze Quality Action
  const handleRetryQualityCheck = async () => {
    if (!assessment || !uploadedImage) return;

    setIsLoading(true);
    try {
      const updated = await assessmentService.reAnalyzeImageQuality(assessment.assessmentId, uploadedImage.imageId);
      setUploadedImage(updated);
      if (updated.qualityStatus === 'PASSED') {
        showToast.success('Quality Check Passed', `Blur: ${updated.blurScore}, Brightness: ${updated.brightnessScore}`);
      } else if (updated.qualityStatus === 'REJECTED') {
        showToast.warning('Quality Rejected', updated.rejectionReason || 'Quality check failed.');
      } else {
        showToast.info('Quality Pending', 'Service still unavailable.');
      }
    } catch (err: any) {
      showToast.error('Check Error', err.response?.data?.message || err.message || 'Could not re-analyze image.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Toggle Symptoms
  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  // Step 5 -> 6: Finalize Assessment & Trigger AI Screening
  const handleCompleteAssessment = async () => {
    if (!assessment) return;

    setIsLoading(true);
    try {
      if (!uploadedImage || !consentAcknowledged) return;
      const result = await assessmentService.screenAssessment(assessment.assessmentId, uploadedImage.imageId, selectedSymptoms);
      setScreeningResult(result);
      setAssessment(await assessmentService.getAssessmentById(assessment.assessmentId));
      if (result.status === 'SUCCESS') {
        showToast.success('Assessment saved', 'Your screening result has been saved.');
      } else {
        showToast.info('No prediction made', result.message || 'Photo analysis is unavailable.');
      }
      setCurrentStep(6);
    } catch (err: any) {
      showToast.error('Update Error', err.response?.data?.message || err.message || 'Failed to complete assessment.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Wizard Progress Bar */}
      <div>
        <PageHeader
          title="Nutritional Assessment Wizard"
          subtitle={`Step ${currentStep} of 6: ${
            currentStep === 1
              ? 'Anatomy Selection'
              : currentStep === 2
              ? 'Photo Upload & Capture'
              : currentStep === 3
              ? 'Photo quality check'
              : currentStep === 4
              ? 'Symptom Questionnaire'
              : currentStep === 5
              ? 'Review & Consent'
              : 'Preliminary Results'
          }`}
        />

        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-health-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      <MedicalDisclaimer variant="banner" />

      {/* STEP 1: Anatomy Selection */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              What are you uploading?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select the body area you would like to screen today.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bodyParts.map((bp) => {
              const isSelected = selectedBodyPart === bp.id;
              return (
                <Card
                  key={bp.id}
                  variant="default"
                  onClick={() => setSelectedBodyPart(bp.id)}
                  className={`p-6 cursor-pointer transition-all duration-200 border-2 select-none ${
                    isSelected
                      ? 'border-health-600 dark:border-health-500 bg-health-50/50 dark:bg-health-950/40 shadow-health-glow'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3.5 transition-colors ${
                      isSelected
                        ? 'bg-health-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {bp.icon}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {bp.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {bp.desc}
                  </p>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              size="md"
              disabled={!selectedBodyPart}
              isLoading={isLoading}
              onClick={handleStartSession}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Begin Assessment Session
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Photo Capture / Real Upload */}
      {currentStep === 2 && (
        <Card variant="default" className="p-8 space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Provide Photograph of Your {selectedBodyPart}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Please provide a clear, well-lit photograph. You can choose to take a photo using your camera or upload a file.
            </p>
          </div>

          {showCameraModal ? (
            <CameraCapture
              onCapture={handleFileUpload}
              onCancel={() => setShowCameraModal(false)}
            />
          ) : (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  isDragOver
                    ? 'border-health-600 bg-health-50/70 dark:bg-health-950/40'
                    : 'border-slate-300 dark:border-slate-700 hover:border-health-500 bg-slate-50/50 dark:bg-slate-900/40'
                }`}
              >
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-health-50 dark:bg-health-950/70 text-health-600 dark:text-health-400 flex items-center justify-center border border-health-200 dark:border-health-800">
                    {isUploading ? (
                      <div className="w-6 h-6 border-2 border-health-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {isUploading ? 'Uploading & evaluating image...' : 'Click to browse photograph or drag & drop here'}
                  </span>
                  <span className="text-xs text-slate-400">
                    JPEG, PNG, or WebP up to 10 MB (Stored securely for Assessment #{assessment?.assessmentId})
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <span className="text-xs text-slate-400">— OR —</span>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowCameraModal(true)}
                  leftIcon={<Camera className="w-4 h-4 text-health-600" />}
                >
                  Use Live Camera
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Real OpenCV Image Quality Verification */}
      {currentStep === 3 && (
        <Card variant="default" className="p-8 space-y-6 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Photo quality check
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {previewUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-64 flex items-center justify-center bg-slate-950">
                <img src={previewUrl} alt="Uploaded Screening Photo" className="object-contain max-h-64 w-full" />
              </div>
            )}

            <div className="space-y-4">
              {/* Quality Status Feedback Box */}
              {uploadedImage?.qualityStatus === 'PASSED' && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>✓ Technical Image Quality Passed</span>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    Image resolution, sharpness, and lighting meet technical screening thresholds.
                  </p>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 pt-1 space-y-0.5">
                    <p>• Sharpness (Laplacian Variance): <strong>{uploadedImage.blurScore}</strong> (Required: &ge; 100)</p>
                    <p>• Luminance (Mean Grayscale): <strong>{uploadedImage.brightnessScore}</strong> (Required: 40 - 220)</p>
                  </div>
                </div>
              )}

              {uploadedImage?.qualityStatus === 'WARNING' && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>⚠ Quality Advisory / Borderline Quality</span>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                    {uploadedImage.rejectionReason || 'Image quality may affect analysis accuracy. A clearer or better-lit photo is recommended.'}
                  </p>
                  <div className="text-[11px] text-amber-700 dark:text-amber-400 pt-1 space-y-0.5">
                    {uploadedImage.blurScore !== undefined && uploadedImage.blurScore !== null && (
                      <p>• Sharpness Score: <strong>{uploadedImage.blurScore}</strong> (Ideal: &ge; 100)</p>
                    )}
                    {uploadedImage.brightnessScore !== undefined && uploadedImage.brightnessScore !== null && (
                      <p>• Luminance Score: <strong>{uploadedImage.brightnessScore}</strong> (Ideal: 60 - 200)</p>
                    )}
                  </div>
                </div>
              )}

              {uploadedImage?.qualityStatus === 'REJECTED' && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>✕ Image Quality Rejected</span>
                  </div>
                  <p className="text-xs text-rose-700 dark:text-rose-300 font-medium leading-relaxed">
                    {uploadedImage.rejectionReason || 'The photograph does not meet quality requirements.'}
                  </p>
                  <div className="text-[11px] text-rose-600 dark:text-rose-400 pt-1 space-y-0.5">
                    {uploadedImage.blurScore !== undefined && uploadedImage.blurScore !== null && (
                      <p>• Measured Sharpness: <strong>{uploadedImage.blurScore}</strong> (Required: &ge; 100)</p>
                    )}
                    {uploadedImage.brightnessScore !== undefined && uploadedImage.brightnessScore !== null && (
                      <p>• Measured Luminance: <strong>{uploadedImage.brightnessScore}</strong> (Required: 40 - 220)</p>
                    )}
                  </div>
                </div>
              )}

              {uploadedImage?.qualityStatus === 'PENDING' && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Quality Status: PENDING</span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                    Image uploaded successfully. Quality analysis is temporarily unavailable.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetryQualityCheck}
                    isLoading={isLoading}
                    leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  >
                    Retry Quality Analysis
                  </Button>
                </div>
              )}

              <p className="text-[10px] text-slate-400 italic">
                * Note: Image quality evaluation strictly checks photographic sharpness & illumination. It does not perform clinical diagnosis.
              </p>

              <div className="text-xs text-slate-500 space-y-1">
                <p>• Image ID: <strong>#{uploadedImage?.imageId}</strong></p>
                <p>• File name: <strong>{uploadedImage?.originalFilename}</strong></p>
                <p>• Size: <strong>{((uploadedImage?.fileSizeBytes || 0) / 1024).toFixed(1)} KB</strong></p>
                <p>• Target Region: <strong>{selectedBodyPart}</strong></p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteImage}
                  isLoading={isLoading}
                  leftIcon={<Trash2 className="w-4 h-4 text-rose-500" />}
                >
                  Remove / Retake Photo
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={uploadedImage?.qualityStatus === 'REJECTED'}
              onClick={() => setCurrentStep(4)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Symptoms
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: Symptom Questionnaire */}
      {currentStep === 4 && (
        <Card variant="default" className="p-8 space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Symptom Questionnaire ({selectedBodyPart})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select symptoms to save with your record. These will not be interpreted as findings from your photo.
            </p>
          </div>

          <div className="space-y-3">
            {selectedBodyPart &&
              symptomCatalog[selectedBodyPart].map((symptom, idx) => {
                const isChecked = selectedSymptoms.includes(symptom);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleSymptom(symptom)}
                    className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                      isChecked
                        ? 'bg-health-50/70 dark:bg-health-950/50 border-health-500 text-slate-900 dark:text-slate-100'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium">{symptom}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded text-health-600 focus:ring-health-500"
                    />
                  </div>
                );
              })}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(3)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button variant="primary" size="md" onClick={() => setCurrentStep(5)} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Review Assessment
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: Review & Consent */}
      {currentStep === 5 && (
        <Card variant="default" className="p-8 space-y-6 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Review Assessment Details & Medical Consent
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3 text-xs">
            <p><strong>Target Region:</strong> {selectedBodyPart}</p>
            <p><strong>Attached Photo:</strong> {uploadedImage?.originalFilename} ({((uploadedImage?.fileSizeBytes || 0) / 1024).toFixed(1)} KB)</p>
            <p><strong>Quality Evaluation:</strong> {uploadedImage?.qualityStatus} (Blur: {uploadedImage?.blurScore}, Brightness: {uploadedImage?.brightnessScore})</p>
            <div>
              <strong>Reported Symptoms ({selectedSymptoms.length}):</strong>
              {selectedSymptoms.length > 0 ? (
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600 dark:text-slate-300">
                  {selectedSymptoms.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 mt-1">No symptoms checked (Visual analysis only)</p>
              )}
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={consentAcknowledged}
                onChange={(e) => setConsentAcknowledged(e.target.checked)}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <span>
                I understand that photo quality checks do not identify a deficiency. The current model is not validated for photo screening, and this record is <strong>not a medical diagnosis</strong>.
              </span>
            </label>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(4)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Symptoms
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={!consentAcknowledged}
              isLoading={isLoading}
              onClick={handleCompleteAssessment}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Save and check assessment
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 6: Understandable Preliminary Results & Immediate Food Guidance */}
      {currentStep === 6 && (
        <div className="space-y-6 animate-fadeIn">
          <PreliminaryResultView
            screeningResult={screeningResult}
            assessment={assessment}
            uploadedImage={uploadedImage}
            selectedBodyPart={selectedBodyPart}
            selectedSymptoms={selectedSymptoms}
          />

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link to="/dashboard">
              <Button variant="outline" size="md" className="w-full sm:w-auto">
                Return to Dashboard
              </Button>
            </Link>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setAssessment(null);
                setUploadedImage(null);
                setPreviewUrl(null);
                setSelectedSymptoms([]);
                setConsentAcknowledged(false);
                setScreeningResult(null);
                setCurrentStep(1);
              }}
              className="w-full sm:w-auto"
            >
              Start Another Assessment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
