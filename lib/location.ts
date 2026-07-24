/** Format lat/lng so it can be pasted directly into Google Maps search. */
export function formatGpsForMaps(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

/** Build a Google Maps URL for directions / navigation. */
export function googleMapsUrl(location: string, lat?: number | null, lng?: number | null): string {
  if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.trim())}`;
}

function toValidCoords(latStr: string, lngStr: string): { lat: number; lng: number } | null {
  const lat = Number(latStr);
  const lng = Number(lngStr);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

// Long-form Google Maps URLs embed the coordinates directly in the URL text
// in one of a few different spots depending on how the link was generated
// (viewport marker, query param, or the internal place-pin encoding).
// Shortened maps.app.goo.gl links resolve via a server-side redirect we
// can't follow from the browser, so those still need to be typed out.
const GOOGLE_MAPS_URL_PATTERNS = [
  /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/, // https://www.google.com/maps?q=32.7767,-96.797
  /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/, // older ?ll=lat,lng links
  /@(-?\d+\.\d+),(-?\d+\.\d+)/, // .../maps/@32.7767,-96.797,15z
  /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, // .../maps/place/.../!3d32.7767!4d-96.797
];

function parseGoogleMapsUrl(text: string): { lat: number; lng: number } | null {
  for (const pattern of GOOGLE_MAPS_URL_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const coords = toValidCoords(match[1], match[2]);
      if (coords) return coords;
    }
  }
  return null;
}

/** Detect if a location string looks like GPS coordinates, or a pasted Google Maps link containing them. */
export function parseGpsCoords(location: string): { lat: number; lng: number } | null {
  const trimmed = location.trim();
  const match = trimmed.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (match) {
    const coords = toValidCoords(match[1], match[2]);
    if (coords) return coords;
  }
  return parseGoogleMapsUrl(trimmed);
}
