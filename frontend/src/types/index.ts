// ==============================================================================
// Vitamin Deficiency - Core TypeScript Types
// ==============================================================================

export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export type BodyPart = 'SKIN' | 'EYES' | 'TONGUE' | 'LIPS' | 'NAILS' | 'HAIR' | 'FACE';

export type SeverityRiskLevel = 'LOW_CONCERN' | 'MODERATE_CONCERN' | 'NEEDS_MEDICAL_EVALUATION';

export type AssessmentStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type DietType = 'VEGETARIAN' | 'NON_VEGETARIAN' | 'VEGAN' | 'REGIONAL' | 'ANY';

export interface User {
  userId: number;
  email: string;
  fullName: string;
  role: Role;
  age?: number;
  gender?: string;
  dietaryPreference?: DietType;
  preferredLanguage?: string;
  city?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface PredictionItem {
  rank: number;
  categoryCode?: string;
  deficiencyCategory: string;
  modelConfidence: number; // 0.0 to 1.0
  confidencePercentage: string; // e.g. "82.4%"
  possiblePatternDescription?: string;
}

export interface InferenceResponse {
  contentEvaluation?: { status: string; detectedBodyPart?: string; message: string };
  reportedSymptoms?: string[];
  status: 'SUCCESS' | 'QUALITY_REJECTED' | 'MODEL_NOT_AVAILABLE' | 'ERROR' | 'SERVICE_UNAVAILABLE' | 'SCREENING_UNAVAILABLE' | 'INVALID_BODY_PART' | 'IMAGE_REJECTED' | 'CONTENT_CHECK_UNAVAILABLE';
  modelAvailable: boolean;
  modelStatus: string;
  inferenceStatus: string;
  modelName?: string;
  modelVersion?: string;
  targetBodyPart?: BodyPart | string;
  qualityEvaluation?: {
    qualityStatus: 'PENDING' | 'PASSED' | 'REJECTED' | 'WARNING';
    blurScore?: number;
    brightnessScore?: number;
    rejectionReason?: string;
  };
  predictions: PredictionItem[];
  topPrediction?: PredictionItem;
  explainabilityStatus?: string;
  gradcamPath?: string;
  message?: string;
  medicalDisclaimer?: string;
}


export interface AssessmentImage {
  imageId: number;
  filePath?: string;
  originalFilename: string;
  fileSizeBytes?: number;
  mimeType?: string;
  qualityStatus: 'PENDING' | 'PASSED' | 'REJECTED' | 'WARNING';
  blurScore?: number;
  brightnessScore?: number;
  rejectionReason?: string;
  uploadedAt?: string;
}

export interface Assessment {
  screeningResult?: InferenceResponse;
  assessmentId: number;
  userId?: number;
  userFullName?: string;
  targetBodyPart: BodyPart;
  status: AssessmentStatus;
  severityRiskLevel?: SeverityRiskLevel | string;
  images?: AssessmentImage[];
  createdAt: string;
  completedAt?: string;
}

export interface AssessmentSummary {
  assessmentId: number;
  targetBodyPart: BodyPart;
  status: AssessmentStatus;
  severityRiskLevel?: SeverityRiskLevel | string;
  imageCount?: number;
  createdAt: string;
  completedAt?: string;
  topPrediction?: string;
  modelConfidence?: number;
}

export type FoodRegion = 'INDIAN' | 'SOUTH_INDIAN' | 'GENERAL';

export interface FoodItemDto {
  foodId: number;
  category: string;
  nutrientName: string;
  foodName: string;
  localName?: string;
  dietType: 'VEGETARIAN' | 'VEGAN' | 'NON_VEGETARIAN';
  region: FoodRegion;
  servingSuggestion?: string;
  educationalDescription?: string;
  absorptionNotes?: string;
  safetyNote?: string;
  priority: number;
}

export interface NutrientGuidanceDto {
  category: string;
  nutrientName: string;
  educationalOverview: string;
  biologicalImportance: string;
  synergyAbsorptionNotes?: string;
  safetyDisclaimer?: string;
}

export interface CategoryMetadataDto {
  code: string;
  displayName: string;
  primaryNutrient: string;
  description: string;
}

export interface NutritionRecommendationResponse {
  screeningCategory: string;
  categoryDisplayName: string;
  primaryNutrient: string;
  appliedDietFilter?: DietType;
  appliedRegionFilter?: FoodRegion;
  guidance?: NutrientGuidanceDto;
  recommendedFoods: FoodItemDto[];
  priorityFoods: FoodItemDto[];
  vegetarianFoods: FoodItemDto[];
  veganFoods: FoodItemDto[];
  nonVegetarianFoods: FoodItemDto[];
  regionalIndianFoods: FoodItemDto[];
  absorptionSynergySummary?: string;
  educationalDisclaimer?: string;
}

export interface FoodRecommendationItem {
  foodItemName: string;
  richNutrient: string;
  servingSuggestion: string;
  regionalAvailability: string;
}


export interface AnalyticsModelTelemetry {
  modelName: string;
  modelVersion: string;
  framework: string;
  runtimeEnvironment: string;
  modelStatus: string;
  architecture: string;
  validationDatasetNote: string;
}

export interface DashboardAnalytics {
  totalAssessments: number;
  completedAssessments: number;
  inProgressAssessments: number;
  totalImagesUploaded: number;
  qualityStatusCounts: Record<string, number>;
  bodyPartDistribution: Record<string, number>;
  modelTelemetry: AnalyticsModelTelemetry;
  recentAssessments: AssessmentSummary[];
}

export interface ServiceHealth {
  frontend: 'UP' | 'DOWN';
  backend: 'UP' | 'DOWN' | 'CHECKING';
  database: 'UP' | 'DOWN' | 'UNKNOWN';
  aiService: 'UP' | 'DOWN' | 'CHECKING';
  aiModelStatus: 'loaded' | 'not_loaded' | 'unknown';
  backendMessage?: string;
  aiMessage?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  durationMs?: number;
}
