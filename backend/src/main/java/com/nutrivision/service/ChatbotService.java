package com.nutrivision.service;

import com.nutrivision.dto.request.ChatMessageRequest;
import com.nutrivision.dto.response.ChatMessageResponse;
import com.nutrivision.entity.Assessment;
import com.nutrivision.entity.User;
import com.nutrivision.repository.AssessmentRepository;
import com.nutrivision.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class ChatbotService {

    private static final Logger log = LoggerFactory.getLogger(ChatbotService.class);

    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;

    private static final String DEFAULT_DISCLAIMER =
            "Vitamin Deficiency provides educational information and preliminary visual screening indications only. It is not a clinical medical diagnosis. Please consult a qualified healthcare provider for clinical evaluation.";

    public ChatbotService(AssessmentRepository assessmentRepository, UserRepository userRepository) {
        this.assessmentRepository = assessmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public ChatMessageResponse processUserMessage(String userEmail, ChatMessageRequest request) {
        String msg = (request.getMessage() != null) ? request.getMessage().trim().toLowerCase() : "";
        // Do not log private health questions or account identifiers.

        // Emergency detection
        if (isEmergencyQuery(msg)) {
            return new ChatMessageResponse(
                    "⚠️ IMPORTANT MEDICAL NOTICE: If you or someone with you is experiencing severe symptoms such as intense chest pain, sudden shortness of breath, severe uncontrolled bleeding, sudden confusion, or acute collapse, please contact emergency medical services immediately (Dial 112 or 108 in India) or proceed to the nearest hospital emergency room. An online nutritional tool cannot address medical emergencies.",
                    "EMERGENCY",
                    Arrays.asList("Find Emergency Hospitals in Bengaluru", "Call 112 / 108", "Return to Assessment"),
                    "Immediate medical attention is required for acute symptoms.",
                    true
            );
        }

        // Diagnostic confirmation questions ("can this confirm", "is this real diagnosis")
        if (msg.contains("confirm") || msg.contains("diagnosis") || Pattern.compile("\\bprove\\b").matcher(msg).find() || msg.contains("is this real") || msg.contains("test result")) {
            return new ChatMessageResponse(
                    "NO — Vitamin Deficiency cannot confirm a nutritional deficiency, and no smartphone photo can replace clinical laboratory testing.\n\n" +
                            "Vitamin Deficiency provides preliminary visual indications to raise awareness about visible signs on the body. A definitive diagnosis requires standard clinical evaluation and laboratory blood tests (such as Serum B12, Serum Ferritin, or 25-OH Vitamin D) ordered by a physician.",
                    "DIAGNOSTIC_LIMITATION",
                    Arrays.asList("When should I see a doctor?", "Find a doctor in Bengaluru", "What foods contain B12?"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        if (msg.contains("child") || msg.contains("children") || msg.contains("baby")) {
            return new ChatMessageResponse("This prototype has not been validated for children. A parent or guardian should discuss a child's symptoms and nutrition with a paediatrician. Do not use photo results or adult supplement doses for a child.", "CHILD_SAFETY", List.of("Find a doctor in Bengaluru"), DEFAULT_DISCLAIMER, false);
        }
        if (msg.contains("vitamin d") || msg.contains("cholecalciferol")) {
            String answer;
            String intent;
            if (msg.contains("symptom") || msg.contains("sign")) {
                answer = "Vitamin D deficiency can cause bone pain and muscle weakness. These symptoms have other causes too. A photo cannot establish your vitamin D level; a clinician can decide whether a 25-hydroxyvitamin D blood test is appropriate.";
                intent = "VITAMIN_D_SYMPTOMS";
            } else if (msg.contains("food") || msg.contains("eat") || msg.contains("natural") || msg.contains("improve") || msg.contains("sun")) {
                answer = "Vitamin D sources include oily fish, egg yolks, and foods fortified with vitamin D, such as some dairy or plant milks. Check the label. Sunlight helps your body make vitamin D, but UV exposure can harm skin; avoid tanning or a fixed sun-exposure prescription. Ask a clinician about testing and supplements if concerned.";
                intent = "VITAMIN_D_FOODS";
            } else {
                answer = "Vitamin D helps your body absorb calcium and supports bones and muscles. Your level cannot be confirmed from a photograph. A clinician can assess your symptoms and decide whether blood testing is needed.";
                intent = "VITAMIN_D_INFO";
            }
            return new ChatMessageResponse(answer + "\n\nSource: https://ods.od.nih.gov/factsheets/VitaminD-Consumer/", intent, List.of("Vitamin D food sources", "Vitamin D symptoms", "Find a doctor in Bengaluru"), DEFAULT_DISCLAIMER, false);
        }
        if (msg.contains("uploaded an image") || msg.contains("result mean")) {
            return new ChatMessageResponse("A photo-quality result describes lighting and sharpness only. The current synthetic model is not validated for real photo screening, so it cannot tell whether you have a deficiency. Open your saved assessment to see its actual status; discuss ongoing symptoms with a clinician.", "IMAGE_RESULT_LIMITS", List.of("View Assessment History", "Find a doctor in Bengaluru"), DEFAULT_DISCLAIMER, false);
        }

        // Previous Assessment inquiry (IDOR protected: strictly queries user's own records)
        if (msg.contains("previous assessment") || msg.contains("last assessment") || msg.contains("past assessment") ||
                msg.contains("my result") || msg.contains("what did my assessment show") || msg.contains("previous test") ||
                msg.contains("my history")) {
            return handlePreviousAssessmentQuery(userEmail);
        }

        // Specific Vitamin B12 inquiries
        if (msg.contains("b12") || msg.contains("cobalamin")) {
            if (msg.contains("food") || msg.contains("eat") || msg.contains("source") || msg.contains("diet")) {
                if (msg.contains("veg") || msg.contains("vegan") || msg.contains("plant")) {
                    return new ChatMessageResponse(
                            "For vegetarians and vegans, Vitamin B12 is essential to track because plants do not naturally produce active B12:\n\n" +
                                    "• Lacto-Vegetarian: Fresh Curd (Dahi/Yogurt), Paneer, and Milk are natural dietary sources.\n" +
                                    "• Strict Vegans: Fortified soy/almond milk, fortified breakfast cereals, and fortified nutritional yeast are reliable plant-based options.\n\n" +
                                    "If you follow a strict vegetarian or vegan diet for long periods, ask a doctor to check your serum B12 levels. A doctor may recommend a maintenance oral B12 supplement if dietary intake is insufficient.",
                            "VITAMIN_B12_VEG_SOURCES",
                            Arrays.asList("Why is my tongue sore?", "Can I take supplements?", "Find a doctor in Bengaluru"),
                            DEFAULT_DISCLAIMER,
                            false
                    );
                }
                return new ChatMessageResponse(
                        "Here are key foods containing Vitamin B12 (Cobalamin):\n\n" +
                                "• Dairy (Vegetarian): Fresh curd (Dahi), paneer, and cow's milk.\n" +
                                "• Non-Vegetarian: Eggs, fish (such as mackerel, sardines, rohu), and poultry.\n" +
                                "• Vegan Options: Fortified plant milks and fortified nutritional yeast flakes.\n\n" +
                                "Vitamin B12 is crucial for healthy red blood cells and nerve function.",
                        "VITAMIN_B12_FOODS",
                        Arrays.asList("I am vegetarian", "What is Vitamin B12?", "Can I take supplements?"),
                        DEFAULT_DISCLAIMER,
                        false
                );
            }
            return new ChatMessageResponse(
                    "Vitamin B12 (Cobalamin) is a water-soluble vitamin essential for producing healthy red blood cells, supporting neurological health, and maintaining energy levels.\n\n" +
                            "When the body has low B12 reserves, visible signs can sometimes include:\n" +
                            "• An inflamed, smooth, or sore tongue (known clinically as Glossitis)\n" +
                            "• Cracking at the mouth corners (Angular Cheilitis)\n" +
                            "• Generalized fatigue, pale skin, or mild tingling in fingers/toes.\n\n" +
                            "Note: Visual appearance alone cannot confirm a deficiency; a simple serum B12 blood test ordered by a doctor is needed for confirmation.",
                    "VITAMIN_B12_EXPLANATION",
                    Arrays.asList("What foods contain B12?", "I am vegetarian", "Should I see a doctor?"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // Iron & Anemia inquiries
        if (msg.contains("iron") || msg.contains("ferritin") || msg.contains("anemia") || msg.contains("haemoglobin") || msg.contains("hemoglobin")) {
            if (msg.contains("food") || msg.contains("eat") || msg.contains("source") || msg.contains("diet")) {
                return new ChatMessageResponse(
                        "Here are excellent dietary sources of Iron for everyday meals:\n\n" +
                                "• Vegetarian Sources: Spinach (Palak), methi leaves, lentils (dal), chickpeas (chole), rajma, pumpkin seeds, and poha with lemon.\n" +
                                "• Non-Vegetarian Sources: Eggs, chicken, and fish.\n\n" +
                                "💡 Pro-Tip for Absorption: Plant-based (non-heme) iron is absorbed more effectively when paired with Vitamin C! Squeeze fresh lemon juice over your dal or eat an amla or orange with your meal.",
                        "IRON_FOODS",
                        Arrays.asList("Why do I have spoon nails?", "I am vegetarian", "Find a doctor in Bengaluru"),
                        DEFAULT_DISCLAIMER,
                        false
                );
            }
            return new ChatMessageResponse(
                    "Iron is a vital mineral needed to make hemoglobin, the protein in red blood cells that carries oxygen throughout your body.\n\n" +
                            "Common signs that may suggest low iron include:\n" +
                            "• Pale inner lower eyelids (Conjunctival Pallor)\n" +
                            "• Brittle, flat, or spoon-shaped concave nails (Koilonychia)\n" +
                            "• Fatigue, breathlessness with minor activity, and cold hands/feet.\n\n" +
                            "A Complete Blood Count (CBC) and Serum Ferritin blood test can accurately evaluate your iron status.",
                    "IRON_EXPLANATION",
                    Arrays.asList("What foods contain iron?", "Why do I have spoon nails?", "When should I see a doctor?"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // Vitamin C inquiries
        if (msg.contains("vitamin c") || msg.contains("ascorbic") || msg.contains("scurvy") || msg.contains("amla") || msg.contains("bleeding gums")) {
            return new ChatMessageResponse(
                    "Vitamin C (L-Ascorbic Acid) is a powerful antioxidant essential for collagen production, immune resilience, skin repair, and iron absorption.\n\n" +
                            "Rich Indian dietary sources include:\n" +
                            "• Fresh Indian Gooseberry (Amla) — one of the richest natural sources on earth!\n" +
                            "• Guavas, Oranges, Lemons, and Sweet Limes (Mosambi)\n" +
                            "• Bell peppers (capsicum), tomatoes, and green chilies.\n\n" +
                            "Possible signs associated with low Vitamin C include easy bruising, tiny red pinprick spots around hair follicles (perifollicular petechiae), bleeding gums, and slow wound healing.",
                    "VITAMIN_C_INFO",
                    Arrays.asList("Foods that contain Vitamin C", "Why are my gums bleeding?", "7-Day Meal Plan"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // Vitamin A inquiries
        if (msg.contains("vitamin a") || msg.contains("retinol") || msg.contains("night blindness") || msg.contains("dry eyes") || msg.contains("bitot")) {
            return new ChatMessageResponse(
                    "Vitamin A is crucial for good eyesight (especially low-light vision), healthy skin, and immune defense.\n\n" +
                            "Key dietary sources:\n" +
                            "• Plant Beta-Carotene: Carrots, sweet potatoes, papaya, mangoes, pumpkin, and dark green leafy vegetables.\n" +
                            "• Animal Retinol: Milk, butter, ghee, and eggs.\n\n" +
                            "Signs that may correlate with low Vitamin A include difficulty seeing at dusk (night blindness), ocular surface dryness (xerophthalmia), foamy grey eye spots (Bitot's spots), and rough 'goosebump' skin bumps (follicular hyperkeratosis).",
                    "VITAMIN_A_INFO",
                    Arrays.asList("What foods contain Vitamin A?", "Why do I have rough skin bumps?", "Find a doctor in Bengaluru"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // Zinc inquiries
        if (msg.contains("zinc") || msg.contains("white spots on nails") || msg.contains("hair thinning") || msg.contains("leukonychia")) {
            return new ChatMessageResponse(
                    "Zinc is an essential trace mineral involved in immune function, wound healing, protein synthesis, and cellular repair.\n\n" +
                            "Top dietary sources:\n" +
                            "• Pumpkin seeds, watermelon seeds, sesame seeds (til), and cashews.\n" +
                            "• Legumes: Chickpeas, lentils, and kidney beans.\n" +
                            "• Dairy: Paneer, curd, and milk.\n" +
                            "• Whole grains and eggs.\n\n" +
                            "Possible signs associated with low zinc include white spots or transverse bands on nails (punctate leukonychia), slow skin repair, and diffuse hair thinning.",
                    "ZINC_INFO",
                    Arrays.asList("Foods rich in zinc", "Why are there white spots on my nails?", "Check another photo"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // Symptom specific questions: Glossitis / Tongue
        if (msg.contains("tongue") || msg.contains("glossitis") || msg.contains("sore mouth")) {
            return new ChatMessageResponse(
                    "A sore, smooth, or unusually red tongue is medically called 'Glossitis'.\n\n" +
                            "Simple Meaning: Inflammation of the tongue, where the tiny normal bumps (papillae) become swollen or flattened, leaving a tender or glassy surface.\n\n" +
                            "Why it matters: Glossitis can sometimes be a visual sign associated with nutritional deficiencies, particularly Vitamin B12, Iron, Folate (Vitamin B9), or Riboflavin (Vitamin B2).\n\n" +
                            "What to do: Since an image cannot determine the exact underlying reason, we recommend consulting a general physician or dentist for an in-person examination.",
                    "SYMPTOM_GLOSSITIS",
                    Arrays.asList("What foods contain B12?", "What foods contain Iron?", "Find a doctor in Bengaluru"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // Symptom specific questions: Mouth corners / Angular Cheilitis
        if (msg.contains("mouth corner") || msg.contains("cracked lips") || msg.contains("angular cheilitis") || msg.contains("corners of mouth")) {
            return new ChatMessageResponse(
                    "Cracking, redness, or painful fissures at the corners of the mouth is clinically known as 'Angular Cheilitis'.\n\n" +
                            "Simple Meaning: Irritated, sore skin folds where the lips meet.\n\n" +
                            "Possible Nutritional Associations: Frequently linked with low levels of Vitamin B2 (Riboflavin), Vitamin B12, or Iron. It can also be influenced by moisture accumulation or fungal/bacterial overgrowth.\n\n" +
                            "Practical tip: Keep the area gently moisturized with plain petroleum jelly and avoid licking the lips. Consult a doctor to check for nutritional or topical causes.",
                    "SYMPTOM_ANGULAR_CHEILITIS",
                    Arrays.asList("Foods that contain B12", "What foods contain Iron?", "When should I see a doctor?"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // Symptom specific questions: Spoon nails / Koilonychia
        if (msg.contains("spoon") || msg.contains("koilonychia") || msg.contains("nail") && (msg.contains("crack") || msg.contains("brittle") || msg.contains("dip"))) {
            return new ChatMessageResponse(
                    "Nails that become thin, flat, or scooped inward like a teaspoon are known as 'Koilonychia' (spoon nails).\n\n" +
                            "Simple Meaning: Concave fingernails where the outer edges turn upward and could hold a drop of water.\n\n" +
                            "Possible Nutritional Association: Most classically associated with chronic Iron Deficiency Anemia. It can also rarely relate to thyroid issues or local chemical exposure.\n\n" +
                            "Recommended Next Step: Have a doctor run a simple Hemoglobin (CBC) and Serum Ferritin test.",
                    "SYMPTOM_KOILONYCHIA",
                    Arrays.asList("What foods contain iron?", "Can vegetarians get enough iron?", "Find a clinic in Bengaluru"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // Dietary personalization: Vegetarian / Vegan
        if (msg.contains("vegetarian") || msg.contains("veg") || msg.contains("vegan") || msg.contains("plant based")) {
            return new ChatMessageResponse(
                    "Vitamin Deficiency supports personalized vegetarian and vegan nutritional guidance!\n\n" +
                            "For Vegetarians:\n" +
                            "• Focus on curd/dahi and paneer for Vitamin B12.\n" +
                            "• Consume palak, lentils, methi, and pumpkin seeds with fresh lemon juice for enhanced iron absorption.\n\n" +
                            "For Strict Vegans:\n" +
                            "• Make sure to include fortified plant milks or nutritional yeast to meet Vitamin B12 needs.\n" +
                            "• Eat plenty of amla, oranges, sprouted legumes, sesame seeds, and leafy greens.\n\n" +
                            "You can also use our 7-Day Meal Plan page to generate a customized vegetarian food outline!",
                    "DIET_PREFERENCE_VEG",
                    Arrays.asList("Open 7-Day Meal Plan", "What is Vitamin B12?", "Foods that contain iron"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // Non-Vegetarian diet inquiries
        if (msg.contains("non vegetarian") || msg.contains("non-veg") || msg.contains("meat") || msg.contains("chicken") || msg.contains("fish") || msg.contains("egg")) {
            return new ChatMessageResponse(
                    "For non-vegetarians, wholesome dietary sources provide highly bioavailable nutrients:\n\n" +
                            "• Eggs: Contain Vitamin B12, Vitamin A, and high biological value protein.\n" +
                            "• Fish (e.g., Mackerel, Sardines, Rohu): Rich in bioavailable Vitamin B12, Vitamin D, and Omega-3 fatty acids.\n" +
                            "• Lean Poultry: Good source of heme iron and zinc.\n\n" +
                            "Balance non-vegetarian proteins with fiber-rich vegetables (such as spinach, tomatoes, and carrots) for optimal digestive and micronutrient health.",
                    "DIET_PREFERENCE_NON_VEG",
                    Arrays.asList("What foods contain B12?", "What foods contain iron?", "Open 7-Day Meal Plan"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // Doctor referral / Find a doctor inquiries
        if (msg.contains("doctor") || msg.contains("clinic") || msg.contains("hospital") || msg.contains("bengaluru") ||
                msg.contains("bangalore") || msg.contains("specialist") || msg.contains("nutritionist") || msg.contains("dietitian") ||
                msg.contains("near me") || msg.contains("where to go")) {
            return new ChatMessageResponse(
                    "You can find verified healthcare facilities and clinics directly in our 'Find a Doctor' section!\n\n" +
                            "In Bengaluru, you can consult:\n" +
                            "• Multispecialty Hospitals: Manipal Hospital (Old Airport Rd / Whitefield), Apollo Hospitals (Jayanagar), Fortis (Bannerghatta Rd), Aster CMI (Hebbal).\n" +
                            "• Clinical Nutrition Clinics: Qua Nutrition Clinic (Indiranagar / Koramangala).\n" +
                            "• Diagnostic Labs: Dr. Lal PathLabs, Apollo Clinics across Bengaluru for complete blood counts and vitamin assays.\n\n" +
                            "Click below to browse verified locations, get phone numbers, and open directions in Google Maps.",
                    "DOCTOR_REFERRAL",
                    Arrays.asList("Go to Find a Doctor", "When should I see a doctor?", "What did my assessment show?"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // When to see a doctor
        if (msg.contains("when should i see") || msg.contains("should i see a doctor") || msg.contains("need a doctor") || msg.contains("serious")) {
            return new ChatMessageResponse(
                    "You should seek an in-person consultation with a qualified doctor if:\n\n" +
                            "1. Your visible signs (such as a sore tongue, cracking lips, or skin changes) persist for more than 10-14 days.\n" +
                            "2. You experience persistent unexplained fatigue, weakness, dizziness, or rapid heartbeat.\n" +
                            "3. You have numbness, tingling, or 'pins and needles' sensations in your hands or feet.\n" +
                            "4. You have digestive problems or malabsorption history.\n" +
                            "5. You are pregnant, nursing, or planning a strict dietary change.\n\n" +
                            "A doctor will conduct a clinical examination and order routine blood tests to check your actual vitamin levels.",
                    "WHEN_TO_SEE_DOCTOR",
                    Arrays.asList("Find a doctor in Bengaluru", "Can this confirm deficiency?", "What foods contain B12?"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // Supplements questions
        if (msg.contains("supplement") || msg.contains("tablet") || msg.contains("pill") || msg.contains("capsule") || msg.contains("multivitamin") || msg.contains("dose") || msg.contains("dosage")) {
            return new ChatMessageResponse(
                    "Regarding vitamins and dietary supplements:\n\n" +
                            "• Safety First: Vitamin Deficiency does not recommend or prescribe specific supplement dosages or pharmaceutical medications. High-dose fat-soluble vitamins (such as Vitamin A or D) or high-dose iron can cause toxicity if taken without clinical monitoring.\n" +
                            "• Dietary First: We always recommend obtaining essential vitamins from wholesome, balanced everyday foods whenever possible.\n" +
                            "• Clinical Guidance: If a deficiency is confirmed by a blood test, your doctor or registered dietitian will prescribe the exact safe dosage and formulation suited to your health profile.",
                    "SUPPLEMENT_SAFETY",
                    Arrays.asList("What foods contain B12?", "What foods contain Iron?", "Find a doctor in Bengaluru"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // Confidence and Image Result questions
        if (msg.contains("confidence") || msg.contains("accuracy") || msg.contains("how accurate") || msg.contains("what does confidence mean")) {
            return new ChatMessageResponse(
                    "In Vitamin Deficiency, 'Confidence' reflects how strongly the visual pattern in your photo matches categories in the training dataset. The bundled model was tested only on synthetic drawings, so its scores do not establish real-world accuracy:\n\n" +
                            "• High: The visual markers in your image strongly align with typical patterns for that category.\n" +
                            "• Moderate: Notable visual features were recognized, but they may be mild or overlap with other normal variations.\n" +
                            "• Low / Not Clear: The photo is not distinct enough to offer a reliable indication.\n\n" +
                            "Remember: Confidence indicates visual pattern similarity, NOT a biological proof of deficiency.",
                    "CONFIDENCE_EXPLANATION",
                    Arrays.asList("Can this confirm deficiency?", "Check another photo", "What did my assessment show?"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }



        // General Nutrition / "What should I eat" / Nutrition Plan
        if (msg.contains("meal plan") || msg.contains("diet plan") || msg.contains("what should i eat") || msg.contains("balanced diet") || msg.contains("nutrition plan")) {
            return new ChatMessageResponse(
                    "A balanced Indian daily meal plan incorporates wholesome local foods across all food groups:\n\n" +
                            "• Breakfast: Sprouted moong or vegetable poha with lemon, or methi paratha with fresh curd.\n" +
                            "• Lunch: Palak or dal with whole-grain rotis, steamed rice, fresh cucumber-tomato salad, and curd.\n" +
                            "• Evening Snack: Roasted chana, dry makhana, or a handful of pumpkin and sesame seeds.\n" +
                            "• Dinner: Light khichdi or mixed vegetable curry with multigrain phulkas.\n\n" +
                            "Explore our dedicated '7-Day Nutrition Plan' page to see complete daily breakdowns tailored to specific vitamins!",
                    "NUTRITION_PLAN",
                    Arrays.asList("Open 7-Day Meal Plan", "I am vegetarian", "What foods contain iron?"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // General greeting or fallback
        if (msg.contains("hello") || msg.contains("hi") || msg.contains("hey") || msg.contains("good morning") || msg.contains("good evening")) {
            return new ChatMessageResponse(
                    "Hello! I am your Vitamin Deficiency Assistant. I can help explain vitamin functions, decode visible symptoms (like sore tongue or spoon nails) into plain English, suggest Indian food sources, or help you locate a nearby doctor in Bengaluru.\n\nHow can I help you today?",
                    "GREETING",
                    Arrays.asList("What did my previous assessment show?", "What is Vitamin B12?", "Foods that contain iron", "Find a doctor in Bengaluru"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        // Default intelligent contextual response
        return new ChatMessageResponse(
                "I understand you are asking about \"" + request.getMessage() + "\".\n\n" +
                        "Vitamin Deficiency specializes in educational guidance on preliminary visual signs of nutritional deficiencies (such as Iron, Vitamin B12, Vitamin C, Vitamin A, and Zinc), culinary food recommendations, and healthcare referrals.\n\n" +
                        "Would you like to know about:\n" +
                        "1. How specific vitamins function and their food sources\n" +
                        "2. Explaining a visible sign (e.g., sore tongue, spoon nails, cracked lip corners)\n" +
                        "3. Reviewing your saved assessments\n" +
                        "4. Finding a doctor or clinic in Bengaluru?",
                "GENERAL_ASSISTANCE",
                Arrays.asList("What is Vitamin B12?", "Foods that contain iron", "Find a doctor in Bengaluru", "When should I see a doctor?"),
                DEFAULT_DISCLAIMER,
                false
        );
    }

    private boolean isEmergencyQuery(String msg) {
        return msg.contains("chest pain") || msg.contains("heart attack") || msg.contains("can't breathe") ||
                msg.contains("cannot breathe") || msg.contains("severe bleeding") || msg.contains("unconscious") ||
                msg.contains("fainted") || msg.contains("coughing blood") || msg.contains("emergency") ||
                msg.contains("suicide") || msg.contains("poison");
    }

    private ChatMessageResponse handlePreviousAssessmentQuery(String userEmail) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail.toLowerCase().trim());
        if (userOpt.isEmpty()) {
            return new ChatMessageResponse(
                    "Please log in to view your previous assessment records.",
                    "PREVIOUS_ASSESSMENT_UNAUTHENTICATED",
                    Arrays.asList("Log In", "Take New Assessment"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        List<Assessment> assessments = assessmentRepository.findByUser_UserIdOrderByCreatedAtDesc(userOpt.get().getUserId());
        if (assessments.isEmpty()) {
            return new ChatMessageResponse(
                    "You don't have any saved assessments in your account yet. You can start a new assessment anytime by uploading or capturing a clear photo of your eyes, tongue, nails, lips, skin, or hair.",
                    "NO_PREVIOUS_ASSESSMENT",
                    Arrays.asList("Start New Assessment", "What is Vitamin B12?", "Find a doctor in Bengaluru"),
                    DEFAULT_DISCLAIMER,
                    false
            );
        }

        Assessment latest = assessments.get(0);
        String dateStr = latest.getCreatedAt() != null ?
                latest.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "Recently";
        String bodyPart = latest.getTargetBodyPart() != null ? latest.getTargetBodyPart().name() : "Target Area";
        String status = latest.getStatus() != null ? latest.getStatus().name() : "RECORDED";

        return new ChatMessageResponse(
                "Here is a summary of your most recent assessment (#" + latest.getAssessmentId() + "):\n\n" +
                        "• Date: " + dateStr + "\n" +
                        "• Body Area: " + bodyPart + "\n" +
                        "• Status: " + status + "\n" +
                        "• Number of Photos: " + (latest.getImages() != null ? latest.getImages().size() : 1) + "\n\n" +
                        "You can review the full visual assessment, food guidance, and export a clean PDF report anytime under 'Assessment History'.",
                "PREVIOUS_ASSESSMENT_FOUND",
                Arrays.asList("View Assessment History", "Foods for this deficiency", "Find a doctor in Bengaluru"),
                DEFAULT_DISCLAIMER,
                false
        );
    }
}
