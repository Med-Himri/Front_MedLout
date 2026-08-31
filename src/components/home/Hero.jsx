"use client";

import { ArrowRight, ShieldCheck, Truck, Wrench } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#121212] pt-20">
      {/* BACKGROUND IMAGES — lighter overlay so the photo actually shows */}
      <div className="absolute inset-0 z-0">
        <div className="block lg:hidden h-full w-full relative">
          <Image
            src="/hero-phone.webp"
            alt="Accessoires Auto Medlout Auto"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-[#121212]/20" />
        </div>

        <div className="hidden lg:block h-full w-full relative">
          <Image
            src="/hero-desktop.webp"
            alt="Entrepôt d'Accessoires Medlout Auto"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Much lighter than before (was opacity-40 + heavy gradient) —
              just enough darkening on the left for text legibility, photo
              stays visible across the rest of the frame */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/70 to-[#121212]/10" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-20 max-w-7xl">
        <div className="max-w-[720px]">
          <div className="inline-flex items-center gap-2 bg-[#C41E3A]/15 border border-[#C41E3A]/40 px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-[#C41E3A] animate-pulse" />
            <span className="text-[#F4F4F5] text-[10px] font-bold uppercase tracking-widest">
              Accessoires Neufs & Reconditionnés
            </span>
          </div>

          <h1
            className="text-[#F4F4F5] leading-[1.05] tracking-tight uppercase mb-6"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            <span className="text-[2.5rem] md:text-[4.2rem] block font-bold">
              Des Accessoires Qui
            </span>
            <span className="text-[2.8rem] md:text-[4.6rem] font-bold text-[#C41E3A] block">
              Vous Font Avancer
            </span>
          </h1>

          <p className="text-[#F4F4F5]/80 text-base md:text-lg font-medium max-w-md leading-relaxed mb-10">
            Des accessoires automobiles de qualité pour toutes marques et modèles moteur, freins, filtres, électrique et plus encore.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link
              href="/produit"
              className="group relative px-9 py-4 bg-[#C41E3A] text-white rounded-lg overflow-hidden transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 hover:bg-[#8F1529]"
            >
              <span className="relative z-10 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Voir les Accessoires
              </span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-lg">
            {[
              { icon: ShieldCheck, label: "Qualité Vérifiée" },
              { icon: Truck, label: "Livraison Rapide" },
              { icon: Wrench, label: "Support Expert" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-start gap-2">
                <div className="p-2 rounded-lg bg-[#1E1E1E] border border-[#C41E3A]/30 text-[#C41E3A]">
                  <item.icon size={18} />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#F4F4F5]/90">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}