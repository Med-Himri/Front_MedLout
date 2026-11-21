"use client";

import { usePathname } from "next/navigation";
import { whatsappLink } from "@/lib/site";
import { track } from "@/lib/metaPixel";
import { gaEvent } from "@/lib/googleAnalytics";

// Floating WhatsApp button (bottom right) on every shop page, not on the admin.
// On a product page the message includes the product link, so the shop knows
// which product the customer is asking about.
export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;

  const onClick = (e) => {
    const onProduct = pathname.startsWith("/produit/");
    const text = onProduct
      ? `Bonjour Medlout Auto, j'ai une question sur ce produit :\n${window.location.href}`
      : "Bonjour Medlout Auto, j'ai une question.";
    e.currentTarget.href = whatsappLink(text);
    track("Contact"); // Meta Pixel
    gaEvent("contact_whatsapp", { page_path: pathname }); // Google Analytics
  };

  return (
    <a
      href={whatsappLink("Bonjour Medlout Auto, j'ai une question.")}
      onClick={onClick}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      title="Besoin d'aide ? Écrivez-nous sur WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 print:hidden"
    >
      {/* WhatsApp logo */}
      <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C9.38 3 3.99 8.39 3.99 15.014c0 2.12.554 4.19 1.607 6.013L3.9 27.5l6.62-1.66a12 12 0 0 0 5.48 1.33h.004c6.623 0 12.01-5.39 12.01-12.014C28.014 8.39 22.627 3 16.004 3Zm0 21.97h-.003a9.96 9.96 0 0 1-5.078-1.39l-.364-.216-3.93.985 1.05-3.83-.237-.393a9.94 9.94 0 0 1-1.52-5.112c0-5.5 4.477-9.977 9.985-9.977 2.667 0 5.174 1.04 7.06 2.927a9.92 9.92 0 0 1 2.92 7.06c0 5.502-4.478 9.946-9.883 9.946Zm5.475-7.47c-.3-.15-1.775-.876-2.05-.976-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.49-.892-.795-1.494-1.777-1.669-2.077-.175-.3-.019-.462.131-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.627-.925-2.227-.244-.585-.492-.506-.675-.515l-.575-.01a1.1 1.1 0 0 0-.8.375c-.275.3-1.05 1.026-1.05 2.502 0 1.477 1.075 2.903 1.225 3.103.15.2 2.116 3.231 5.126 4.531.716.31 1.275.494 1.711.633.719.228 1.373.196 1.89.119.577-.086 1.775-.726 2.025-1.426.25-.7.25-1.3.175-1.426-.075-.125-.275-.2-.575-.35Z" />
      </svg>
    </a>
  );
}
