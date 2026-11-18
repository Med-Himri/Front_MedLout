// Google Analytics 4 helpers.
//
// GA is OFF until NEXT_PUBLIC_GA_ID (the "G-XXXXXXXXXX" Measurement ID) is set
// in Vercel (front-med-lout → Settings → Environment Variables), then redeployed.

export const GA_ID = (process.env.NEXT_PUBLIC_GA_ID || "").trim();
export const GA_CURRENCY = "MAD";

/**
 * Google's standard gtag setup (queue + config), done once. Calls made before
 * gtag.js has loaded wait in window.dataLayer, so early events are not lost.
 */
export function ensureGtag() {
  if (!GA_ID || typeof window === "undefined" || window.__medloutGaReady) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments); // gtag.js expects the arguments object
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
  window.__medloutGaReady = true;
}

/** Sends a GA4 event, e.g. gaEvent("add_to_cart", {...}). Does nothing while GA is off. */
export function gaEvent(name, params = {}) {
  if (!GA_ID || typeof window === "undefined" || window.location.pathname.startsWith("/dashboard")) return;
  ensureGtag();
  window.gtag("event", name, params);
}

/** GA4 e-commerce parameters for a list of { id, title, price, quantity, category? }. */
export const gaItems = (items) => ({
  currency: GA_CURRENCY,
  value: Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100,
  items: items.map((i) => ({
    item_id: String(i.id),
    item_name: i.title,
    ...(i.category ? { item_category: i.category } : {}),
    price: i.price,
    quantity: i.quantity,
  })),
});
