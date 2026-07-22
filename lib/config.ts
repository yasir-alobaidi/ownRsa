// Request submissions are sent to our SMS API, which texts the dispatcher
// via Twilio. In Docker, nginx proxies /api/* to the api service.
//
// For local dev without Docker, run the api server (see README) and set
// NEXT_PUBLIC_API_URL=http://localhost:3001/api/request in .env.local
export const REQUEST_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/request";
