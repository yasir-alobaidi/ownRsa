// This site is statically exported (see next.config.ts) so it can be hosted
// on GitHub Pages, which only serves static files -- there's no server
// available to run a traditional API route/backend.
//
// To actually receive request submissions, this form posts straight from
// the visitor's browser to Formspree, a free form-backend service built
// for exactly this (static sites with no server of their own).
//
// Setup (~2 minutes):
//   1. Create a free account at https://formspree.io
//   2. Create a new form and copy its endpoint, e.g. https://formspree.io/f/abcdwxyz
//   3. Paste it below as FORM_ENDPOINT
//   4. Formspree emails you every submission -- no code changes needed after that
//
// Prefer a different provider? Web3Forms, Getform, and Basin all work the
// same way: swap the URL below and adjust the fetch call in
// components/request-form.tsx if the field names need to differ.
export const FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
