-- ==============================================================================
-- NutriVision AI - Seed Data: Reference Symptoms Taxonomy
-- Maps anatomical signs and symptoms to common nutritional deficiencies
-- ==============================================================================

USE nutrivision_db;

INSERT INTO symptoms (symptom_code, name, related_body_part, description) VALUES
-- Nail Symptoms
('BRITTLE_NAILS', 'Brittle or Cracking Nails', 'NAILS', 'Nails that split, chip, or break easily under normal conditions.'),
('SPOON_SHAPED_NAILS', 'Spoon-Shaped Nails (Koilonychia)', 'NAILS', 'Concave indentations where the nail curves inward like a spoon.'),
('WHITE_SPOTS_NAILS', 'White Spots or Streaks (Leukonychia)', 'NAILS', 'Horizontal white lines or patchy spots across the nail bed.'),
('PALE_NAIL_BEDS', 'Pale or Whitish Nail Beds', 'NAILS', 'Lack of healthy pink color in the subungual capillary beds.'),

-- Eye Symptoms
('NIGHT_BLINDNESS', 'Night Blindness / Poor Low-Light Vision', 'EYES', 'Difficulty adjusting or seeing in dim light or darkness.'),
('BITOT_SPOTS', 'Bitots Spots / Foamy Eye Patches', 'EYES', 'Dry, foamy, silvery triangular patches on the conjunctiva.'),
('PALE_CONJUNCTIVA', 'Pale Conjunctival Mucosa', 'EYES', 'Paleness of the inner lower eyelid membrane.'),
('DRY_EYES', 'Dryness and Burning Sensation (Xerophthalmia)', 'EYES', 'Inadequate tear production and ocular surface dryness.'),

-- Tongue & Oral Symptoms
('GLOSSITIS', 'Swollen / Red / Sore Tongue (Glossitis)', 'TONGUE', 'Smooth, beefy red, or painful inflammation of the tongue.'),
('PALE_TONGUE', 'Pale Tongue Surface', 'TONGUE', 'Loss of vibrant reddish-pink color across the dorsal lingual surface.'),
('BURNING_TONGUE', 'Burning Mouth / Tingling Tongue', 'TONGUE', 'Persistent burning sensation across tongue and oral mucosa.'),

-- Lip Symptoms
('CHEILOSIS', 'Cracked Corners of Mouth (Angular Cheilitis)', 'LIPS', 'Painful sores, red fissures, or cracking at the labial commissures.'),
('DRY_CHAPPED_LIPS', 'Chronic Peeling / Chapped Lips', 'LIPS', 'Persistent scaling and cracking unresponsive to standard balms.'),

-- Skin Symptoms
('FOLLICULAR_HYPERKERATOSIS', 'Rough / Bumpy Skin (Toad Skin)', 'SKIN', 'Hard goosebump-like plugs surrounding hair follicles.'),
('SLOW_WOUND_HEALING', 'Slow Wound Healing / Easy Bruising', 'SKIN', 'Minor cuts taking prolonged periods to heal or frequent unexplained bruises.'),
('DRY_SCALY_SKIN', 'Dry, Flaky, or Scaly Skin', 'SKIN', 'Diffuse xerosis, rough patches, or flaky dermatitis.'),
('HYPERPIGMENTATION', 'Patchy Skin Darkening / Hyperpigmentation', 'SKIN', 'Irregular darker pigment patches on hands, neck, or face.'),

-- Hair Symptoms
('HAIR_LOSS_THINNING', 'Diffuse Hair Thinning / Excessive Shedding', 'HAIR', 'Increased shedding and noticeable reduction in hair density.'),
('DRY_BRITTLE_HAIR', 'Dry, Brittle, or Splitting Hair', 'HAIR', 'Hair strands lacking elasticity and breaking easily.'),
('PREMATURE_GRAYING', 'Early Graying of Hair', 'HAIR', 'Loss of hair pigment at a young age.');
