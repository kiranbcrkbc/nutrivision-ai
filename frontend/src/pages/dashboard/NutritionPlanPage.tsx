import React from 'react';
import { CalendarDays, Utensils, CheckCircle2, Download } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const NutritionPlanPage: React.FC = () => {
  const days = [
    { day: 'Day 1 (Monday)', breakfast: 'Sprouted moong salad with lemon & pomegranate', lunch: 'Palak dal with 2 multi-grain rotis & fresh curd', snack: 'Roasted chana with small jaggery piece', dinner: 'Mixed vegetable dalia with mint coriander chutney' },
    { day: 'Day 2 (Tuesday)', breakfast: 'Methi thepla with mint raita', lunch: 'Rajma curry with brown rice and cucumber salad', snack: '1 fresh amla with handful of pumpkin seeds', dinner: 'Lauki kofta curry with whole wheat phulkas' },
    { day: 'Day 3 (Wednesday)', breakfast: 'Oatmeal with chia seeds, dates & crushed almonds', lunch: 'Soybean & spinach curry with jeera rice', snack: 'Spiced buttermilk (chaas) with roasted cumin', dinner: 'Tofu/Paneer stir-fry with steamed broccoli & carrots' },
    { day: 'Day 4 (Thursday)', breakfast: 'Besan chilla with grated paneer filling', lunch: 'Chole (chickpea curry) with beetroot roti & salad', snack: 'Fresh orange slices or guava', dinner: 'Moong dal khichdi with roasted papad & curd' },
    { day: 'Day 5 (Friday)', breakfast: 'Poha with roasted peanuts, curry leaves & lemon', lunch: 'Sarson/Palak saag with makki/wheat roti', snack: 'Dry roasted makhana (foxnuts)', dinner: 'Vegetable soup with grilled paneer cubes' },
    { day: 'Day 6 (Saturday)', breakfast: 'Ragi dosa with coconut tomato chutney', lunch: 'Kadhi pakora with steamed rice & spinach stir-fry', snack: 'Mixed seed trail mix (flax, pumpkin, sesame)', dinner: 'Quinoa pulao with mixed legumes & cucumber raita' },
    { day: 'Day 7 (Sunday)', breakfast: 'Vegetable idli with sambar loaded with drumstick leaves', lunch: 'Paneer tikka with mint chutney & whole wheat paratha', snack: 'Fresh seasonal fruit bowl (papaya & pomegranate)', dinner: 'Light moong dal soup with sautéed vegetables' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="7-Day Personalized Nutrition Plan"
        subtitle="A balanced nutrient outline tailored to support dietary iron optimization."
        actions={
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Export PDF Schedule
          </Button>
        }
      />

      <div className="space-y-4">
        {days.map((item, idx) => (
          <Card key={idx} variant="default" className="p-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <h4 className="font-bold text-sm text-health-700 dark:text-health-300 flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                {item.day}
              </h4>
              <Badge variant="health" size="sm">Iron & B-Complex Focus</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="font-bold text-slate-400 block mb-1">Breakfast</span>
                <p className="text-slate-700 dark:text-slate-300">{item.breakfast}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="font-bold text-slate-400 block mb-1">Lunch</span>
                <p className="text-slate-700 dark:text-slate-300">{item.lunch}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="font-bold text-slate-400 block mb-1">Snack</span>
                <p className="text-slate-700 dark:text-slate-300">{item.snack}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="font-bold text-slate-400 block mb-1">Dinner</span>
                <p className="text-slate-700 dark:text-slate-300">{item.dinner}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
