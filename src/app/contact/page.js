import ContactPageContent from "@/components/contact/ContactPageContent";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Contact",
  description:
    "Une question sur un accessoire, sa disponibilité ou une commande ? Contactez Medlout Auto sur WhatsApp. Livraison partout au Maroc.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return <ContactPageContent />;
}
