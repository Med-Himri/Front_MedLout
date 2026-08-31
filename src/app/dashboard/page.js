import Link from "next/link";
import { PackagePlus, Bot, ClipboardList, LayoutGrid } from "lucide-react";

export const metadata = {
  title: "Dashboard | Medlout Auto",
  robots: { index: false, follow: false },
};

const links = [
  {
    href: "/dashboard/ajouter-produit",
    icon: PackagePlus,
    title: "Ajouter une Pièce",
    description: "Formulaire manuel — renseignez tous les champs vous-même.",
  },
  {
    href: "/dashboard/ajouter-produit-ia",
    icon: Bot,
    title: "Ajouter via IA",
    description: "L'IA génère la description et le SEO à partir d'une photo.",
  },
  {
    href: "/dashboard/catalogue",
    icon: LayoutGrid,
    title: "Catalogue",
    description: "Voir toutes les pièces — approuver, modifier ou supprimer.",
  },
  {
    href: "#",
    icon: ClipboardList,
    title: "Commandes (Bientôt)",
    description: "Voir et gérer les commandes clients — pas encore construit.",
    disabled: true,
  },
];

export default function DashboardHome() {
  return (
    <div className="min-h-screen bg-[#F4F4F5] p-4 md:p-8 text-[#1A1A1A]">
      <header className="mb-8">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#C41E3A]">
          Medlout Auto
        </span>
        <h1
          className="text-2xl font-bold uppercase"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Dashboard
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
        {links.map((link) => {
          const card = (
            <div
              className={`bg-white p-6 rounded-xl border border-[#B4B4B4]/20 shadow-sm flex flex-col gap-3 transition-all ${
                link.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-[#C41E3A] hover:-translate-y-0.5"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-[#C41E3A]/10 text-[#C41E3A] flex items-center justify-center">
                <link.icon size={20} />
              </div>
              <h2 className="text-base font-bold">{link.title}</h2>
              <p className="text-xs text-[#626060] leading-relaxed">{link.description}</p>
            </div>
          );

          return link.disabled ? (
            <div key={link.title}>{card}</div>
          ) : (
            <Link key={link.title} href={link.href}>
              {card}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
