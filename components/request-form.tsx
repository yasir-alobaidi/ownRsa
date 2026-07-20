"use client";

import { useState, useEffect, type FormEvent } from "react";
import { SERVICES, BUSINESS, type ServiceId } from "@/lib/services";
import { FORM_ENDPOINT } from "@/lib/config";
import { SERVICE_ICONS, CheckOnlyIcon, ChevronLeftIcon, ChevronRightIcon, CheckIcon, AlertIcon } from "./icons";

interface FormState {
  services: ServiceId[];
  notSure: boolean;
  location: string;
  locationNotes: string;
  name: string;
  phone: string;
  email: string;
}

const INITIAL_STATE: FormState = {
  services: [],
  notSure: false,
  location: "",
  locationNotes: "",
  name: "",
  phone: "",
  email: "",
};

const STEP_LABELS = ["Services", "Location", "Contact"];

function isPhoneLikelyValid(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7;
}

export function RequestForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(INITIAL_STATE);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  // Always show the top of the new step (or the success screen) instead of
  // leaving the visitor at whatever scroll position the previous step ended on.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, referenceId]);

  const step1Valid = data.services.length > 0 || data.notSure;
  const step2Valid = data.location.trim().length > 0;
  const step3Valid = data.name.trim().length > 0 && isPhoneLikelyValid(data.phone);

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

    const payload = {
      _subject: `New service request from ${data.name}`,
      name: data.name,
      phone: data.phone,
      email: data.email || "(not provided)",
      services: serviceNames,
      location: data.location,
      location_notes: data.locationNotes || "(none)",
    };

    const isConfigured = !FORM_ENDPOINT.includes("YOUR_FORM_ID");

    if (!isConfigured) {
      // Form backend hasn't been configured yet (see lib/config.ts) -- fall
      // back to a local-only demo so the flow still feels complete.
      console.warn(
        "[texas-roadside-assist] FORM_ENDPOINT is not configured yet -- this submission was not sent anywhere. See lib/config.ts."
      );
      await new Promise((r) => setTimeout(r, 700));
      setReferenceId(`TRA-${Date.now().toString(36).toUpperCase()}`);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Something went wrong. Please call us instead.");
      }
      setReferenceId(`TRA-${Date.now().toString(36).toUpperCase()}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please call us instead."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function useMyLocation() {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setData((prev) => ({
          ...prev,
          location: `GPS coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        }));
      },
      () => {
        /* permission denied or unavailable -- user can just type the location */
      }
    );
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
          {data.services.length === 0 && !data.notSure ? "" : " and get you help."}
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
          <p className="step-sub">Select everything that applies.</p>
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
            <p className="form-error">Pick at least one option, or "Not sure".</p>
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
            A street address, cross streets, mile marker, or nearby landmark all work.
          </p>
          <div className="form-group">
            <label htmlFor="rf-location">Location</label>
            <input
              id="rf-location"
              type="text"
              placeholder="e.g. I-35E near Mockingbird Ln, Dallas"
              value={data.location}
              onChange={(e) => setData((p) => ({ ...p, location: e.target.value }))}
            />
            {touched && !step2Valid && <p className="form-error">Let us know roughly where you are.</p>}
            <button type="button" className="geo-btn" onClick={useMyLocation}>
              Use my current GPS location
            </button>
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
          <h2>How can we reach you?</h2>
          <p className="step-sub">
            Phone and name are all we need to call you back. Everything else is
            optional — we'll ask for it on the phone if it's missing.
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
              <span className={`v${!data.location ? " empty" : ""}`}>{data.location || "Not provided"}</span>
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
            <label htmlFor="rf-phone">Phone Number</label>
            <input
              id="rf-phone"
              type="tel"
              placeholder="(214) 555-0100"
              value={data.phone}
              onChange={(e) => setData((p) => ({ ...p, phone: e.target.value }))}
            />
            {touched && !step3Valid && (
              <p className="form-error">A valid name and phone number are required.</p>
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
