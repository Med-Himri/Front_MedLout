import ContactPageContent from "@/components/contact/ContactPageContent";

export const metadata = {
  title: "Contact",
  description:
    "Une question sur un accessoire, sa disponibilité ou une commande ? Contactez Medlout Auto sur WhatsApp. Livraison partout au Maroc.",
  alternates: { canonical: "https://www.medloutauto.com/contact" },
};

export default function ContactPage() {
  return <ContactPageContent />;
}
