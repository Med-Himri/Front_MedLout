import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { Footer } from "@/components/home/Footer";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Medlout Auto | Accessoires de Qualité au Maroc",
  description:
    "Découvrez notre large sélection d'accessoires auto. Livraison gratuite partout au Maroc, paiement à la livraison.",
  keywords:
    "accessoires Maroc, Medlout Auto",
  openGraph: {
    title: "Medlout Auto | Accessoires de Qualité",
    description: "Accessoires auto, livraison gratuite partout au Maroc.",
    url: `${SITE_URL}/`,
    siteName: "Medlout Auto",
    type: "website",
    locale: "fr_FR",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  );
}