import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { Footer } from "@/components/home/Footer";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Medlout Auto | Accessoires de Qualité au Maroc",
  description:
    "Découvrez notre large sélection d'accessoires de qualité. Livraison partout au Maroc.",
  keywords:
    "accessoires Maroc, Medlout Auto",
  openGraph: {
    title: "Medlout Auto | Accessoires de Qualité",
    description: "Accessoires de qualité, livraison partout au Maroc.",
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