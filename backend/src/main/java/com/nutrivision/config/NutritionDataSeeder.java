package com.nutrivision.config;

import com.nutrivision.entity.*;
import com.nutrivision.repository.FoodItemRepository;
import com.nutrivision.repository.NutrientGuidanceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class NutritionDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(NutritionDataSeeder.class);

    private final FoodItemRepository foodItemRepository;
    private final NutrientGuidanceRepository guidanceRepository;

    public NutritionDataSeeder(FoodItemRepository foodItemRepository, NutrientGuidanceRepository guidanceRepository) {
        this.foodItemRepository = foodItemRepository;
        this.guidanceRepository = guidanceRepository;
    }

    @Override
    public void run(String... args) {
        if (guidanceRepository.count() == 0) {
            seedNutrientGuidance();
        }
        if (foodItemRepository.count() == 0) {
            seedFoodItems();
        }
        // Add the new educational pathway even to an existing database.
        if (guidanceRepository.findByCategory(DeficiencyCategory.VITAMIN_D_DEFICIENCY).isEmpty()) {
            guidanceRepository.save(new NutrientGuidance(
                DeficiencyCategory.VITAMIN_D_DEFICIENCY, "Vitamin D",
                "General educational information. A photograph cannot measure vitamin D levels.",
                "Supports calcium absorption, bones, and muscles.",
                "Check food labels for vitamin D fortification. Source: https://ods.od.nih.gov/factsheets/VitaminD-Consumer/",
                "Discuss ongoing symptoms with a clinician. Do not self-prescribe high-dose supplements."
            ));
            foodItemRepository.saveAll(List.of(
                new FoodItem(DeficiencyCategory.VITAMIN_D_DEFICIENCY, "Vitamin D", "Fortified plant milk", null, DietType.VEGAN, FoodRegion.GENERAL, "Check the label for vitamin D.", "Choose an unsweetened option if suitable.", null, "Check ingredients for allergies.", 1),
                new FoodItem(DeficiencyCategory.VITAMIN_D_DEFICIENCY, "Vitamin D", "Fortified dairy milk", null, DietType.VEGETARIAN, FoodRegion.GENERAL, "Check the label for vitamin D.", "Fortification varies by product.", null, "Avoid if allergic to milk.", 1),
                new FoodItem(DeficiencyCategory.VITAMIN_D_DEFICIENCY, "Vitamin D", "Oily fish", null, DietType.NON_VEGETARIAN, FoodRegion.GENERAL, "Include in a balanced meal if suitable.", "A dietary source of vitamin D.", null, "Check for fish allergy.", 1)
            ));
        }
    }

    private void seedNutrientGuidance() {
        log.info("Seeding initial Nutrition Guidance for all 6 screening categories...");
        List<NutrientGuidance> guidances = new ArrayList<>();

        // 1. Iron Deficiency
        guidances.add(new NutrientGuidance(
                DeficiencyCategory.IRON_DEFICIENCY,
                "Iron (Fe) & Erythropoietic Co-factors",
                "Iron is the central cofactor in hemoglobin synthesis, oxygen transport to peripheral tissues, and cellular energy production. Preliminary screening patterns like koilonychia (concave spooning) or conjunctival mucosal pallor often correspond with depleted iron stores.",
                "Crucial for red blood cell synthesis, myoglobin function in muscles, cognitive stamina, and immune resilience.",
                "Pair plant-based non-heme iron with Vitamin C (e.g. fresh lemon juice on dal) to boost absorption by up to 3x. Avoid tea/coffee within 1 hour of iron-rich meals due to tannin inhibition.",
                "Educational dietary advice only. Suspected anemia must be confirmed via Serum Ferritin, Hemoglobin (CBC), and Total Iron Binding Capacity (TIBC) tests under medical guidance."
        ));

        // 2. Vitamin A Deficiency
        guidances.add(new NutrientGuidance(
                DeficiencyCategory.VITAMIN_A_DEFICIENCY,
                "Vitamin A (Beta-Carotene & Retinol)",
                "Vitamin A maintains specialized epithelial cell differentiation, mucosal barrier immunity, and phototransduction in ocular rod cells. Dermatological manifestations like follicular hyperkeratosis (phrynoderma) and ocular xerosis reflect retinoid depletion.",
                "Maintains clear vision (especially night adaptation), healthy skin barrier integrity, and respiratory/gastrointestinal mucosal defenses.",
                "Vitamin A is fat-soluble. Consuming orange and dark green vegetables cooked with healthy culinary fats (ghee, coconut oil, mustard oil) significantly improves intestinal absorption.",
                "Excessive preformed retinol supplements can cause toxicity. Emphasize natural dietary provitamin A carotenoids and consult a physician."
        ));

        // 3. Vitamin B12 Deficiency
        guidances.add(new NutrientGuidance(
                DeficiencyCategory.VITAMIN_B12_DEFICIENCY,
                "Vitamin B12 (Cobalamin)",
                "Vitamin B12 is essential for myelin sheath nerve preservation, DNA synthesis, and red blood cell maturation. Classical manifestations include atrophic glossitis (smooth beefy red tongue with loss of lingual papillae), peripheral tingling, and fatigue.",
                "Vital for neurological integrity, cellular energy metabolism, homocysteine regulation, and preventing megaloblastic anemia.",
                "Natural B12 is synthesized by microorganisms and predominantly found in dairy, eggs, and meats. Strict vegans should rely on fortified plant milks, nutritional yeast, or medical B12 supplements.",
                "Dietary B12 requires gastric intrinsic factor for absorption. Persistent deficiency requires Serum Vitamin B12 and Holotranscobalamin blood tests."
        ));

        // 4. Vitamin C Deficiency
        guidances.add(new NutrientGuidance(
                DeficiencyCategory.VITAMIN_C_DEFICIENCY,
                "Vitamin C (L-Ascorbic Acid)",
                "Vitamin C is the obligate co-substrate for prolyl and lysyl hydroxylases in collagen triple-helix synthesis and vascular wall stability. Depletion causes perifollicular petechiae (red punctate spots around hair follicles), corkscrew hairs, and subungual splinter hemorrhages.",
                "Essential for collagen formation in skin, blood vessels, and gums, wound healing, antioxidant protection, and non-heme iron reduction.",
                "Vitamin C is heat-labile and water-soluble. Consume fresh fruits and lightly steamed vegetables. Raw amla (Indian gooseberry) is exceptionally stable due to natural protective polyphenols.",
                "High-dose supplemental ascorbic acid should be monitored in individuals prone to calcium oxalate kidney stones."
        ));

        // 5. Zinc Deficiency
        guidances.add(new NutrientGuidance(
                DeficiencyCategory.ZINC_DEFICIENCY,
                "Zinc (Zn)",
                "Zinc is an essential catalytic and structural component of over 300 metalloenzymes controlling keratinocyte turnover, cellular immunity, DNA repair, and wound regeneration. Depletion presents with leukonychia (transverse white nail lines), periorificial dermatitis, and diffuse hair thinning.",
                "Required for protein synthesis, cellular division, taste acuity, wound healing, testosterone regulation, and immune defense.",
                "Plant seeds, nuts, and legumes contain phytates that can inhibit zinc uptake. Soaking, sprouting, and fermenting legumes markedly improves zinc bioavailability.",
                "Avoid excessive zinc supplementation which can induce secondary copper deficiency. Favor natural whole foods."
        ));

        // 6. Healthy / Balanced Baseline
        guidances.add(new NutrientGuidance(
                DeficiencyCategory.HEALTHY_NORMAL,
                "Balanced Multi-Nutrient & Micronutrient Synergy",
                "Your visual screening reflects well-vascularized tissue and normal anatomical morphology. Continuing a diverse whole-food dietary regime ensures sustained micronutrient sufficiency.",
                "Supports metabolic homeostasis, cellular repair, cardiovascular vigor, and long-term vitality.",
                "Maintain diverse rainbow-colored vegetables, regional unrefined millets, traditional fermented foods, adequate hydration, and balanced protein sources.",
                "Regular annual wellness checkups and balanced nutrition support ongoing holistic health."
        ));

        guidanceRepository.saveAll(guidances);
        log.info("Successfully seeded {} nutrient guidance records.", guidances.size());
    }

    private void seedFoodItems() {
        log.info("Seeding Indian, South Indian, and Global Food Recommendations...");
        List<FoodItem> items = new ArrayList<>();

        // =====================================================================
        // 1. IRON DEFICIENCY FOODS
        // =====================================================================
        items.add(new FoodItem(
                DeficiencyCategory.IRON_DEFICIENCY, "Iron (Fe)", "Finger Millet / Ragi", "Ragi / Nachni / Mandua",
                DietType.VEGAN, FoodRegion.SOUTH_INDIAN, "1 cup cooked as Ragi Mudde with dal, or as Ragi Dosa/Roti.",
                "Exceptional mineral and non-heme iron density; traditional South Indian staple with low glycemic index.",
                "Best consumed with tomato rasam or buttermilk; avoid tea with meals.", "Naturally gluten-free.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.IRON_DEFICIENCY, "Iron (Fe)", "Drumstick Leaves / Moringa", "Nuggesoppu / Munagaku",
                DietType.VEGAN, FoodRegion.SOUTH_INDIAN, "Cooked with toor dal, in sambar, or lightly sautéed with grated coconut.",
                "One of the most iron-dense greens in Indian cuisine; rich in Vitamin C which self-enhances iron uptake.",
                "Pair with fresh lime juice.", "Wash thoroughly before cooking.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.IRON_DEFICIENCY, "Iron (Fe)", "Spinach / Palak", "Palak / Harive Soppu",
                DietType.VEGAN, FoodRegion.INDIAN, "Cooked in Palak Dal, Palak Paneer, or vegetable soups (1.5 cups cooked).",
                "Rich in non-heme iron, folate, and carotenoids.",
                "Squeeze half a fresh lemon directly onto cooked spinach to boost iron absorption by 3x.",
                "Moderate intake if prone to calcium oxalate kidney stones.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.IRON_DEFICIENCY, "Iron (Fe)", "Black Sesame Seeds / Til", "Ellu / Til",
                DietType.VEGAN, FoodRegion.INDIAN, "1-2 tablespoons daily as Til Chikki, Ellu Podi, or sprinkled over salads/rotis.",
                "Dense source of iron, calcium, copper, and healthy plant lipids.",
                "Dry roast lightly to reduce phytates and improve nutrient release.", "Store in a cool, airtight container.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.IRON_DEFICIENCY, "Iron (Fe)", "Sprouted Bengal Gram / Kala Chana", "Kadale / Desi Chana",
                DietType.VEGAN, FoodRegion.INDIAN, "1 cup boiled as Chana Sundal / Usli, or in vegetable gravies.",
                "Sprouting dramatically increases bioavailability of iron, folate, and Vitamin C.",
                "Enjoy with chopped raw onions, tomatoes, and lemon.", "Chew thoroughly to aid digestion.", 2
        ));
        items.add(new FoodItem(
                DeficiencyCategory.IRON_DEFICIENCY, "Iron (Fe)", "Red Kidney Beans / Rajma", "Rajma",
                DietType.VEGAN, FoodRegion.INDIAN, "1 cup thoroughly cooked in Punjabi Rajma curry with brown/steamed rice.",
                "High in non-heme iron, soluble fiber, and plant protein.",
                "Soak overnight for at least 8 hours to neutralize lectins and phytates.", "Cook until completely soft.", 2
        ));
        items.add(new FoodItem(
                DeficiencyCategory.IRON_DEFICIENCY, "Iron (Fe)", "Country Chicken Eggs", "Nati Koli Mutte / Desi Anda",
                DietType.NON_VEGETARIAN, FoodRegion.INDIAN, "2 whole boiled or poached eggs for breakfast.",
                "High bioavailability heme iron combined with complete protein and B-vitamins.",
                "Pairs well with citrus fruits or bell peppers.", "Keep egg yolks intact for full nutrient value.", 2
        ));
        items.add(new FoodItem(
                DeficiencyCategory.IRON_DEFICIENCY, "Iron (Fe)", "Mutton Liver", "Kaleji",
                DietType.NON_VEGETARIAN, FoodRegion.INDIAN, "100g cooked with pepper and onions once weekly.",
                "The highest bioavailable heme iron source with preformed Vitamin A and B12.",
                "Heme iron absorption is not inhibited by phytates or polyphenols.",
                "Limit to 1-2 times weekly due to high cholesterol and preformed Vitamin A.", 1
        ));

        // =====================================================================
        // 2. VITAMIN A DEFICIENCY FOODS
        // =====================================================================
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_A_DEFICIENCY, "Vitamin A", "Carrots / Gajar", "Gajar",
                DietType.VEGAN, FoodRegion.INDIAN, "1-2 medium carrots raw in salads, cooked in subji, or lightly steamed.",
                "Exceptional beta-carotene concentration; converted into active retinol in the liver.",
                "Always consume with healthy fats (ghee/mustard oil) to ensure fat-soluble absorption.", "Daily staple.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_A_DEFICIENCY, "Vitamin A", "Sweet Potato / Shakarkandi", "Genasu / Shakarkand",
                DietType.VEGAN, FoodRegion.INDIAN, "1 medium boiled or roasted sweet potato with a pinch of chaat masala.",
                "Rich in provitamin A carotenoids, dietary fiber, and potassium.",
                "Roasting or boiling with skin preserves maximum nutrient value.", "Low glycemic load.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_A_DEFICIENCY, "Vitamin A", "Yellow Pumpkin", "Kumbalakai / Kaddu",
                DietType.VEGAN, FoodRegion.SOUTH_INDIAN, "Cooked in South Indian Sambar, Erissery, or vegetable soup.",
                "Traditional beta-carotene source supporting retinal rod cells and corneal integrity.",
                "Naturally sweet and easily digestible for all ages.", "Use fresh deep-orange flesh.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_A_DEFICIENCY, "Vitamin A", "Pure Cow Ghee", "Tuppa / Desi Ghee",
                DietType.VEGETARIAN, FoodRegion.INDIAN, "1 teaspoon melted over hot dal, khichdi, or rotis.",
                "Contains natural preformed retinol, butyric acid, and the lipid carrier required for carotenoid assimilation.",
                "Acts as an essential bioavailability enhancer for fat-soluble vitamins (A, D, E, K).",
                "Consume in moderation as part of daily calorie allowance.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_A_DEFICIENCY, "Vitamin A", "Ripe Papaya", "Parangi Hannu / Papita",
                DietType.VEGAN, FoodRegion.INDIAN, "1 bowl freshly sliced ripe papaya in the morning.",
                "Rich in provitamin A cryptoxanthin, lycopene, and digestive papain enzyme.",
                "Best consumed fresh without cooking.", "Avoid in early pregnancy without medical guidance.", 2
        ));
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_A_DEFICIENCY, "Vitamin A", "Egg Yolk", "Mutte Haladi / Zardi",
                DietType.NON_VEGETARIAN, FoodRegion.GENERAL, "1-2 whole eggs prepared boiled or sunny-side up.",
                "Direct bioavailable preformed retinol along with lutein and zeaxanthin for macula protection.",
                "Easily assimilated by the digestive tract without hepatic conversion requirements.", "Do not overcook.", 1
        ));

        // =====================================================================
        // 3. VITAMIN B12 DEFICIENCY FOODS
        // =====================================================================
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_B12_DEFICIENCY, "Vitamin B12", "Fresh Curd / Yogurt", "Mosaru / Dahi",
                DietType.VEGETARIAN, FoodRegion.INDIAN, "1 cup of fresh homemade dahi with lunch or as spiced Majjige (Buttermilk).",
                "Fermented dairy staple providing bioavailable cobalamin alongside probiotic lactic acid cultures.",
                "Regular consumption supports gut microbiome and natural digestive absorption.",
                "Avoid overly sour curd; consume fresh.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_B12_DEFICIENCY, "Vitamin B12", "Fresh Paneer", "Paneer",
                DietType.VEGETARIAN, FoodRegion.INDIAN, "75-100g lightly sautéed in curries or grilled as Paneer Tikka.",
                "Concentrated lacto-vegetarian source of Vitamin B12, high quality casein, and calcium.",
                "Pairs well with spinach or bell peppers.", "Use fresh, unadulterated cottage cheese.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_B12_DEFICIENCY, "Vitamin B12", "Fortified Nutritional Yeast / Plant Milk", "Fortified Soya Milk",
                DietType.VEGAN, FoodRegion.GENERAL, "1 glass fortified plant milk daily or 1 tbsp nutritional yeast over meals.",
                "The primary reliable non-animal source of cyanocobalamin / methylcobalamin for strict vegans.",
                "Essential for vegans as plant foods do not naturally synthesize active Vitamin B12.",
                "Check label to confirm active B12 fortification.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_B12_DEFICIENCY, "Vitamin B12", "Indian Mackerel / Sardines", "Bangude / Tarli Fish",
                DietType.NON_VEGETARIAN, FoodRegion.SOUTH_INDIAN, "150g grilled or prepared as South Indian fish curry.",
                "Extremely dense in bioavailable Vitamin B12, Omega-3 fatty acids (EPA/DHA), and Vitamin D.",
                "Supports neurological myelin sheath integrity and cardiovascular wellness.",
                "Prefer fresh coastal catches over deep-fried preparations.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_B12_DEFICIENCY, "Vitamin B12", "Whole Eggs", "Mutte / Anda",
                DietType.NON_VEGETARIAN, FoodRegion.GENERAL, "2 whole eggs daily.",
                "Provides ~1.1 mcg of Vitamin B12 per 2 eggs along with high biological value protein.",
                "Pairs with whole grain toast or vegetable stir fry.", "Essential for neurological health.", 2
        ));

        // =====================================================================
        // 4. VITAMIN C DEFICIENCY FOODS
        // =====================================================================
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_C_DEFICIENCY, "Vitamin C", "Indian Gooseberry / Amla", "Bettada Nellikai / Amla",
                DietType.VEGAN, FoodRegion.INDIAN, "1 fresh amla daily raw with salt, as fresh amla juice, or in Chyawanprash.",
                "The highest botanical concentration of Vitamin C (~600mg/100g); heat-stable polyphenols protect the vitamin.",
                "Potent collagen synthesis promoter and capillary protector against splinter hemorrhages.",
                "Safe for daily long-term intake.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_C_DEFICIENCY, "Vitamin C", "Pink Guava / Amrood", "Seebe Hannu / Jamphal",
                DietType.VEGAN, FoodRegion.INDIAN, "1 medium ripe guava eaten whole with seeds.",
                "Contains over 200mg of Vitamin C per fruit (over 3x higher than an orange) plus dietary lycopene.",
                "Eat fresh and unpeeled after thorough washing for maximum vitamin concentration.",
                "Excellent low-sugar fruit choice.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_C_DEFICIENCY, "Vitamin C", "Fresh Lemon / Lime", "Nimbe Hannu / Nimbu",
                DietType.VEGAN, FoodRegion.INDIAN, "Squeeze fresh juice of 1 lemon over warm water, salads, or hot dals just before eating.",
                "Ubiquitous culinary source of citric acid and active ascorbic acid.",
                "Add after cooking/cooling slightly to prevent heat degradation of ascorbic acid.", "Daily kitchen essential.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_C_DEFICIENCY, "Vitamin C", "Green Bell Pepper / Capsicum", "Dhodd Menasinakai / Shimla Mirch",
                DietType.VEGAN, FoodRegion.GENERAL, "1 cup sliced raw in salads or lightly stir-fried in subji.",
                "Dense in ascorbic acid, lutein, and bioflavonoids.",
                "Light stir-frying preserves vitamin content compared to boiling.", "Crunchy and hydrating.", 2
        ));
        items.add(new FoodItem(
                DeficiencyCategory.VITAMIN_C_DEFICIENCY, "Vitamin C", "Sprouted Green Moong", "Hesaru Kaalu / Sprouted Moong",
                DietType.VEGAN, FoodRegion.SOUTH_INDIAN, "1 cup raw sprouted moong as Kosambari / salad with grated coconut and lemon.",
                "Sprouting multiplies Vitamin C content of dry mung beans by up to 500%.",
                "Traditional Karnataka Kosambari pairs sprouted moong with cucumber, green chillies, and lemon.",
                "Easily digestible and refreshing.", 2
        ));

        // =====================================================================
        // 5. ZINC DEFICIENCY FOODS
        // =====================================================================
        items.add(new FoodItem(
                DeficiencyCategory.ZINC_DEFICIENCY, "Zinc (Zn)", "Pumpkin Seeds / Pepitas", "Kumbalakai Beeja / Kaddu Ke Beej",
                DietType.VEGAN, FoodRegion.INDIAN, "2 tablespoons (30g) lightly roasted pumpkin seeds as a daily snack.",
                "Exceptional plant-based zinc density (~7.5mg/100g) plus magnesium and tryptophan.",
                "Promotes keratinocyte division, accelerates wound healing, and strengthens nail beds.",
                "Lightly dry roast on low flame.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.ZINC_DEFICIENCY, "Zinc (Zn)", "White & Black Sesame Seeds", "Ellu / Til",
                DietType.VEGAN, FoodRegion.INDIAN, "1 tablespoon daily in chutneys (Ellu Chutney), podi, or chikki.",
                "Concentrated zinc, calcium, and linoleic acid for scalp health and leukonychia recovery.",
                "Soaking or light roasting diminishes phytate binding.", "Rich in zinc metalloenzyme cofactors.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.ZINC_DEFICIENCY, "Zinc (Zn)", "Cashew Nuts", "Godambi / Kaju",
                DietType.VEGAN, FoodRegion.SOUTH_INDIAN, "6-8 raw or roasted cashews as an evening snack.",
                "Grown extensively in Coastal Karnataka/Kerala; rich in zinc (5.8mg/100g) and monounsaturated fatty acids.",
                "Satisfying nutrient-dense nut for vegetarians and vegans.", "Consume un-salted and un-fried.", 2
        ));
        items.add(new FoodItem(
                DeficiencyCategory.ZINC_DEFICIENCY, "Zinc (Zn)", "Chickpeas & Lentils", "Chana / Toor Dal",
                DietType.VEGAN, FoodRegion.SOUTH_INDIAN, "1 cup cooked in South Indian Dal, Sambar, or Sundal.",
                "Plant zinc and lysine protein matrix supporting nail and hair keratin.",
                "Soaking beans overnight deactivates phytate inhibitors.", "Wholesome daily staple.", 2
        ));
        items.add(new FoodItem(
                DeficiencyCategory.ZINC_DEFICIENCY, "Zinc (Zn)", "Fresh Paneer & Curd", "Paneer / Mosaru",
                DietType.VEGETARIAN, FoodRegion.INDIAN, "100g paneer or 1 cup curd daily.",
                "Bioavailable dairy zinc without plant phytates; highly assimilated by intestinal enterocytes.",
                "Supports cellular division and collagen synthesis.", "Natural lacto-vegetarian option.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.ZINC_DEFICIENCY, "Zinc (Zn)", "Whole Eggs", "Mutte / Anda",
                DietType.NON_VEGETARIAN, FoodRegion.GENERAL, "2 whole eggs daily.",
                "Contains bioavailable zinc plus sulfur-rich amino acids (methionine/cysteine) for hair and nail growth.",
                "Perfect breakfast choice for complete protein and mineral delivery.", "Cook thoroughly.", 1
        ));

        // =====================================================================
        // 6. HEALTHY / BALANCED BASELINE FOODS
        // =====================================================================
        items.add(new FoodItem(
                DeficiencyCategory.HEALTHY_NORMAL, "Balanced Multi-Nutrient", "Mixed Ancient Millets", "Navane / Jola / Ragi",
                DietType.VEGAN, FoodRegion.SOUTH_INDIAN, "Use Foxtail (Navane), Sorghum (Jowar), or Ragi in place of polished white rice.",
                "High dietary fiber, trace minerals (magnesium, iron, zinc), and low glycemic index supporting metabolic health.",
                "Rotate different regional millets throughout the week for comprehensive mineral coverage.",
                "Drink adequate water with high-fiber millets.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.HEALTHY_NORMAL, "Balanced Multi-Nutrient", "Sprouted Pulse Salad (Kosambari)", "Molake Kalu Kosambari",
                DietType.VEGAN, FoodRegion.SOUTH_INDIAN, "1 bowl daily with mixed sprouted moong, grated carrot, and lemon seasoning.",
                "Raw enzyme-rich botanical matrix delivering Vitamin C, B-complex, iron, and bioflavonoids.",
                "Traditional South Indian festive salad known for refreshing vitality.", "Consume freshly prepared.", 1
        ));
        items.add(new FoodItem(
                DeficiencyCategory.HEALTHY_NORMAL, "Balanced Multi-Nutrient", "Probiotic Buttermilk / Majjige", "Majjige / Chaas",
                DietType.VEGETARIAN, FoodRegion.SOUTH_INDIAN, "1 glass after lunch with ginger, curry leaves, and cumin seasoning.",
                "Cools the digestive tract, hydrates, and populates the gut microbiome with friendly lactic acid bacilli.",
                "A healthy gut microbiome improves absorption of all dietary vitamins and minerals.",
                "Use homemade curd diluted with water.", 1
        ));

        foodItemRepository.saveAll(items);
        log.info("Successfully seeded {} Indian & Global Food Recommendations across 6 categories.", items.size());
    }
}
