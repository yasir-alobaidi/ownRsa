import cors from "cors";
import express from "express";
import twilio from "twilio";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER,
  DISPATCHER_PHONE,
  ALLOWED_ORIGINS,
  RATE_LIMIT_MAX_PER_IP,
  MAX_REQUESTS_PER_DAY,
} = process.env;

// Checked against Twilio's actual Account SID format (AC + 32 hex chars)
// rather than matching our own placeholder text -- this correctly treats
// ANY invalid/unconfigured value as "not configured," not just the literal
// placeholder string that happens to be in .env.example today.
const twilioConfigured =
  TWILIO_ACCOUNT_SID &&
  TWILIO_AUTH_TOKEN &&
  TWILIO_FROM_NUMBER &&
  DISPATCHER_PHONE &&
  /^AC[a-f0-9]{32}$/i.test(TWILIO_ACCOUNT_SID);

let twilioClient = null;
if (twilioConfigured) {
  try {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  } catch (err) {
    // A bad credential should degrade to demo mode, not crash-loop the API.
    console.error("[api] Twilio client failed to initialize, falling back to demo mode:", err.message);
  }
}

// nginx is the only thing that talks to this container (it's `expose`d, not
// `ports`-published, in docker-compose.yml), so there's exactly one hop
// between this app and the real client -- trusting exactly 1 (rather than
// `true`, which trusts every hop in whatever X-Forwarded-For chain arrives)
// means a client can't defeat the rate limiter by prepending fake IPs of
// their own before it ever reaches nginx. nginx itself resolves Cloudflare's
// real-IP headers before this ever sees the request (see nginx.conf).
app.set("trust proxy", 1);

const allowedOrigins = (ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    // Same-origin calls through the nginx proxy, and any non-browser caller
    // (curl, server-to-server), send no Origin header -- only cross-origin
    // browser requests do, so this only needs to gate those.
    origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)),
  })
);
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, twilioConfigured: Boolean(twilioClient) });
});

function parseGpsCoords(location) {
  const match = String(location || "")
    .trim()
    .match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (!match) return null;

  return normalizeGpsCoords(match[1], match[2]);
}

function normalizeGpsCoords(latInput, lngInput) {
  if (latInput == null || lngInput == null) return null;

  const lat = Number(latInput);
  const lng = Number(lngInput);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return {
    lat,
    lng,
    display: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
  };
}

function googleMapsUrl(location, coords) {
  if (coords) {
    return `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    String(location || "").trim()
  )}`;
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function buildSmsBody(data) {
  const lines = [
    `NEW SERVICE REQUEST - ${data.referenceId}`,
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email || "(not provided)"}`,
    "",
    `Services: ${data.services}`,
    "",
    `Location: ${data.location}`,
  ];

  if (data.gps && data.location !== data.gps.display) {
    lines.push(`GPS: ${data.gps.display}`);
  }

  if (data.mapsUrl) {
    lines.push(`Google Maps: ${data.mapsUrl}`);
  }

  if (data.locationNotes && data.locationNotes !== "(none)") {
    lines.push("");
    lines.push(`Notes: ${data.locationNotes}`);
  }

  lines.push("");
  lines.push("Call the customer back to confirm and dispatch help.");

  return lines.join("\n");
}

function isUsPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10) return true;
  if (digits.length === 11 && digits.startsWith("1")) return true;
  return false;
}

// --- Abuse protection ----------------------------------------------------
// Every accepted request costs real money (one Twilio SMS) and interrupts a
// real dispatcher, so this is layered rather than relying on just one check:
// per-IP throttling, a hard daily ceiling (bounds worst-case spend even from
// many IPs at once), and de-duping identical back-to-back submissions. State
// is in-memory, which is fine for a single API instance -- it resets on
// redeploy, which only ever loosens limits, never unsafely tightens them.

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = Number(RATE_LIMIT_MAX_PER_IP) || 8;
const DAILY_MAX = Number(MAX_REQUESTS_PER_DAY) || 300;
const DEDUPE_WINDOW_MS = 2 * 60 * 1000;

const hitsByIp = new Map(); // ip -> { count, resetAt }
const recentSubmissions = new Map(); // "phone|services|location" -> expiresAt
let dailyCount = 0;
let dailyResetAt = Date.now() + 24 * 60 * 60 * 1000;

function checkIpRateLimit(ip) {
  const now = Date.now();
  const entry = hitsByIp.get(ip);
  if (!entry || entry.resetAt < now) {
    hitsByIp.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

function checkDailyCap() {
  const now = Date.now();
  if (now > dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = now + 24 * 60 * 60 * 1000;
  }
  if (dailyCount >= DAILY_MAX) return false;
  dailyCount += 1;
  return true;
}

function isDuplicateSubmission(key) {
  const now = Date.now();
  const expiresAt = recentSubmissions.get(key);
  if (expiresAt && expiresAt > now) return true;
  recentSubmissions.set(key, now + DEDUPE_WINDOW_MS);
  return false;
}

app.post("/api/request", async (req, res) => {
  if (!checkIpRateLimit(req.ip)) {
    return res.status(429).json({ error: "Too many requests. Please call us directly." });
  }

  const {
    name,
    phone,
    email,
    services,
    location,
    gpsLat,
    gpsLng,
    locationNotes,
    referenceId,
    website, // honeypot -- real users never see or fill this field
  } = req.body || {};

  const ref = cleanString(referenceId) || `TRA-${Date.now().toString(36).toUpperCase()}`;

  if (cleanString(website)) {
    // Looks like a bot: pretend success so it doesn't retry, but never spend
    // an SMS or wake up the dispatcher over it.
    return res.json({ ok: true, referenceId: ref });
  }

  const cleanName = cleanString(name);
  const cleanPhone = cleanString(phone);
  const cleanServices = cleanString(services);
  const cleanLocationInput = cleanString(location);

  if (!cleanName || !cleanPhone || !cleanServices || !cleanLocationInput) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  if (!isUsPhone(cleanPhone)) {
    return res.status(400).json({
      error: "We currently serve customers with US phone numbers only.",
    });
  }

  if (isDuplicateSubmission(`${cleanPhone}|${cleanServices}|${cleanLocationInput}`)) {
    // Same person, same request, twice within 2 minutes -- almost certainly
    // a double-click or a client retry, not a second real request.
    return res.json({ ok: true, referenceId: ref, duplicate: true });
  }

  if (!checkDailyCap()) {
    console.warn("[api] Daily request cap reached — rejecting further requests today.");
    return res.status(429).json({
      error: "We've hit our request limit for today. Please call us directly.",
    });
  }
  const submittedGps = normalizeGpsCoords(gpsLat, gpsLng);
  const typedGps = parseGpsCoords(cleanLocationInput);
  const gps = submittedGps || typedGps;
  const cleanLocation = gps && typedGps ? gps.display : cleanLocationInput;
  const mapsUrl = googleMapsUrl(cleanLocation, gps);
  const smsBody = buildSmsBody({
    referenceId: ref,
    name: cleanName,
    phone: cleanPhone,
    email: cleanString(email) || "(not provided)",
    services: cleanServices,
    location: cleanLocation,
    gps,
    locationNotes: cleanString(locationNotes) || "(none)",
    mapsUrl,
  });

  if (!twilioClient) {
    console.warn("[api] Twilio not configured — request logged but SMS not sent:");
    console.warn(smsBody);
    return res.json({ ok: true, referenceId: ref, demo: true });
  }

  try {
    await twilioClient.messages.create({
      body: smsBody,
      from: TWILIO_FROM_NUMBER,
      to: DISPATCHER_PHONE,
    });
    return res.json({ ok: true, referenceId: ref });
  } catch (err) {
    console.error("[api] Twilio SMS failed:", err);
    return res.status(502).json({
      error: "Could not notify dispatch. Please call us directly.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`[api] listening on :${PORT} (twilio: ${twilioClient ? "on" : "demo"})`);
});
