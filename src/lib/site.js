// Shop-wide constants.

// Public address of the shop, used for Google (canonical URLs, sitemap).
// When the .com domain is ready, set NEXT_PUBLIC_SITE_URL=https://www.medloutauto.com in Vercel.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://front-med-lout.vercel.app").replace(/\/$/, "");

// WhatsApp number that receives orders and contact messages (international
// format, digits only). Can be changed without a code edit via NEXT_PUBLIC_WHATSAPP_NUMBER.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212682337693";

export const whatsappLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/**
 * Opens a blank tab right away (inside the click handler, so popup blockers
 * allow it) and returns a function that sends it to the final URL later —
 * e.g. after an API call. Falls back to the current tab if the popup was blocked.
 */
export const openLater = () => {
  const popup = typeof window !== "undefined" ? window.open("", "_blank") : null;
  return {
    go(url) {
      if (popup && !popup.closed) {
        popup.opener = null;
        popup.location.href = url;
      } else {
        window.location.href = url;
      }
    },
    cancel() {
      if (popup && !popup.closed) popup.close();
    },
  };
};
