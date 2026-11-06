// Meta (Facebook + Instagram) Pixel helpers.
//
// The pixel is OFF until NEXT_PUBLIC_META_PIXEL_ID is set in Vercel
// (front-med-lout → Settings → Environment Variables), then redeployed.
// Every helper below does nothing while it is off.

export const META_PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID || "").trim();

// Currency sent with event values. Prices are in dirhams; if Meta's Events
// Manager ever reports MAD as unsupported, change NEXT_PUBLIC_META_PIXEL_CURRENCY.
export const PIXEL_CURRENCY = process.env.NEXT_PUBLIC_META_PIXEL_CURRENCY || "MAD";

// The admin is never tracked.
export const isTrackedPath = (pathname = "") => !pathname.startsWith("/dashboard");

/**
 * Installs Meta's standard base code once (same snippet as in Events Manager)
 * and calls init. Calls made before fbevents.js finishes loading are queued.
 */
export function loadPixel() {
  if (!META_PIXEL_ID || typeof window === "undefined" || window.__medloutPixelReady) return;
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq("init", META_PIXEL_ID);
  window.__medloutPixelReady = true;
}

/** Sends a standard event, e.g. track("AddToCart", {...}). Optional `eventID` deduplicates. */
export function track(event, params = {}, eventID) {
  if (!META_PIXEL_ID || typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (!isTrackedPath(window.location.pathname)) return;
  if (eventID) window.fbq("track", event, params, { eventID });
  else window.fbq("track", event, params);
}

/** Pixel parameters for a list of { id, price, quantity } items. */
export const itemsParams = (items) => ({
  content_ids: items.map((i) => String(i.id)),
  content_type: "product",
  contents: items.map((i) => ({ id: String(i.id), quantity: i.quantity, item_price: i.price })),
  num_items: items.reduce((n, i) => n + i.quantity, 0),
  value: Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100,
  currency: PIXEL_CURRENCY,
});
