import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { Footer } from "@/components/home/Footer";

export const metadata = {
  title: "Medlout Auto | Pièces Auto Neuves et d'Occasion au Maroc",
  description:
    "Découvrez notre large sélection de pièces automobiles pour toutes marques et modèles. Freins, filtres, suspension, électrique et plus. Livraison partout au Maroc.",
  keywords:
    "pièces auto Maroc, pièces détachées voiture, freins, filtres, suspension, Medlout Auto",
  openGraph: {
    title: "Medlout Auto | Pièces Auto Neuves et d'Occasion",
    description: "Pièces automobiles de qualité pour toutes marques et modèles.",
    url: "https://www.medloutauto.com/",
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
