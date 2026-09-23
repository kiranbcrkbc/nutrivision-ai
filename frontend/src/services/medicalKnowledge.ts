/**
 * NutriVision AI - Structured Medical Knowledge & Plain-Language Translation Layer
 *
 * Enforces medical safety rules:
 * - Every medical term has an immediate plain English explanation.
 * - Always clarifies: "Possible nutritional association" — NOT a definitive diagnosis.
 * - Provides realistic, culturally relevant Indian food recommendations.
 * - Includes distinct options for Vegetarian, Vegan, and Non-Vegetarian diets.
 */

export interface SymptomExplanation {
  medicalTerm: string;
  plainEnglishName: string;
  whatItMeans: string;
  whyItMayMatter: string;
  possibleNutritionalAssociation: string;
  whenToSeeDoctor: string;
}

export interface FoodIdea {
  meal: string;
  suggestion: string;
  focus: string;
}

export interface DailyMealPlan {
  day: string;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
}

export interface NutrientProfile {
  code: string;
  nutrientName: string;
  plainName: string;
  primaryBodyPart: string;
  summarySentence: string;
  whatImageMayShow: string;
  plainExplanation: string;
  symptoms: SymptomExplanation[];
  foods: {
    vegetarian: string[];
    vegan: string[];
    nonVegetarian: string[];
  };
  dailyIdeas: FoodIdea[];
  sevenDayPlan: DailyMealPlan[];
  importantNotice: string;
}

export const MEDICAL_KNOWLEDGE_CATALOG: Record<string, NutrientProfile> = {
  Vitamin_B12_Deficiency: {
    code: 'Vitamin_B12_Deficiency',
    nutrientName: 'Vitamin B12 (Cobalamin)',
    plainName: 'Vitamin B12',
    primaryBodyPart: 'TONGUE / MOUTH / SKIN',
    summarySentence: 'Your image shows visual features that may sometimes be associated with Vitamin B12 deficiency.',
    whatImageMayShow: 'Glossitis (Inflamed or Smooth Tongue) / Angular Cheilitis (Cracked Mouth Corners)',
    plainExplanation:
      'The tongue or mouth area appears smoother, redder, or more sensitive than typical healthy tissue. In clinical medicine, this type of surface change is often evaluated alongside nutritional factors, including Vitamin B12 levels.',
    symptoms: [
      {
        medicalTerm: 'Glossitis',
        plainEnglishName: 'Inflamed, swollen, or sore tongue',
        whatItMeans: 'The tiny normal bumps on your tongue (papillae) become swollen or flattened, leaving a tender or glassy surface.',
        whyItMayMatter: 'The tongue lining renews rapidly and often reflects early nutritional changes in B12, folate, or iron.',
        possibleNutritionalAssociation: 'Vitamin B12 or B-Complex deficiency.',
        whenToSeeDoctor: 'If your tongue stays sore, burning, or red for more than 10-14 days.',
      },
      {
        medicalTerm: 'Angular Cheilitis',
        plainEnglishName: 'Cracked or sore corners of the mouth',
        whatItMeans: 'Small red splits, peeling, or irritation at the outer corners where the lips meet.',
        whyItMayMatter: 'Often triggered when moisture gathers in cracked skin, made vulnerable by low Vitamin B2, B12, or iron reserves.',
        possibleNutritionalAssociation: 'Vitamin B12, Riboflavin (B2), or Iron.',
        whenToSeeDoctor: 'If cracking does not heal with simple lip balm or becomes painful.',
      },
      {
        medicalTerm: 'General Pallor & Fatigue',
        plainEnglishName: 'Pale complexion and sluggish energy',
        whatItMeans: 'Reduced blood coloration in lips and inner lower eyelids accompanied by low stamina.',
        whyItMayMatter: 'Vitamin B12 is essential to produce full-sized, functional red blood cells that transport oxygen.',
        possibleNutritionalAssociation: 'Megaloblastic anemia due to low Vitamin B12 or Folate.',
        whenToSeeDoctor: 'If fatigue interferes with daily activities or is accompanied by dizziness.',
      },
    ],
    foods: {
      vegetarian: [
        'Fresh Curd / Dahi (1 cup with lunch or spiced buttermilk / majjige)',
        'Fresh Paneer (75–100g in curries or lightly grilled)',
        'Cow’s Milk (1 glass daily)',
        'Fortified Breakfast Cereals',
      ],
      vegan: [
        'Fortified Soy Milk or Almond Milk (check nutrition label for added B12)',
        'Fortified Nutritional Yeast (1 tablespoon sprinkled over soups, rice, or salads)',
        'Fortified Plant-Based Cereals',
      ],
      nonVegetarian: [
        'Whole Eggs (2 boiled or poached eggs)',
        'Mackerel / Sardines (Bangude / Tarli fish — exceptionally dense in B12)',
        'Chicken Breast or Lean Mutton',
      ],
    },
    dailyIdeas: [
      { meal: 'Breakfast', suggestion: 'Vegetable poha with fresh curd OR 2 whole eggs with brown toast', focus: 'B12 + Energy' },
      { meal: 'Lunch', suggestion: 'Palak paneer with whole wheat rotis and a bowl of fresh dahi', focus: 'Calcium + Cobalamin' },
      { meal: 'Evening Snack', suggestion: 'Spiced buttermilk (chaas) with roasted jeera OR fortified plant milk', focus: 'Hydration + Probiotics' },
      { meal: 'Dinner', suggestion: 'Grilled fish curry OR mixed dal khichdi with curd and cucumber salad', focus: 'Digestive Recovery' },
    ],
    sevenDayPlan: [
      { day: 'Day 1 (Monday)', breakfast: 'Paneer paratha with 1 cup fresh curd', lunch: 'Methi dal with whole wheat phulkas & raita', snack: 'Roasted makhana with buttermilk', dinner: 'Mixed vegetable khichdi with curd & papad' },
      { day: 'Day 2 (Tuesday)', breakfast: 'Sprouted moong salad with lemon & dahi', lunch: 'Fish curry or paneer bhurji with brown rice & salad', snack: 'Fortified soy milk with almonds', dinner: 'Palak dalia with mint curd raita' },
      { day: 'Day 3 (Wednesday)', breakfast: 'Besan chilla filled with grated paneer', lunch: 'Rajma curry with jeera rice & fresh curd', snack: 'Dry roasted peanuts and fresh orange', dinner: 'Lauki kofta with 2 multigrain rotis' },
      { day: 'Day 4 (Thursday)', breakfast: '2 Boiled eggs with whole grain toast OR vegetable idli with sambar', lunch: 'Chole with beetroot roti & cucumber curd', snack: 'Spiced buttermilk with roasted cumin', dinner: 'Grilled paneer or fish with sautéed vegetables' },
      { day: 'Day 5 (Friday)', breakfast: 'Oatmeal cooked with milk, chia seeds, and chopped dates', lunch: 'Mushroom and paneer curry with whole wheat phulkas', snack: 'Handful of walnuts and pumpkin seeds', dinner: 'Yellow moong dal with steamed rice and dahi' },
      { day: 'Day 6 (Saturday)', breakfast: 'Ragi dosa with coconut chutney and milk', lunch: 'Egg curry or soya chunks curry with brown rice', snack: 'Fruit bowl (banana & papaya) with dahi', dinner: 'Quinoa vegetable pulao with cucumber raita' },
      { day: 'Day 7 (Sunday)', breakfast: 'Poha garnished with roasted peanuts, lemon, and curd', lunch: 'South Indian fish curry or paneer tikka with multigrain roti', snack: 'Roasted chana with fresh buttermilk', dinner: 'Light vegetable soup with whole wheat toast' },
    ],
    importantNotice:
      'This preliminary indication does not confirm a Vitamin B12 deficiency. A simple Serum B12 blood test ordered by a doctor can verify your true levels.',
  },

  Iron_Deficiency: {
    code: 'Iron_Deficiency',
    nutrientName: 'Iron (Fe)',
    plainName: 'Iron',
    primaryBodyPart: 'NAILS / EYES / TONGUE',
    summarySentence: 'Your image shows visual features that may sometimes be associated with low iron reserves.',
    whatImageMayShow: 'Koilonychia (Spoon-Shaped Nails) / Conjunctival Pallor (Pale Inner Eyelids)',
    plainExplanation:
      'The nails appear flatter, brittle, or scooped inward, or mucosal areas appear paler than usual. In clinical practice, these visual signs prompt a physician to check red blood cell counts and ferritin.',
    symptoms: [
      {
        medicalTerm: 'Koilonychia',
        plainEnglishName: 'Spoon-shaped concave fingernails',
        whatItMeans: 'Nails become thin, soft, and scooped out in the middle so the edges turn up.',
        whyItMayMatter: 'Classically linked with prolonged low iron levels affecting nail bed keratin formation.',
        possibleNutritionalAssociation: 'Iron deficiency anemia.',
        whenToSeeDoctor: 'If nails remain spooned or continue splitting.',
      },
      {
        medicalTerm: 'Conjunctival Pallor',
        plainEnglishName: 'Pale inner lower eyelid',
        whatItMeans: 'The membrane inside your lower eyelid looks pale pink or white rather than vibrant vascular pink.',
        whyItMayMatter: 'Reflects lower levels of red hemoglobin circulating near the skin surface.',
        possibleNutritionalAssociation: 'Iron deficiency anemia.',
        whenToSeeDoctor: 'If accompanied by dizziness, shortness of breath, or cold hands.',
      },
      {
        medicalTerm: 'Brittle Nails & Hair Shedding',
        plainEnglishName: 'Easily chipping nails and excess hair fall',
        whatItMeans: 'Nails crack easily at edges and hair roots receive less oxygenation.',
        whyItMayMatter: 'Iron is required for cellular oxygen delivery to rapidly dividing follicular cells.',
        possibleNutritionalAssociation: 'Iron or ferritin depletion.',
        whenToSeeDoctor: 'If hair loss is diffuse or nails split into layers.',
      },
    ],
    foods: {
      vegetarian: [
        'Spinach (Palak) and Methi leaves cooked with tomatoes',
        'Lentils (Moong, Masoor, Toor dal) and Chickpeas (Chole)',
        'Pumpkin seeds and Sesame seeds (Til laddu with jaggery)',
        'Poha (flattened rice) squeezed with fresh lemon juice',
        'Beetroot and Pomegranate (Anar)',
      ],
      vegan: [
        'Dark leafy greens (Moringa / Drumstick leaves, spinach, amaranth)',
        'Sprouted legumes and black chana',
        'Raw pumpkin seeds, chia seeds, and black raisins (soaked overnight)',
        'Blackstrap molasses or natural jaggery (Gur)',
      ],
      nonVegetarian: [
        'Whole Eggs (rich in protein and non-heme iron)',
        'Lean Poultry and Fish',
        'Organ meats (such as liver, under clinical advice)',
      ],
    },
    dailyIdeas: [
      { meal: 'Breakfast', suggestion: 'Poha with roasted peanuts, curry leaves, and a generous squeeze of lemon', focus: 'Iron + Vitamin C Synergy' },
      { meal: 'Lunch', suggestion: 'Palak dal with 2 multigrain rotis, fresh salad, and sliced lemon', focus: 'Non-Heme Iron Absorption' },
      { meal: 'Evening Snack', suggestion: 'Roasted black chana with a small piece of organic jaggery (Gur)', focus: 'Traditional Iron Snack' },
      { meal: 'Dinner', suggestion: 'Rajma curry with brown rice and cucumber-tomato kachumber salad', focus: 'Plant-Protein & Iron' },
    ],
    sevenDayPlan: [
      { day: 'Day 1 (Monday)', breakfast: 'Sprouted moong salad with lemon & pomegranate', lunch: 'Palak dal with 2 multi-grain rotis & fresh salad', snack: 'Roasted chana with small jaggery piece', dinner: 'Mixed vegetable dalia with mint coriander chutney' },
      { day: 'Day 2 (Tuesday)', breakfast: 'Methi thepla with mint cucumber raita', lunch: 'Rajma curry with brown rice and cucumber salad', snack: '1 fresh amla with handful of pumpkin seeds', dinner: 'Lauki kofta curry with whole wheat phulkas' },
      { day: 'Day 3 (Wednesday)', breakfast: 'Oatmeal with chia seeds, dates & crushed almonds', lunch: 'Soybean & spinach curry with jeera rice', snack: 'Spiced buttermilk (chaas) with roasted cumin', dinner: 'Tofu/Paneer stir-fry with steamed broccoli & carrots' },
      { day: 'Day 4 (Thursday)', breakfast: 'Besan chilla with grated paneer & chopped spinach', lunch: 'Chole (chickpea curry) with beetroot roti & salad', snack: 'Fresh orange slices or guava', dinner: 'Moong dal khichdi with roasted papad & salad' },
      { day: 'Day 5 (Friday)', breakfast: 'Poha with roasted peanuts, curry leaves & lemon juice', lunch: 'Sarson/Palak saag with makki/wheat roti', snack: 'Dry roasted makhana (foxnuts)', dinner: 'Vegetable soup with grilled paneer or chicken' },
      { day: 'Day 6 (Saturday)', breakfast: 'Ragi dosa with drumstick leaf sambar', lunch: 'Kadhi pakora with steamed rice & spinach stir-fry', snack: 'Mixed seed trail mix (flax, pumpkin, sesame)', dinner: 'Quinoa pulao with mixed legumes & salad' },
      { day: 'Day 7 (Sunday)', breakfast: 'Vegetable idli with sambar loaded with drumstick leaves', lunch: 'Paneer tikka or fish curry with mint chutney & paratha', snack: 'Fresh seasonal fruit bowl (papaya & pomegranate)', dinner: 'Light moong dal soup with sautéed vegetables' },
    ],
    importantNotice:
      'This preliminary result does not confirm iron deficiency or anemia. A standard Complete Blood Count (CBC) and Serum Ferritin test ordered by a doctor is needed for confirmation.',
  },

  Vitamin_C_Deficiency: {
    code: 'Vitamin_C_Deficiency',
    nutrientName: 'Vitamin C (L-Ascorbic Acid)',
    plainName: 'Vitamin C',
    primaryBodyPart: 'SKIN / LIPS / GUMS',
    summarySentence: 'Your image displays surface patterns that may be associated with low Vitamin C intake.',
    whatImageMayShow: 'Petechiae (Tiny Red Surface Spots) / Gum Irritation / Slow Healing',
    plainExplanation:
      'The skin or visible mucous membranes show small reddish spots, minor irritation, or dryness. Vitamin C is vital for collagen synthesis, so low levels can affect small capillaries and tissue elasticity.',
    symptoms: [
      {
        medicalTerm: 'Perifollicular Petechiae',
        plainEnglishName: 'Tiny pinpoint red or purple skin dots',
        whatItMeans: 'Microscopic red spots that appear around hair follicles due to fragile capillary walls.',
        whyItMayMatter: 'Without sufficient Vitamin C, blood vessel walls lose collagen strength and bleed slightly under skin.',
        possibleNutritionalAssociation: 'Vitamin C (Ascorbic Acid) deficiency.',
        whenToSeeDoctor: 'If red spots spread rapidly or appear alongside joint aches.',
      },
      {
        medicalTerm: 'Gingival Bleeding',
        plainEnglishName: 'Tender gums that bleed easily',
        whatItMeans: 'Gums bleed when brushing or flossing despite gentle technique.',
        whyItMayMatter: 'Collagen weakness in periodontal tissues.',
        possibleNutritionalAssociation: 'Vitamin C deficiency or dental plaque.',
        whenToSeeDoctor: 'If bleeding persists after gentle dental cleaning.',
      },
      {
        medicalTerm: 'Slow Wound Healing',
        plainEnglishName: 'Cuts or scrapes taking a long time to heal',
        whatItMeans: 'Scrapes, razor cuts, or scratches stay red and open longer than normal.',
        whyItMayMatter: 'Vitamin C is mandatory for fibroblasts to create fresh repair collagen.',
        possibleNutritionalAssociation: 'Vitamin C or Zinc deficiency.',
        whenToSeeDoctor: 'If any skin cut shows signs of infection like warmth or pus.',
      },
    ],
    foods: {
      vegetarian: [
        'Fresh Indian Gooseberry (Amla) — 1 amla provides your entire daily Vitamin C requirement!',
        'Fresh Guavas (Amrood) — higher Vitamin C per gram than oranges!',
        'Oranges, Lemons, Sweet Lime (Mosambi)',
        'Bell Peppers / Capsicum (green, yellow, and red)',
        'Tomatoes and fresh coriander/mint chutneys',
      ],
      vegan: [
        'Fresh Amla juice or raw amla with pinch of black salt',
        'Fresh ripe Papaya and Kiwi',
        'Raw sprouted legumes with lime juice',
        'Strawberries and raw cabbage slaw',
      ],
      nonVegetarian: [
        'All fresh citrus fruits, guavas, and bell peppers (Vitamin C is entirely plant-derived)',
        'Pair fresh citrus with lean poultry or fish to maximize iron absorption',
      ],
    },
    dailyIdeas: [
      { meal: 'Breakfast', suggestion: 'Warm lemon water followed by vegetable poha squeezed with fresh lime', focus: 'Morning Antioxidant Boost' },
      { meal: 'Lunch', suggestion: 'Dal and roti accompanied by a fresh tomato-cucumber salad and 1 fresh guava', focus: 'Collagen Synthesis' },
      { meal: 'Evening Snack', suggestion: '1 fresh amla with black salt OR fresh orange slices', focus: 'Daily Bioavailable C' },
      { meal: 'Dinner', suggestion: 'Stir-fried capsicum, broccoli, and paneer/tofu with whole grain phulkas', focus: 'Thermal-Gentle Prep' },
    ],
    sevenDayPlan: [
      { day: 'Day 1 (Monday)', breakfast: 'Fresh orange slices with oats porridge', lunch: 'Capsicum & paneer curry with whole wheat rotis & tomato salad', snack: '1 fresh amla with black pepper', dinner: 'Moong dal with lemon squeeze & steamed rice' },
      { day: 'Day 2 (Tuesday)', breakfast: 'Besan chilla with grated capsicum & tomatoes', lunch: 'Sprouted black chana with raw mango & lemon', snack: 'Guava slices with chaat masala', dinner: 'Mixed vegetable stew with brown rice' },
      { day: 'Day 3 (Wednesday)', breakfast: 'Papaya bowl with pumpkin seeds & lemon zest', lunch: 'Dal palak with phulkas & raw cabbage salad', snack: 'Fresh sweet lime (mosambi) juice', dinner: 'Grilled paneer or chicken with bell peppers' },
      { day: 'Day 4 (Thursday)', breakfast: 'Vegetable upma with lemon and tomato chutney', lunch: 'Rajma with brown rice and fresh kachumber salad', snack: 'Kiwi or orange fruit cup', dinner: 'Tomato-lentil soup with warm rotis' },
      { day: 'Day 5 (Friday)', breakfast: 'Amla-ginger shot followed by vegetable idli', lunch: 'Broccoli & paneer stir fry with whole grain paratha', snack: 'Handful of roasted almonds & amla murabba', dinner: 'Khichdi served with fresh lime pickle & curd' },
      { day: 'Day 6 (Saturday)', breakfast: 'Poha with peas, carrots, coriander & lime', lunch: 'Toor dal with raw tomato chutney & rotis', snack: 'Sliced ripe guava or strawberries', dinner: 'Vegetable pulao with cucumber-lemon raita' },
      { day: 'Day 7 (Sunday)', breakfast: 'Fruit smoothie with orange, papaya & mint', lunch: 'Paneer or fish tikka with bell peppers & lemon', snack: 'Roasted makhana with amla juice', dinner: 'Clear vegetable broth with garlic & steamed greens' },
    ],
    importantNotice:
      'This preliminary result does not confirm Vitamin C deficiency. Severe deficiency (scurvy) is rare in diverse diets. Consult a doctor if skin bruising or bleeding continues.',
  },

  Vitamin_A_Deficiency: {
    code: 'Vitamin_A_Deficiency',
    nutrientName: 'Vitamin A (Carotenoids & Retinol)',
    plainName: 'Vitamin A',
    primaryBodyPart: 'EYES / SKIN',
    summarySentence: 'Your image shows visual features that may sometimes be linked with low Vitamin A levels.',
    whatImageMayShow: 'Ocular Dryness / Follicular Hyperkeratosis (Rough "Goosebump" Skin)',
    plainExplanation:
      'The eye surface appears dry or irritated, or skin shows small rough bumps resembling permanent goosebumps. Vitamin A is essential for keeping mucosal surfaces lubricated and epithelial cells smooth.',
    symptoms: [
      {
        medicalTerm: 'Xerophthalmia',
        plainEnglishName: 'Dry, gritty ocular surface',
        whatItMeans: 'The tears cannot keep the eye surface moist, leaving a dry, scratchy sensation.',
        whyItMayMatter: 'Vitamin A maintains the goblet cells that produce the protective tear film layer.',
        possibleNutritionalAssociation: 'Vitamin A deficiency.',
        whenToSeeDoctor: 'Immediately if eye pain, cloudiness, or night vision problems occur.',
      },
      {
        medicalTerm: 'Follicular Hyperkeratosis',
        plainEnglishName: 'Rough, sandpaper-like "goosebump" bumps on skin',
        whatItMeans: 'Excess hard keratin plugs form inside hair follicles on arms or thighs.',
        whyItMayMatter: 'Without sufficient Vitamin A, skin cells produce hard keratin instead of shed smoothly.',
        possibleNutritionalAssociation: 'Vitamin A, Vitamin C, or Essential Fatty Acid deficiency.',
        whenToSeeDoctor: 'If bumps are inflamed, itchy, or spreading.',
      },
      {
        medicalTerm: 'Nyctalopia',
        plainEnglishName: 'Difficulty seeing in dim light or at night',
        whatItMeans: 'Vision takes a very long time to adjust when walking into a darker room or driving at night.',
        whyItMayMatter: 'Rhodopsin, the light-absorbing pigment in retinal rod cells, requires Vitamin A.',
        possibleNutritionalAssociation: 'Vitamin A deficiency.',
        whenToSeeDoctor: 'Promptly consult an ophthalmologist for any visual changes.',
      },
    ],
    foods: {
      vegetarian: [
        'Carrots (Gajar) — cooked with a little ghee or oil to enhance beta-carotene absorption',
        'Sweet Potatoes (Shakarkandi)',
        'Ripe Papaya and Ripe Mangoes',
        'Pumpkin (Kaddu) and Drumstick Leaves (Moringa)',
        'Cow’s Milk, Pure Ghee, and Butter in moderation',
      ],
      vegan: [
        'Bright orange vegetables: carrots, pumpkins, sweet potatoes',
        'Dark green leafy vegetables: spinach, fenugreek (methi), sarson',
        'Ripe papaya and cantaloupe melon',
      ],
      nonVegetarian: [
        'Whole Eggs (egg yolk contains preformed Vitamin A retinol)',
        'Fish Liver Oil (under clinical medical supervision only)',
        'Dairy products like cheese and whole milk',
      ],
    },
    dailyIdeas: [
      { meal: 'Breakfast', suggestion: 'Warm oatmeal topped with ripe papaya cubes and crushed walnuts', focus: 'Beta-Carotene + Healthy Fats' },
      { meal: 'Lunch', suggestion: 'Gajar-methi sabzi with 2 whole wheat rotis and a spoonful of fresh curd', focus: 'Fat-Soluble Absorption' },
      { meal: 'Evening Snack', suggestion: 'Steamed sweet potato cubes sprinkled with chaat masala and lime', focus: 'Carotenoid Riches' },
      { meal: 'Dinner', suggestion: 'Yellow pumpkin soup with multigrain toast and sautéed spinach', focus: 'Gentle Evening Nourishment' },
    ],
    sevenDayPlan: [
      { day: 'Day 1 (Monday)', breakfast: 'Papaya slices with chia seeds & milk', lunch: 'Gajar-methi curry with whole wheat rotis & curd', snack: 'Steamed sweet potato with lemon', dinner: 'Pumpkin soup with multigrain toast' },
      { day: 'Day 2 (Tuesday)', breakfast: 'Carrot and methi paratha with fresh dahi', lunch: 'Palak dal with steamed brown rice & salad', snack: 'A handful of dried apricots and almonds', dinner: 'Mixed vegetable sabzi with phulkas' },
      { day: 'Day 3 (Wednesday)', breakfast: 'Egg omelette with tomatoes & spinach OR poha with carrots', lunch: 'Kadhi with pakoras, spinach stir fry & rice', snack: 'Ripe mango or papaya cubes', dinner: 'Lauki & carrot khichdi with curd' },
      { day: 'Day 4 (Thursday)', breakfast: 'Besan chilla with finely grated carrots', lunch: 'Rajma with carrot-cucumber salad and rotis', snack: 'Roasted pumpkin seeds & raisins', dinner: 'Drumstick leaf (moringa) dal with phulkas' },
      { day: 'Day 5 (Friday)', breakfast: 'Oatmeal with grated carrot, cinnamon & walnuts', lunch: 'Chole with pumpkin sabzi & wheat rotis', snack: 'Spiced buttermilk with mint', dinner: 'Moong dal with sautéed greens & rice' },
      { day: 'Day 6 (Saturday)', breakfast: 'Vegetable idli with carrot sambar', lunch: 'Paneer or egg curry with steamed carrots & rice', snack: 'Fresh carrot sticks with hummus or dahi dip', dinner: 'Vegetable dalia with ghee drop' },
      { day: 'Day 7 (Sunday)', breakfast: 'Smoothie with mango/papaya, yogurt & flaxseeds', lunch: 'Fish curry or paneer tikka with green salad', snack: 'Roasted makhana and pumpkin seeds', dinner: 'Light spinach soup with toasted bread' },
    ],
    importantNotice:
      'This is an educational indication only and not a diagnostic test. High-dose Vitamin A supplements should never be taken without a prescription as Vitamin A can accumulate in the liver.',
  },

  Zinc_Deficiency: {
    code: 'Zinc_Deficiency',
    nutrientName: 'Zinc (Zn)',
    plainName: 'Zinc',
    primaryBodyPart: 'NAILS / HAIR / SKIN',
    summarySentence: 'Your image displays visual patterns that may sometimes correlate with low zinc availability.',
    whatImageMayShow: 'Leukonychia (White Spots on Nails) / Diffuse Thinning / Skin Dryness',
    plainExplanation:
      'The nails exhibit small white spots or bands, or the hair/skin shows dryness or minor scaling. Zinc is an essential cofactor for over 300 enzymes responsible for cell division and protein structure.',
    symptoms: [
      {
        medicalTerm: 'Punctate Leukonychia',
        plainEnglishName: 'White spots or horizontal bands on fingernails',
        whatItMeans: 'Small chalky white spots or bands that grow outward with the nail plate.',
        whyItMayMatter: 'Often caused by minor matrix trauma or temporary zinc/mineral fluctuations during nail growth.',
        possibleNutritionalAssociation: 'Zinc or mineral cofactor fluctuations.',
        whenToSeeDoctor: 'If all nails develop opaque white bands or lines.',
      },
      {
        medicalTerm: 'Telogen Effluvium / Thinning',
        plainEnglishName: 'Diffuse hair shedding',
        whatItMeans: 'Hair sheds evenly across the scalp rather than in localized bald patches.',
        whyItMayMatter: 'Zinc is required for hair follicle protein synthesis and cellular repair.',
        possibleNutritionalAssociation: 'Zinc, Iron, or Protein insufficiency.',
        whenToSeeDoctor: 'If hair shedding persists for more than 2-3 months.',
      },
      {
        medicalTerm: 'Delayed Cutaneous Repair',
        plainEnglishName: 'Slow skin healing & minor blemishes',
        whatItMeans: 'Minor scratches or blemishes take longer than usual to resolve.',
        whyItMayMatter: 'Zinc is fundamental for immune cell response and collagen stabilization.',
        possibleNutritionalAssociation: 'Zinc deficiency.',
        whenToSeeDoctor: 'If skin lesions become inflamed or show signs of infection.',
      },
    ],
    foods: {
      vegetarian: [
        'Pumpkin Seeds (Kaddu ke beej) — top natural vegetarian zinc source!',
        'Watermelon Seeds and White Sesame Seeds (Til)',
        'Chickpeas (Kabuli Chana), Black Chana, and Kidney Beans (Rajma)',
        'Paneer, Curd, and Cow’s Milk',
        'Cashews and Almonds',
      ],
      vegan: [
        'Raw pumpkin seeds, hemp seeds, and sesame seeds',
        'Lentils, sprouted moong, and chickpeas',
        'Oats, quinoa, and whole wheat rotis',
        'Dark chocolate / cocoa powder in moderation',
      ],
      nonVegetarian: [
        'Eggs (whole eggs contain zinc in the yolk)',
        'Lean Chicken and Fish',
        'Seafood (Crab and prawns are naturally rich in zinc)',
      ],
    },
    dailyIdeas: [
      { meal: 'Breakfast', suggestion: 'Oatmeal topped with 2 tablespoons of raw pumpkin seeds and chia seeds', focus: 'Trace Mineral Power' },
      { meal: 'Lunch', suggestion: 'Kabuli chana (chickpea) curry with whole wheat rotis and fresh curd', focus: 'Plant Zinc + Protein' },
      { meal: 'Evening Snack', suggestion: 'Handful of roasted pumpkin seeds and cashews with warm herbal tea', focus: 'Natural Bio-available Zinc' },
      { meal: 'Dinner', suggestion: 'Dal tadka with steamed brown rice and paneer / tofu stir-fry', focus: 'Cellular Restoration' },
    ],
    sevenDayPlan: [
      { day: 'Day 1 (Monday)', breakfast: 'Oatmeal with 2 tbsp pumpkin seeds & almonds', lunch: 'Kabuli chana curry with whole wheat rotis & salad', snack: 'Roasted watermelon seeds & cashews', dinner: 'Dal tadka with steamed rice & paneer stir fry' },
      { day: 'Day 2 (Tuesday)', breakfast: 'Besan chilla with crushed sesame seeds', lunch: 'Rajma curry with brown rice and cucumber raita', snack: 'Roasted makhana with pumpkin seeds', dinner: 'Mixed vegetable sabzi with phulkas' },
      { day: 'Day 3 (Wednesday)', breakfast: '2 Boiled eggs with toast OR ragi dosa with chutney', lunch: 'Palak dal with rotis and paneer bhurji', snack: 'Handful of walnuts and pumpkin seeds', dinner: 'Quinoa pulao with chickpeas and salad' },
      { day: 'Day 4 (Thursday)', breakfast: 'Sprouted black chana chaat with lemon & cucumber', lunch: 'Chole with multigrain paratha & dahi', snack: 'Dry roasted peanuts and sesame til laddu', dinner: 'Moong dal khichdi with roasted papad' },
      { day: 'Day 5 (Friday)', breakfast: 'Poha with extra peanuts, peas & lemon', lunch: 'Mushroom & paneer curry with whole wheat rotis', snack: 'Spiced buttermilk with roasted cumin', dinner: 'Yellow dal with steamed rice & spinach' },
      { day: 'Day 6 (Saturday)', breakfast: 'Vegetable upma with roasted cashews & seeds', lunch: 'Soya chunks curry with brown rice & salad', snack: 'Fresh fruit bowl topped with chia & pumpkin seeds', dinner: 'Tofu or chicken stir fry with vegetables' },
      { day: 'Day 7 (Sunday)', breakfast: 'Paneer paratha with mint chutney and curd', lunch: 'Fish curry or paneer tikka with rotis & salad', snack: 'Roasted chana with small jaggery piece', dinner: 'Light vegetable soup with multigrain toast' },
    ],
    importantNotice:
      'This preliminary result does not confirm zinc deficiency. Many nail spots are caused by accidental pressure or minor knocks to the nail base. Consult a physician for persistent symptoms.',
  },

  Healthy_Normal: {
    code: 'Healthy_Normal',
    nutrientName: 'Balanced Micronutrients',
    plainName: 'Healthy Baseline',
    primaryBodyPart: 'ALL REGIONS',
    summarySentence: 'Your image reflects healthy tissue coloration and smooth surface morphology.',
    whatImageMayShow: 'Healthy Tissue / No Prominent Deficiency Pattern Detected',
    plainExplanation:
      'The photographed area shows normal vascularization, healthy tissue pinkness, and smooth surface texture without prominent visual indicators of nutritional depletion.',
    symptoms: [
      {
        medicalTerm: 'Eutrophic Tissue',
        plainEnglishName: 'Healthy, well-nourished tissue',
        whatItMeans: 'Smooth, unbroken skin and nail surfaces with normal capillary blood flow.',
        whyItMayMatter: 'Reflects adequate systemic nutrition and regular cell renewal.',
        possibleNutritionalAssociation: 'Adequate nutrient balance.',
        whenToSeeDoctor: 'Continue routine annual health screenings.',
      },
    ],
    foods: {
      vegetarian: [
        'Maintain a colorful "rainbow plate" daily (greens, reds, yellows, whites)',
        'Fresh dahi, paneer, and milk',
        'Seasonal fruits (amla, oranges, bananas, papaya)',
        'Lentils, whole grains, and a handful of mixed seeds daily',
      ],
      vegan: [
        'Diverse plant-based proteins: lentils, chickpeas, tofu, beans',
        'Fortified plant milks for Vitamin B12 and Vitamin D',
        'Generous greens, nuts, and pumpkin/chia seeds',
      ],
      nonVegetarian: [
        'Eggs, fish, and lean meats balanced with plenty of fiber-rich vegetables and whole grains',
      ],
    },
    dailyIdeas: [
      { meal: 'Breakfast', suggestion: 'Vegetable poha or oats with nuts and seasonal fruit', focus: 'Sustained Energy' },
      { meal: 'Lunch', suggestion: 'Dal, whole grain roti, seasonal sabzi, and a cup of fresh curd', focus: 'Balanced Macronutrients' },
      { meal: 'Evening Snack', suggestion: 'Spiced chaas or a handful of roasted seeds', focus: 'Micro-Nutrition' },
      { meal: 'Dinner', suggestion: 'Light vegetable khichdi or grilled paneer/fish with salad', focus: 'Digestive Rest' },
    ],
    sevenDayPlan: [
      { day: 'Day 1 (Monday)', breakfast: 'Oatmeal with nuts & banana', lunch: 'Dal with rotis, sabzi & fresh dahi', snack: 'Roasted makhana', dinner: 'Vegetable khichdi with papad' },
      { day: 'Day 2 (Tuesday)', breakfast: 'Poha with roasted peanuts & lime', lunch: 'Rajma with brown rice & salad', snack: 'Fresh seasonal fruit', dinner: 'Palak dalia with curd' },
      { day: 'Day 3 (Wednesday)', breakfast: 'Besan chilla with paneer', lunch: 'Chole with wheat rotis & cucumber raita', snack: 'Spiced buttermilk', dinner: 'Lauki kofta with phulkas' },
      { day: 'Day 4 (Thursday)', breakfast: 'Sprouted moong chaat with lemon', lunch: 'Methi dal with steamed rice & salad', snack: 'Mixed seed trail mix', dinner: 'Paneer stir fry with rotis' },
      { day: 'Day 5 (Friday)', breakfast: 'Vegetable idli with sambar', lunch: 'Soya curry with jeera rice & dahi', snack: 'Handful of roasted chana', dinner: 'Yellow moong dal with phulkas' },
      { day: 'Day 6 (Saturday)', breakfast: 'Ragi dosa with coconut chutney', lunch: 'Kadhi with rice & green beans sabzi', snack: 'Guava or orange slices', dinner: 'Quinoa pulao with salad' },
      { day: 'Day 7 (Sunday)', breakfast: 'Paneer paratha with curd', lunch: 'Fish curry or paneer tikka with rotis', snack: 'Amla juice or tea with nuts', dinner: 'Light vegetable soup with toast' },
    ],
    importantNotice:
      'A normal visual screening does not guarantee optimal nutrient levels. If you experience internal symptoms like chronic fatigue or hair fall, please consult your physician for a routine wellness blood panel.',
  },
};

/**
 * Normalizes model class codes (e.g., "Iron_Deficiency", "Vitamin_B12_Deficiency")
 * to the knowledge catalog profile.
 */
export function getNutrientProfile(categoryCode?: string): NutrientProfile {
  if (!categoryCode) {
    return MEDICAL_KNOWLEDGE_CATALOG.Healthy_Normal;
  }

  // Exact match
  if (MEDICAL_KNOWLEDGE_CATALOG[categoryCode]) {
    return MEDICAL_KNOWLEDGE_CATALOG[categoryCode];
  }

  const clean = categoryCode.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (clean.includes('b12') || clean.includes('cobalamin')) {
    return MEDICAL_KNOWLEDGE_CATALOG.Vitamin_B12_Deficiency;
  }
  if (clean.includes('iron') || clean.includes('ferritin') || clean.includes('anemia')) {
    return MEDICAL_KNOWLEDGE_CATALOG.Iron_Deficiency;
  }
  if (clean.includes('vitaminc') || clean.includes('ascorbic') || clean.includes('scurvy')) {
    return MEDICAL_KNOWLEDGE_CATALOG.Vitamin_C_Deficiency;
  }
  if (clean.includes('vitamina') || clean.includes('retinol') || clean.includes('xerophthalmia')) {
    return MEDICAL_KNOWLEDGE_CATALOG.Vitamin_A_Deficiency;
  }
  if (clean.includes('zinc') || clean.includes('leukonychia')) {
    return MEDICAL_KNOWLEDGE_CATALOG.Zinc_Deficiency;
  }

  return MEDICAL_KNOWLEDGE_CATALOG.Healthy_Normal;
}

/**
 * Converts technical confidence into a human-friendly assessment level.
 */
export function formatHumanConfidence(confidence?: number): {
  label: string;
  badgeVariant: 'success' | 'warning' | 'info' | 'danger';
  description: string;
} {
  const conf = confidence ?? 0.5;

  if (conf >= 0.75) {
    return {
      label: 'High Visual Match',
      badgeVariant: 'success',
      description: 'The visual pattern in the photo strongly matches training patterns for this category.',
    };
  } else if (conf >= 0.45) {
    return {
      label: 'Moderate Visual Indication',
      badgeVariant: 'warning',
      description: 'Notable visual features are present, but visual appearance alone is preliminary.',
    };
  } else {
    return {
      label: 'Preliminary Indication',
      badgeVariant: 'info',
      description: 'Subtle visual markers detected; photo clarity or lighting may affect analysis.',
    };
  }
}
