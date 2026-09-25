import { api } from './api';
import { BodyPart, Assessment, AssessmentImage, InferenceResponse } from '../types';

export interface AssessmentSummary {
  assessmentId: number;
  targetBodyPart: BodyPart;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  severityRiskLevel?: string;
  imageCount: number;
  createdAt: string;
  completedAt?: string;
}

export const assessmentService = {
  createAssessment: async (targetBodyPart: string): Promise<Assessment> => {
    const res = await api.post('/assessments', { targetBodyPart });
    return res.data?.data;
  },

  getUserAssessments: async (): Promise<AssessmentSummary[]> => {
    const res = await api.get('/assessments');
    return res.data?.data || [];
  },

  getAssessmentById: async (id: number | string): Promise<Assessment> => {
    const res = await api.get(`/assessments/${id}`);
    return res.data?.data;
  },

  updateStatus: async (
    id: number | string,
    status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    severityRiskLevel?: string
  ): Promise<Assessment> => {
    const res = await api.patch(`/assessments/${id}/status`, { status, severityRiskLevel });
    return res.data?.data;
  },

  deleteAssessment: async (id: number | string): Promise<void> => {
    await api.delete(`/assessments/${id}`);
  },

  // =========================================================================
  // Image Upload, Storage & Quality Analysis APIs
  // =========================================================================

  uploadAssessmentImage: async (
    assessmentId: number | string,
    file: File
  ): Promise<AssessmentImage> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post(`/assessments/${assessmentId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data?.data;
  },

  reAnalyzeImageQuality: async (
    assessmentId: number | string,
    imageId: number | string
  ): Promise<AssessmentImage> => {
    const res = await api.post(`/assessments/${assessmentId}/images/${imageId}/analyze-quality`);
    return res.data?.data;
  },

  getAssessmentImages: async (
    assessmentId: number | string
  ): Promise<AssessmentImage[]> => {
    const res = await api.get(`/assessments/${assessmentId}/images`);
    return res.data?.data || [];
  },

  deleteAssessmentImage: async (
    assessmentId: number | string,
    imageId: number | string
  ): Promise<void> => {
    await api.delete(`/assessments/${assessmentId}/images/${imageId}`);
  },

  getAssessmentImageViewUrl: (
    assessmentId: number | string,
    imageId: number | string
  ): string => {
    return `/api/assessments/${assessmentId}/images/${imageId}/view`;
  },

  // =========================================================================
  // AI Preliminary Screening & Inference APIs
  // =========================================================================

  screenAssessment: async (
    assessmentId: number | string,
    imageId?: number | string,
    symptoms?: string[]
  ): Promise<InferenceResponse> => {
    const url = imageId
      ? `/assessments/${assessmentId}/images/${imageId}/screen`
      : `/assessments/${assessmentId}/screen`;
    const res = await api.post(url, symptoms ? { symptoms } : undefined);
    return res.data?.data;
  },
};
