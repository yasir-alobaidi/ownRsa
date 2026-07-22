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

/** Detect if a location string looks like GPS coordinates. */
export function parseGpsCoords(location: string): { lat: number; lng: number } | null {
  const match = location.trim().match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (!match) return null;
  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}
