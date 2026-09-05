import { api } from './api';
import {
  CategoryMetadataDto,
  NutrientGuidanceDto,
  NutritionRecommendationResponse,
  DietType,
  FoodRegion,
} from '../types';

export const nutritionService = {
  /**
   * Retrieves all supported deficiency categories and their primary nutrients.
   */
  getCategories: async (): Promise<CategoryMetadataDto[]> => {
    const res = await api.get('/nutrition/categories');
    return res.data?.data || [];
  },

  /**
   * Retrieves educational nutrient guidance for a category.
   */
  getGuidance: async (category: string): Promise<NutrientGuidanceDto> => {
    const res = await api.get(`/nutrition/guidance/${encodeURIComponent(category)}`);
    return res.data?.data;
  },

  /**
   * Retrieves priority-ranked dietary food recommendations with optional diet & region filters.
   */
  getRecommendations: async (
    category: string,
    dietType?: DietType,
    region?: FoodRegion
  ): Promise<NutritionRecommendationResponse> => {
    const params: Record<string, string> = {};
    if (dietType && dietType !== 'ANY') params.dietType = dietType;
    if (region) params.region = region;

    const res = await api.get(`/nutrition/recommendations/${encodeURIComponent(category)}`, { params });
    return res.data?.data;
  },

  /**
   * Retrieves dietary recommendations directly linked to an existing assessment.
   */
  getRecommendationsForAssessment: async (
    assessmentId: number | string,
    dietType?: DietType,
    region?: FoodRegion
  ): Promise<NutritionRecommendationResponse> => {
    const params: Record<string, string> = {};
    if (dietType && dietType !== 'ANY') params.dietType = dietType;
    if (region) params.region = region;

    const res = await api.get(`/nutrition/assessment/${assessmentId}`, { params });
    return res.data?.data;
  },
};
