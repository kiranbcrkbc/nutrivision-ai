import React from 'react';
import { Button } from '../common/Button';
import { Assessment, AssessmentImage, InferenceResponse, NutritionRecommendationResponse } from '../../types';
interface AssessmentReportModalProps {
  isOpen: boolean; onClose: () => void; assessment: Assessment; images?: AssessmentImage[];
  inferenceResult?: InferenceResponse | null; nutritionData?: NutritionRecommendationResponse | null;
}
export const AssessmentReportModal: React.FC<AssessmentReportModalProps> = ({isOpen,onClose,assessment,images=[],inferenceResult,nutritionData}) => {
  if (!isOpen) return null;
  const outcome = inferenceResult || assessment.screeningResult;
  const predictions = outcome?.status === 'SUCCESS' ? outcome.predictions : [];
  return <div data-assessment-report="true" role="dialog" aria-modal="true" aria-labelledby="report-heading" className="fixed inset-0 z-50 bg-slate-950/70 p-4 overflow-y-auto print:p-0 print:bg-white">
    <article className="max-w-3xl mx-auto bg-white dark:bg-slate-900 print:bg-white print:text-black rounded-2xl p-6 sm:p-10 space-y-6">
      <div className="flex justify-end gap-3 print:hidden"><Button onClick={() => window.print()}>Print / Save PDF</Button><Button variant="outline" onClick={onClose}>Close</Button></div>
      <header className="border-b pb-5"><p className="text-health-600 font-bold">Vitamin Deficiency</p><h1 id="report-heading" className="text-2xl font-bold mt-2">Your assessment record</h1><p className="text-sm mt-2">#{assessment.assessmentId} · {new Date(assessment.createdAt).toLocaleString()} · {assessment.targetBodyPart}</p></header>
      <section><h2 className="font-bold mb-2">Recorded outcome</h2><p>{outcome?.message || 'No screening outcome was saved for this record. No deficiency can be inferred from this report.'}</p><p className="mt-2 text-sm">Assessment status: {assessment.status.replace(/_/g,' ')}</p></section>
      {!!predictions.length && <section><h2 className="font-bold mb-2">Possible associations</h2><ul className="space-y-2">{predictions.map(p=><li key={p.rank}>{p.deficiencyCategory} — model score {p.confidencePercentage}<p className="text-sm">{p.possiblePatternDescription}</p></li>)}</ul><p className="text-sm mt-2">Model scores are not a probability of having a deficiency.</p></section>}
      <section><h2 className="font-bold mb-2">Self-reported symptoms</h2>{outcome?.reportedSymptoms?.length ? <ul className="list-disc pl-5">{outcome.reportedSymptoms.map(s=><li key={s}>{s}</li>)}</ul> : <p>No symptoms were saved.</p>}<p className="text-sm mt-2">These are user reports, not findings from the image.</p></section>
      <section><h2 className="font-bold mb-2">Uploaded photos ({images.length})</h2><ul className="space-y-2">{images.map(image=><li key={image.imageId}><strong>{image.originalFilename}</strong>: {image.qualityStatus.toLowerCase()}{image.rejectionReason && <p className="text-sm">{image.rejectionReason}</p>}</li>)}</ul><p className="text-sm mt-2">Image quality refers to lighting and sharpness. It does not verify anatomy or health.</p></section>
      {predictions.length > 0 && nutritionData && <section><h2 className="font-bold mb-2">Food guidance</h2><ul className="list-disc pl-5">{nutritionData.recommendedFoods.map(food=><li key={food.foodId}>{food.foodName}{food.servingSuggestion ? `: ${food.servingSuggestion}` : ''}</li>)}</ul></section>}
      <footer className="border-t pt-4 text-sm">This is an educational record, not a diagnosis or laboratory report. Discuss persistent symptoms and any need for testing with a qualified clinician.</footer>
    </article>
  </div>;
};
