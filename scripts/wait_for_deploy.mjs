// Poll backend until new container with /api/doctors/localities goes live
const BACKEND_URL = "https://kiranbcrkbc-nutrivision-backend.onrender.com";

async function checkDeployment() {
  console.log(`Checking Render deployment status at ${new Date().toISOString()}...`);
  try {
    const res = await fetch(`${BACKEND_URL}/api/doctors/localities`);
    const status = res.status;
    const body = await res.json().catch(() => ({}));
    console.log(`Status: ${status}, Body:`, body.success ? `SUCCESS (${body.data?.length} localities)` : (body.message || body.code));
    if (res.ok && body.success) {
      console.log(">>> NEW DEPLOYMENT IS LIVE! <<<");
      return true;
    }
  } catch (e) {
    console.log("Fetch error (service might be restarting):", e.message);
  }
  return false;
}

async function loop() {
  for (let i = 0; i < 20; i++) {
    const ready = await checkDeployment();
    if (ready) {
      process.exit(0);
    }
    console.log(`Waiting 20s for Docker build/rollout on Render (attempt ${i + 1}/20)...`);
    await new Promise(r => setTimeout(r, 20000));
  }
  console.log("Timeout waiting for deployment.");
  process.exit(1);
}

loop();
