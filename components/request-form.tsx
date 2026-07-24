"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SERVICES, BUSINESS, type ServiceId } from "@/lib/services";
import { REQUEST_API_URL } from "@/lib/config";
import {
  formatGpsForMaps,
  googleMapsUrl,
  parseGpsCoords,
} from "@/lib/location";
import {
  SERVICE_ICONS,
  CheckOnlyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  AlertIcon,
  LocationCrosshairIcon,
} from "./icons";

interface FormState {
  services: ServiceId[];
  notSure: boolean;
  location: string;
  gpsLat: number | null;
  gpsLng: number | null;
  locationNotes: string;
  name: string;
  phone: string;
  email: string;
}

const INITIAL_STATE: FormState = {
  services: [],
  notSure: false,
  location: "",
  gpsLat: null,
  gpsLng: null,
  locationNotes: "",
  name: "",
  phone: "",
  email: "",
};

const STEP_LABELS = ["Services", "Location", "Contact"];

function isPhoneLikelyValid(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10;
}

function getMapsUrl(location: string, gpsLat: number | null, gpsLng: number | null) {
  if (gpsLat != null && gpsLng != null) {
    return googleMapsUrl(location, gpsLat, gpsLng);
  }
  const parsed = parseGpsCoords(location);
  if (parsed) {
    return googleMapsUrl(location, parsed.lat, parsed.lng);
  }
  return googleMapsUrl(location);
}

export function RequestForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(() => {
    // Lets a link like /request/?service=towing (used by the per-service
    // landing pages) arrive with that service already checked.
    const preselect = searchParams.get("service");
    if (preselect && SERVICES.some((s) => s.id === preselect)) {
      return { ...INITIAL_STATE, services: [preselect as ServiceId] };
    }
    return INITIAL_STATE;
  });
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, referenceId]);

  const step1Valid = data.services.length > 0 || data.notSure;
  const step2Valid = data.location.trim().length > 0;
  const step3Valid = data.name.trim().length > 0 && isPhoneLikelyValid(data.phone);

  const mapsLink = data.location.trim()
    ? getMapsUrl(data.location, data.gpsLat, data.gpsLng)
    : null;

  function toggleService(id: ServiceId) {
    setData((prev) => ({
      ...prev,
      notSure: false,
      services: prev.services.includes(id)
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id],
    }));
  }

  function toggleNotSure() {
    setData((prev) => ({ ...prev, notSure: !prev.notSure, services: [] }));
  }

  function goNext() {
    setTouched(true);
    if (step === 1 && !step1Valid) return;
    if (step === 2 && !step2Valid) return;
    setTouched(false);
    setStep((s) => Math.min(3, s + 1));
  }

  function goBack() {
    setTouched(false);
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!step3Valid) return;

    setSubmitting(true);
    setSubmitError(null);

    const serviceNames = data.notSure
      ? "Not sure yet"
      : data.services.map((id) => SERVICES.find((s) => s.id === id)?.name).join(", ");

    const ref = `TRA-${Date.now().toString(36).toUpperCase()}`;
    const mapsUrl = getMapsUrl(data.location, data.gpsLat, data.gpsLng);

    const payload = {
      referenceId: ref,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim() || "",
      services: serviceNames,
      location: data.location.trim(),
      gpsLat: data.gpsLat,
      gpsLng: data.gpsLng,
      locationNotes: data.locationNotes.trim() || "(none)",
      mapsUrl,
      website: honeypotRef.current?.value || "",
    };

    try {
      const res = await fetch(REQUEST_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          typeof body.error === "string"
            ? body.error
            : "Something went wrong. Please call us instead."
        );
      }

      setReferenceId(body.referenceId || ref);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please call us instead."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function useMyLocation() {
    if (!("geolocation" in navigator)) {
      setGeoError("GPS is not available in this browser.");
      return;
    }

    setLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setData((prev) => ({
          ...prev,
          location: formatGpsForMaps(latitude, longitude),
          gpsLat: latitude,
          gpsLng: longitude,
        }));
        setLocating(false);
      },
      () => {
        setGeoError("Could not get your location. Type your address or cross streets instead.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  function handleLocationChange(value: string) {
    const parsed = parseGpsCoords(value);
    setData((prev) => ({
      ...prev,
      location: value,
      gpsLat: parsed?.lat ?? null,
      gpsLng: parsed?.lng ?? null,
    }));
  }

  if (referenceId) {
    return (
      <div className="request-card success-screen">
        <div className="success-icon">
          <CheckIcon />
        </div>
        <h2>Request received!</h2>
        <p>
          Thanks{data.name ? `, ${data.name.split(" ")[0]}` : ""} — a dispatcher will
          call you at <strong>{data.phone}</strong> shortly to confirm the details
          and get you help.
        </p>
        <p>
          You should also get a confirmation text at that number within a minute or
          two. If you don't, your request may not have gone through — please call us
          at <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phoneDisplay}</a> or try
          submitting again.
        </p>
        <p className="ref">Reference: {referenceId}</p>
      </div>
    );
  }

  return (
    <>
      <div className="step-tracker">
        {STEP_LABELS.map((label, i) => {
          const idx = i + 1;
          const state = idx < step ? "done" : idx === step ? "current" : "";
          return (
            <div key={label} style={{ display: "contents" }}>
              {i > 0 && <div className={`track${idx <= step ? " done" : ""}`} />}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className={`dot ${state}`}>{idx < step ? <CheckOnlyIcon width={16} height={16} /> : idx}</div>
                <div className="label">{label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div className="request-card">
          <h2>What do you need help with?</h2>
          <p className="step-sub">Tap everything that applies — you can pick more than one.</p>
          <div className="service-check-grid">
            {SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.id];
              const checked = data.services.includes(service.id);
              return (
                <label className={`service-check${checked ? " checked" : ""}`} key={service.id}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleService(service.id)}
                  />
                  <Icon className="icon" />
                  <span className="content">
                    <span className="name">{service.name}</span>
                    <span className="desc">{service.description}</span>
                  </span>
                  <span className="box">
                    <CheckOnlyIcon />
                  </span>
                </label>
              );
            })}
          </div>
          <label className={`service-check not-sure-check${data.notSure ? " checked" : ""}`}>
            <input type="checkbox" checked={data.notSure} onChange={toggleNotSure} />
            <span className="content">
              <span className="name">Not sure — I'll explain on the phone</span>
            </span>
            <span className="box">
              <CheckOnlyIcon />
            </span>
          </label>
          {touched && !step1Valid && (
            <p className="form-error">Pick at least one option, or &quot;Not sure&quot;.</p>
          )}
          <div className="request-nav">
            <span className="spacer" />
            <button type="button" className="btn btn-primary" onClick={goNext}>
              Next: Location
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="request-card">
          <h2>Where are you?</h2>
          <p className="step-sub">
            Street address, cross streets, mile marker, or GPS — whatever gets our driver to you fastest.
          </p>
          <div className="form-group">
            <label htmlFor="rf-location">Location</label>
            <input
              id="rf-location"
              type="text"
              placeholder="e.g. I-35E near Mockingbird Ln, Dallas"
              value={data.location}
              onChange={(e) => handleLocationChange(e.target.value)}
            />
            {touched && !step2Valid && <p className="form-error">Let us know roughly where you are.</p>}
            <button
              type="button"
              className="geo-btn"
              onClick={useMyLocation}
              disabled={locating}
            >
              <LocationCrosshairIcon />
              {locating ? "Getting GPS\u2026" : "Use my current GPS location"}
            </button>
            {geoError && <p className="form-error">{geoError}</p>}
            {mapsLink && (
              <p className="geo-hint">
                Google Maps ready — copy{" "}
                <code className="geo-coords">{data.location}</code> or{" "}
                <a href={mapsLink} target="_blank" rel="noopener noreferrer">
                  open directions
                </a>
                .
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="rf-notes">
              Anything else that helps us find you? <span className="optional">(optional)</span>
            </label>
            <textarea
              id="rf-notes"
              rows={3}
              placeholder="e.g. silver Honda Civic, shoulder of the highway, near exit 34"
              value={data.locationNotes}
              onChange={(e) => setData((p) => ({ ...p, locationNotes: e.target.value }))}
            />
          </div>
          <div className="request-nav">
            <button type="button" className="btn btn-outline" onClick={goBack}>
              <ChevronLeftIcon />
              Back
            </button>
            <button type="button" className="btn btn-primary" onClick={goNext}>
              Next: Contact Info
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form className="request-card" onSubmit={handleSubmit} noValidate>
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            className="hp-field"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            defaultValue=""
          />
          <h2>How can we reach you?</h2>
          <p className="step-sub">
            Phone and name are all we need. A dispatcher will text-alert our team and call you back right away.
          </p>

          <div className="review-list">
            <div className="review-row">
              <span className="k">Services</span>
              <span className={`v${data.services.length === 0 && !data.notSure ? " empty" : ""}`}>
                {data.notSure
                  ? "Not sure yet"
                  : data.services.length > 0
                    ? data.services.map((id) => SERVICES.find((s) => s.id === id)?.name).join(", ")
                    : "None selected"}
              </span>
            </div>
            <div className="review-row">
              <span className="k">Location</span>
              <span className={`v${!data.location ? " empty" : ""}`}>
                {data.location || "Not provided"}
                {mapsLink && data.location && (
                  <>
                    {" "}
                    (<a href={mapsLink} target="_blank" rel="noopener noreferrer">Maps</a>)
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="rf-name">Your Name</label>
            <input
              id="rf-name"
              type="text"
              placeholder="John Smith"
              value={data.name}
              onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="rf-phone">Phone Number (US)</label>
            <input
              id="rf-phone"
              type="tel"
              placeholder="(945) 555-0100"
              value={data.phone}
              onChange={(e) => setData((p) => ({ ...p, phone: e.target.value }))}
            />
            {touched && !step3Valid && (
              <p className="form-error">A valid name and US phone number are required.</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="rf-email">
              Email <span className="optional">(optional)</span>
            </label>
            <input
              id="rf-email"
              type="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => setData((p) => ({ ...p, email: e.target.value }))}
            />
          </div>

          {submitError && (
            <div className="submit-error">
              <AlertIcon />
              {submitError}
            </div>
          )}

          <p className="form-consent">
            By submitting, you agree to our <Link href="/terms/">Terms of Service</Link> and{" "}
            <Link href="/privacy/">Privacy Policy</Link>.
          </p>

          <div className="request-nav">
            <button type="button" className="btn btn-outline" onClick={goBack} disabled={submitting}>
              <ChevronLeftIcon />
              Back
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Sending\u2026" : "Submit Request"}
            </button>
          </div>
        </form>
      )}

      {!referenceId && (
        <p className="request-footnote">
          Need help immediately?{" "}
          <a href={`tel:${BUSINESS.phoneTel}`}>Just call {BUSINESS.phoneDisplay} instead</a>.
        </p>
      )}
    </>
  );
}
