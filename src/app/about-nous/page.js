import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { ShieldCheck, Truck, Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "À Propos | Medlout Auto",
  description: "Découvrez Medlout Auto, votre fournisseur de pièces automobiles de confiance au Maroc.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#121212] min-h-screen">
      <Header />

      <section className="pt-32 pb-20 px-6 text-center bg-[#1A1A1A] border-b-4 border-[#C41E3A]">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1
            className="text-3xl md:text-5xl font-bold uppercase text-[#F4F4F5] leading-tight"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Des Pièces Fiables, <br />
            <span className="text-[#C41E3A]">Un Service de Confiance</span>
          </h1>
          <p className="text-[#F4F4F5]/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Medlout Auto fournit des pièces automobiles neuves et reconditionnées pour toutes marques et modèles, avec un souci constant de qualité et de fiabilité.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { icon: ShieldCheck, title: "Qualité Vérifiée", text: "Chaque pièce est contrôlée avant sa mise en catalogue." },
            { icon: Truck, title: "Livraison Rapide", text: "Expédition partout au Maroc, emballage sécurisé." },
            { icon: Wrench, title: "Support Expert", text: "Notre équipe vous aide à trouver la bonne pièce pour votre véhicule." },
          ].map((item, i) => (
            <div key={i} className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-6 text-left space-y-3 hover:border-[#C41E3A]/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#C41E3A]/10 text-[#C41E3A] flex items-center justify-center">
                <item.icon size={20} />
              </div>
              <h3 className="text-base font-bold text-[#F4F4F5]">{item.title}</h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="max-w-xl mx-auto space-y-8 px-6">
          <h2
            className="text-2xl md:text-3xl font-bold uppercase text-[#F4F4F5]"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Prêt à Trouver Votre Pièce ?
          </h2>
          <Link
            href="/produit"
            className="inline-flex items-center gap-2.5 bg-[#C41E3A] text-white px-8 py-4 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-[#8F1529] transition-all"
          >
            Voir le Catalogue <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
