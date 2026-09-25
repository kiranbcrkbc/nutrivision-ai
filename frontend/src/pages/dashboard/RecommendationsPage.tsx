import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Utensils,
  Sparkles,
  ShieldAlert,
  Info,
  CheckCircle2,
  Leaf,
  Globe,
  Star,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import { nutritionService } from '../../services/nutritionService';
import {
  CategoryMetadataDto,
  NutritionRecommendationResponse,
  FoodItemDto,
  DietType,
  FoodRegion
} from '../../types';

export const RecommendationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Healthy_Normal';

  const [categories, setCategories] = useState<CategoryMetadataDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedDiet, setSelectedDiet] = useState<DietType>('ANY');
  const [selectedRegion, setSelectedRegion] = useState<FoodRegion | undefined>(undefined);

  const [recommendations, setRecommendations] = useState<NutritionRecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingFoods, setIsFetchingFoods] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catList = await nutritionService.getCategories();
        setCategories(catList);
      } catch (err: any) {
        setError('Failed to load nutrition categories from database.');
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  // 2. Fetch recommendations whenever category or filters change
  useEffect(() => {
    const loadRecommendations = async () => {
      if (!selectedCategory) return;
      setIsFetchingFoods(true);
      try {
        const data = await nutritionService.getRecommendations(
          selectedCategory,
          selectedDiet === 'ANY' ? undefined : selectedDiet,
          selectedRegion
        );
        setRecommendations(data);
      } catch (err: any) {
        console.error('Failed to fetch food recommendations:', err);
      } finally {
        setIsFetchingFoods(false);
      }
    };

    loadRecommendations();
  }, [selectedCategory, selectedDiet, selectedRegion]);

  const handleCategoryChange = (code: string) => {
    setSelectedCategory(code);
    setSearchParams({ category: code });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading nutrition database..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="Nutritional Guidance & Food Recommendations"
        subtitle="Educational dietary recommendations and culinary food sources mapped to preliminary screening deficiency patterns."
      />

      <MedicalDisclaimer variant="banner" />

      {/* Category Selector Tabs */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Select Screening Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.code;
            return (
              <button
                key={cat.code}
                onClick={() => handleCategoryChange(cat.code)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-health-600 text-white border-health-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-health-600'}`} />
                <span>{cat.displayName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Diet Type Filters */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Dietary Preference</span>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            {(
              [
                { value: 'ANY', label: 'All Diets' },
                { value: 'VEGETARIAN', label: 'Vegetarian 🥬' },
                { value: 'VEGAN', label: 'Vegan 🌱' },
                { value: 'NON_VEGETARIAN', label: 'Non-Veg 🍗' }
              ] as const
            ).map((d) => (
              <button
                key={d.value}
                onClick={() => setSelectedDiet(d.value as DietType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDiet === d.value
                    ? 'bg-health-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Regional Culinary Filters */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Regional Preference</span>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            {(
              [
                { value: undefined, label: 'All Regions 🌍' },
                { value: 'SOUTH_INDIAN', label: 'South Indian 🇮🇳' },
                { value: 'INDIAN', label: 'Pan-Indian 🇮🇳' }
              ] as const
            ).map((r) => (
              <button
                key={r.label}
                onClick={() => setSelectedRegion(r.value as FoodRegion | undefined)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRegion === r.value
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Educational Overview & Biological Importance Card */}
      {recommendations && recommendations.guidance && (
        <Card variant="default" className="p-6 space-y-4 border-l-4 border-l-health-600">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="health" size="md">
                  {recommendations.primaryNutrient}
                </Badge>
                <span className="text-xs text-slate-400">Educational Guidance</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                {recommendations.categoryDisplayName} Nutritional Profile
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {recommendations.guidance.educationalOverview}
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 border border-slate-200/60 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-health-600" />
              <span>Biological Importance:</span>
            </span>
            <p className="text-[11px] leading-relaxed">{recommendations.guidance.biologicalImportance}</p>
          </div>

          {recommendations.guidance.synergyAbsorptionNotes && (
            <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 text-xs text-teal-800 dark:text-teal-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Absorption Synergy & Bioavailability Tip:</span>
              </span>
              <p className="text-[11px] leading-relaxed">{recommendations.guidance.synergyAbsorptionNotes}</p>
            </div>
          )}
        </Card>
      )}

      {/* Recommended Foods Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-health-600" />
            <span>Recommended Dietary Food Sources ({recommendations?.recommendedFoods?.length || 0})</span>
          </h4>
          {isFetchingFoods && <span className="text-xs text-slate-400 italic">Updating suggestions...</span>}
        </div>

        {recommendations?.recommendedFoods?.length === 0 ? (
          <Card variant="default" className="p-8 text-center text-slate-500">
            <p className="text-xs">No food items found matching the selected diet and regional preference filters.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations?.recommendedFoods?.map((food: FoodItemDto) => (
              <Card
                key={food.foodId}
                variant="default"
                className="p-5 flex flex-col justify-between hoverable space-y-3 relative overflow-hidden"
              >
                {food.priority === 1 && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Priority</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-start justify-between pr-14">
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">{food.foodName}</h5>
                      {food.localName && (
                        <span className="text-[11px] text-slate-400 block">Local: {food.localName}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <Badge
                      variant={
                        food.dietType === 'VEGAN'
                          ? 'success'
                          : food.dietType === 'VEGETARIAN'
                          ? 'health'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {food.dietType.replace('_', ' ')}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {food.region.replace('_', ' ')}
                    </Badge>
                  </div>

                  {food.servingSuggestion && (
                    <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <strong className="text-[10px] text-slate-400 block uppercase mb-0.5">Serving Idea:</strong>
                      <span className="text-[11px] leading-snug">{food.servingSuggestion}</span>
                    </div>
                  )}

                  {food.educationalDescription && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {food.educationalDescription}
                    </p>
                  )}

                  {food.absorptionNotes && (
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 italic">
                      💡 {food.absorptionNotes}
                    </p>
                  )}
                </div>

                {food.safetyNote && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                    <span>{food.safetyNote}</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Safety Notice Footer */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 space-y-1">
        <div className="flex items-center gap-2 font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Educational Guidance Disclaimer</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
          {recommendations?.educationalDisclaimer ||
            'These foods are general nutritional suggestions associated with preliminary AI screening categories. This does not replace clinical diagnosis, blood biomarker analysis, or medical treatment.'}
        </p>
      </div>
    </div>
  );
};
