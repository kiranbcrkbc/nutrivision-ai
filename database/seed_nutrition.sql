-- ==============================================================================
-- NutriVision AI - Seed Data: Curated Food Recommendations & Nutrition Matrix
-- Maps deficiency categories to dietary-filtered food suggestions
-- ==============================================================================

USE nutrivision_db;

INSERT INTO food_recommendations (deficiency_category, diet_type, food_item_name, rich_nutrient, serving_suggestion, regional_availability) VALUES
-- Iron Deficiency
('IRON_DEFICIENCY', 'VEGETARIAN', 'Spinach and Dark Leafy Greens (Palak/Methi)', 'Non-heme Iron, Folate', '1-2 cups cooked daily, paired with lemon juice (Vitamin C) to boost absorption', 'Abundantly available across India'),
('IRON_DEFICIENCY', 'VEGETARIAN', 'Lentils, Chickpeas & Kidney Beans (Dal/Rajma/Chana)', 'Iron, Plant Protein, Zinc', '1-2 bowls cooked with meals', 'All Indian states'),
('IRON_DEFICIENCY', 'VEGETARIAN', 'Organic Jaggery (Gur) & Roasted Gram', 'Iron, Trace Minerals', 'Small piece (20g) with roasted chana as evening snack', 'Everywhere in India'),
('IRON_DEFICIENCY', 'NON_VEGETARIAN', 'Poultry / Lean Chicken & Eggs', 'Heme Iron, Vitamin B12, High-quality Protein', '2 boiled eggs or 150g grilled/curry chicken', 'Widely available'),
('IRON_DEFICIENCY', 'NON_VEGETARIAN', 'Freshwater / Sea Fish', 'Heme Iron, Omega-3 Fatty Acids', '100-150g steamed or light curry 2-3 times/week', 'Coastal & urban regions'),
('IRON_DEFICIENCY', 'VEGAN', 'Pumpkin Seeds, Sesame (Til) & Flaxseeds', 'Iron, Magnesium, Essential Fatty Acids', '1-2 tablespoons roasted seeds added to salads or smoothies', 'Supermarkets & local grocers'),

-- Vitamin A Deficiency
('VITAMIN_A', 'VEGETARIAN', 'Carrots (Gajar) & Sweet Potatoes (Shakarkand)', 'Beta-Carotene (Pro-Vitamin A)', '1 medium carrot raw or lightly steamed with a drop of healthy fat', 'Winter seasonal & year-round'),
('VITAMIN_A', 'VEGETARIAN', 'Ripe Papaya & Mangoes', 'Beta-Carotene, Vitamin C', '1 bowl fresh sliced fruit as mid-morning snack', 'Abundant in India'),
('VITAMIN_A', 'VEGETARIAN', 'Whole Milk, Paneer & Fortified Ghee', 'Retinol (Preformed Vitamin A)', '1 glass warm milk or 50g fresh paneer', 'Universal staple'),
('VITAMIN_A', 'NON_VEGETARIAN', 'Egg Yolks', 'Active Retinol, Choline', '1-2 whole eggs prepared to preference', 'Universal staple'),
('VITAMIN_A', 'VEGAN', 'Drumstick Leaves (Moringa) & Curry Leaves', 'High Beta-Carotene, Iron, Calcium', 'Fresh leaves added to sambar, dal, or stir-fries', 'Southern & Western India'),

-- Vitamin B12 Deficiency
('VITAMIN_B12', 'VEGETARIAN', 'Fresh Curd / Yogurt (Dahi) & Buttermilk (Chaas)', 'Cobalamin, Probiotics', '1 bowl fresh curd with lunch and 1 glass spiced chaas', 'Universal Indian staple'),
('VITAMIN_B12', 'VEGETARIAN', 'Paneer (Cottage Cheese)', 'Vitamin B12, Calcium, Protein', '50-80g grilled or lightly tossed in curries', 'Universal staple'),
('VITAMIN_B12', 'NON_VEGETARIAN', 'Whole Eggs, Mutton/Chicken Liver & Fish', 'High-density Cobalamin, Heme Iron', 'Eggs daily; liver or fish 1-2 times weekly', 'Universal'),
('VITAMIN_B12', 'VEGAN', 'Fortified Plant Milk (Soy/Almond) & Nutritional Yeast', 'Fortified Cobalamin', '1 cup fortified plant beverage or 1 tbsp nutritional yeast on meals', 'Urban & retail supermarkets'),

-- Vitamin C Deficiency
('VITAMIN_C', 'VEGETARIAN', 'Indian Gooseberry (Amla)', 'Ultra-potent L-Ascorbic Acid', '1 fresh amla raw, juiced, or amla murabba daily', 'Universal staple in India'),
('VITAMIN_C', 'VEGETARIAN', 'Guavas (Amrood) & Citrus Fruits (Oranges/Sweet Lime)', 'Vitamin C, Bioflavonoids, Dietary Fiber', '1 fresh guava or orange daily', 'Universal seasonal fruit'),
('VITAMIN_C', 'VEGAN', 'Bell Peppers (Capsicum) & Fresh Lemon (Nimbu)', 'Vitamin C, Antioxidants', 'Fresh lemon squeezed generously over cooked food right before eating', 'Universal daily staple'),

-- Vitamin D Deficiency
('VITAMIN_D', 'VEGETARIAN', 'Fortified Milk, Yogurt & Edible Ghee', 'Cholecalciferol (Vitamin D3)', '2 servings of fortified dairy daily', 'Universal'),
('VITAMIN_D', 'VEGETARIAN', 'Sun-Exposed Button / Shiitake Mushrooms', 'Ergocalciferol (Vitamin D2)', '1 cup sliced mushrooms exposed to sunlight before cooking', 'Widely available in supermarkets'),
('VITAMIN_D', 'NON_VEGETARIAN', 'Fatty Fish (Salmon, Mackerel/Bangda, Sardines)', 'Natural Active Vitamin D3', '100-150g baked or curry fish twice a week', 'Coastal & urban markets'),
('VITAMIN_D', 'VEGAN', 'Fortified Plant Milk & 20-min Morning Sunlight Exposure', 'Vitamin D Synthesis', '1 cup fortified beverage + 15-20 min sunlight (10am-2pm)', 'Free natural source');

-- Doctor Referrals Reference Data
INSERT INTO doctor_referrals (deficiency_category, specialist_type, description) VALUES
('IRON_DEFICIENCY', 'General Physician / Hematologist', 'Can evaluate clinical anemia, order complete blood counts (CBC), and prescribe iron therapies.'),
('IRON_DEFICIENCY', 'Clinical Dietitian / Nutritionist', 'Provides personalized meal planning and dietary iron absorption strategies.'),
('VITAMIN_A', 'Ophthalmologist (Eye Specialist)', 'Evaluates ocular surface health, tear stability, and retinal light adaptation.'),
('VITAMIN_B12', 'Neurologist / General Physician', 'Assesses peripheral nerve sensations, cobalamin levels, and systemic metabolic function.'),
('VITAMIN_C', 'Dermatologist (Skin Specialist)', 'Evaluates collagen synthesis, skin elasticity, micro-capillary fragility, and wound repair.'),
('VITAMIN_D', 'Orthopedic / Endocrinologist', 'Assesses bone mineral density, serum 25(OH)D levels, and calcium homeostasis.');
