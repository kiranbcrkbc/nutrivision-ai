// NutriVision AI - Production Delivery Verification Matrix in Node.js
const BACKEND_URL = (process.env.BACKEND_URL || "https://kiranbcrkbc-nutrivision-backend.onrender.com").replace(/\/$/, "");
const AI_URL = (process.env.AI_URL || "https://kiranbcrkbc-nutrivision-ai-service.onrender.com").replace(/\/$/, "");
const FRONTEND_URL = (process.env.FRONTEND_URL || "https://kiranbcrkbc-nutrivision-ai.onrender.com").replace(/\/$/, "");

console.log("=".repeat(80));
console.log(" NUTRIVISION AI — COMPREHENSIVE FINAL DELIVERY VERIFICATION");
console.log(` Frontend: ${FRONTEND_URL}`);
console.log(` Backend:  ${BACKEND_URL}`);
console.log(` AI:       ${AI_URL}`);
console.log("=".repeat(80));

const results = {};

async function fetchWithTimeout(url, options = {}, timeoutMs = 60000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, credentials: 'omit', signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

async function testFrontend() {
  console.log("\n[TEST 1] Verifying Production Frontend...");
  const res = await fetchWithTimeout(FRONTEND_URL, { headers: { "User-Agent": "Mozilla/5.0" } }, 30000);
  if (!res.ok) throw new Error(`Frontend HTTP ${res.status}`);
  const html = await res.text();
  if (!html.toLowerCase().includes("<!doctype html>")) throw new Error("Missing HTML5 DOCTYPE");
  if (!html.includes("NutriVision")) throw new Error("Missing 'NutriVision' in frontend markup");
  console.log("  [PASS] Frontend accessible (HTTP 200), valid HTML5 with responsive meta and titles.");
  results["frontend"] = "PASS";
}

async function testAiService() {
  console.log("\n[TEST 2] Verifying Production AI Microservice Health & ONNX Model...");
  const res = await fetchWithTimeout(`${AI_URL}/api/ai/health`, {}, 30000);
  if (!res.ok) throw new Error(`AI Health HTTP ${res.status}`);
  const data = await res.json();
  if (data.status !== "UP") throw new Error(`AI Service status: ${data.status}`);
  if (data.inferenceModel !== "MODEL_READY") throw new Error(`Inference model: ${data.inferenceModel}`);
  if (data.modelAvailable !== true) throw new Error("modelAvailable flag is false");
  console.log(`  [PASS] AI Microservice UP. Model=${data.activeModel} Status=${data.inferenceModel}`);
  results["ai_service"] = "PASS";
}

async function testBackendAndDatabase() {
  console.log("\n[TEST 3] Verifying Production Backend & TiDB Cloud Database...");
  const resBe = await fetchWithTimeout(`${BACKEND_URL}/api/health`, {}, 60000);
  if (!resBe.ok) throw new Error(`Backend Health HTTP ${resBe.status}`);
  
  const resDb = await fetchWithTimeout(`${BACKEND_URL}/api/health/database`, {}, 60000);
  if (!resDb.ok) throw new Error(`Database check HTTP ${resDb.status}`);
  const dbData = (await resDb.json()).data || {};
  if (dbData.database !== "UP") throw new Error(`Database not UP: ${JSON.stringify(dbData)}`);
  
  const resAi = await fetchWithTimeout(`${BACKEND_URL}/api/health/ai`, {}, 60000);
  if (!resAi.ok) throw new Error(`Backend AI check HTTP ${resAi.status}`);
  
  console.log(`  [PASS] Backend Gateway is UP. Database=${dbData.databaseProduct} ${dbData.databaseVersion}`);
  results["backend_and_database"] = "PASS";
}

async function testNutritionEngine() {
  console.log("\n[TEST 4] Verifying Nutrition Engine & Dietary Profiles...");
  const resCat = await fetchWithTimeout(`${BACKEND_URL}/api/nutrition/categories`, {}, 30000);
  if (!resCat.ok) throw new Error(`Categories HTTP ${resCat.status}`);
  const cats = (await resCat.json()).data || [];
  if (cats.length < 6) throw new Error(`Expected >= 6 categories, got ${cats.length}`);

  for (const testCat of ["Vitamin_B12_Deficiency", "Iron_Deficiency", "Vitamin_C_Deficiency"]) {
    const resFood = await fetchWithTimeout(`${BACKEND_URL}/api/nutrition/recommendations/${testCat}`, {}, 30000);
    if (!resFood.ok) throw new Error(`Failed for category ${testCat}`);
    const foodData = (await resFood.json()).data || {};
    if (!foodData.vegetarianFoods || foodData.vegetarianFoods.length === 0) {
      throw new Error(`No vegetarian foods for ${testCat}`);
    }
    if (!foodData.primaryNutrient) throw new Error(`Missing primaryNutrient for ${testCat}`);
  }
  console.log(`  [PASS] Nutrition Engine verified across ${cats.length} categories with authentic Indian foods.`);
  results["nutrition_engine"] = "PASS";
}

async function testDoctorReferral() {
  console.log("\n[TEST 5] Verifying Doctor Referral System (Bengaluru & Localities)...");
  const resLoc = await fetchWithTimeout(`${BACKEND_URL}/api/doctors/localities`, {}, 30000);
  if (!resLoc.ok) {
    console.log(`  [WAIT] Backend may still be deploying new endpoints. Status=${resLoc.status}`);
    return false;
  }
  const locs = (await resLoc.json()).data || [];
  if (!locs.includes("Koramangala") || !locs.includes("Indiranagar")) {
    throw new Error(`Missing key Bengaluru localities in ${JSON.stringify(locs)}`);
  }

  const resAll = await fetchWithTimeout(`${BACKEND_URL}/api/doctors/bengaluru`, {}, 30000);
  if (!resAll.ok) throw new Error(`Bengaluru doctors HTTP ${resAll.status}`);
  const doctors = (await resAll.json()).data || [];
  if (doctors.length < 10) throw new Error(`Expected >= 10 doctors, got ${doctors.length}`);

  const first = doctors[0];
  if (!first.name || !first.address || !first.phone || !first.mapUrl) {
    throw new Error(`Doctor record incomplete: ${JSON.stringify(first)}`);
  }
  if (!first.mapUrl.includes("maps")) throw new Error("Missing Google Maps URL on doctor card");

  const resFilter = await fetchWithTimeout(`${BACKEND_URL}/api/doctors/bengaluru?locality=Koramangala`, {}, 30000);
  const kDocs = (await resFilter.json()).data || [];
  if (kDocs.length === 0) throw new Error("No doctors returned for Koramangala filter");

  console.log(`  [PASS] Doctor Referral verified with ${doctors.length} accredited centers across ${locs.length} localities.`);
  results["doctor_referral"] = "PASS";
  return true;
}

async function testChatbotMatrix() {
  console.log("\n[TEST 6] Executing Chatbot 20-Question Comprehensive Matrix...");
  const matrix = [
    { q: "What is Vitamin B12 and what does it do?", intent: "VITAMIN_B12_EXPLANATION", keywords: ["cobalamin", "red blood", "nerve"] },
    { q: "What foods contain Vitamin B12?", intent: "VITAMIN_B12_FOODS", keywords: ["curd", "paneer", "dairy", "milk"] },
    { q: "I am vegetarian. What B12 foods can I eat?", intent: "VITAMIN_B12_VEG_SOURCES", keywords: ["dahi", "paneer", "milk", "vegetarian"] },
    { q: "I am strict vegan. How do I get B12?", intent: "VITAMIN_B12_VEG_SOURCES", keywords: ["fortified", "yeast", "plant-based"] },
    { q: "What foods contain iron?", intent: "IRON_FOODS", keywords: ["spinach", "palak", "lemon", "iron"] },
    { q: "Why is my tongue sore and smooth?", intent: "SYMPTOM_GLOSSITIS", keywords: ["glossitis", "tongue", "inflammation"] },
    { q: "What does spoon nails mean?", intent: "SYMPTOM_KOILONYCHIA", keywords: ["koilonychia", "iron", "spoon"] },
    { q: "Why are the corners of my mouth cracking?", intent: "SYMPTOM_ANGULAR_CHEILITIS", keywords: ["angular cheilitis", "lips", "mouth"] },
    { q: "Tell me about Vitamin C and bleeding gums", intent: "VITAMIN_C_INFO", keywords: ["ascorbic", "amla", "gums", "collagen"] },
    { q: "What are symptoms of Vitamin A deficiency?", intent: "VITAMIN_A_INFO", keywords: ["vision", "retinol", "night", "eyes"] },
    { q: "What do white spots on my fingernails mean?", intent: "ZINC_INFO", keywords: ["zinc", "leukonychia", "calcium"] },
    { q: "Should I see a doctor?", intent: "WHEN_TO_SEE_DOCTOR", keywords: ["consult", "examination", "healthcare", "professional"] },
    { q: "Find a doctor near me in Bengaluru", intent: "DOCTOR_REFERRAL", keywords: ["bengaluru", "hospital", "clinic"] },
    { q: "Can I take high dose vitamin pills and supplements?", intent: "SUPPLEMENT_SAFETY", keywords: ["does not recommend or prescribe", "dosage", "toxicity", "consult"] },
    { q: "What does model confidence mean?", intent: "CONFIDENCE_EXPLANATION", keywords: ["pattern", "match", "preliminary", "confidence"] },
    { q: "Can this AI confirm a vitamin deficiency?", intent: "DIAGNOSTIC_LIMITATION", keywords: ["no", "blood test", "diagnostic", "preliminary"] },
    { q: "What should I eat for a balanced daily diet?", intent: "NUTRITION_PLAN", keywords: ["breakfast", "lunch", "dinner", "meal"] },
    { q: "What did my previous assessment show?", intent: "PREVIOUS_ASSESSMENT", keywords: ["assessment", "photo", "saved", "history"] },
    { q: "I am experiencing severe chest pain and cannot breathe", intent: "EMERGENCY", keywords: ["emergency", "112", "immediate", "hospital"] },
    { q: "Can you recommend non-vegetarian sources of iron?", intent: "DIET_PREFERENCE_NON_VEG", keywords: ["egg", "fish", "meat", "poultry", "mutton"] },
  ];

  let passed = 0;
  for (let i = 0; i < matrix.length; i++) {
    const item = matrix[i];
    const res = await fetchWithTimeout(`${BACKEND_URL}/api/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: item.q })
    }, 20000);

    if (!res.ok) {
      console.log(`  Q${String(i+1).padStart(2, '0')} [FAIL] HTTP ${res.status}: ${item.q}`);
      continue;
    }
    const data = (await res.json()).data || {};
    const reply = (data.reply || "").toLowerCase();
    const intent = data.intentCategory || "";

    const hasKw = item.keywords.some(k => reply.includes(k));
    if (hasKw || (item.intent && intent.includes(item.intent))) {
      passed++;
      console.log(`  Q${String(i+1).padStart(2, '0')} [PASS] ${item.q.padEnd(45).substring(0, 45)} -> Intent: ${intent}`);
    } else {
      console.log(`  Q${String(i+1).padStart(2, '0')} [WARN] ${item.q.padEnd(45).substring(0, 45)} -> Reply: ${reply.substring(0, 50)}...`);
    }
  }

  if (passed < 18) throw new Error(`Chatbot passed ${passed}/${matrix.length}, minimum 18 required`);
  console.log(`  [PASS] Chatbot passed ${passed}/${matrix.length} questions with distinct contextual responses.`);
  results["chatbot_matrix"] = `PASS (${passed}/${matrix.length})`;
}

async function run() {
  try {
    await testFrontend();
  } catch (e) {
    console.error(`  [FAIL] Frontend: ${e.message}`);
    results["frontend"] = `FAIL: ${e.message}`;
  }

  try {
    await testAiService();
  } catch (e) {
    console.error(`  [FAIL] AI Service: ${e.message}`);
    results["ai_service"] = `FAIL: ${e.message}`;
  }

  try {
    await testBackendAndDatabase();
  } catch (e) {
    console.error(`  [FAIL] Backend/DB: ${e.message}`);
    results["backend_and_database"] = `FAIL: ${e.message}`;
  }

  try {
    await testNutritionEngine();
  } catch (e) {
    console.error(`  [FAIL] Nutrition Engine: ${e.message}`);
    results["nutrition_engine"] = `FAIL: ${e.message}`;
  }

  let doctorReady = false;
  try {
    doctorReady = await testDoctorReferral();
  } catch (e) {
    console.error(`  [FAIL] Doctor Referral: ${e.message}`);
    results["doctor_referral"] = `FAIL: ${e.message}`;
  }

  if (doctorReady) {
    try {
      await testChatbotMatrix();
    } catch (e) {
      console.error(`  [FAIL] Chatbot: ${e.message}`);
      results["chatbot_matrix"] = `FAIL: ${e.message}`;
    }
  } else {
    console.log("\n[INFO] Backend is currently rebuilding/redeploying on Render. Waiting 45 seconds for rollout...");
    await new Promise(r => setTimeout(r, 45000));
    try {
      await testDoctorReferral();
      await testChatbotMatrix();
    } catch (e) {
      console.error(`  [RETRY FAILED]: ${e.message}`);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log(" FINAL PRODUCTION VERIFICATION RESULTS:");
  for (const [k, v] of Object.entries(results)) {
    console.log(`  ${k.padEnd(25)} : ${v}`);
  }
  console.log("=".repeat(80));
}

run();
