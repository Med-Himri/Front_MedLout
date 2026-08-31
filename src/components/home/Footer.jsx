import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#E5E5E5] pt-20 pb-8 border-t-4 border-[#C41E3A]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid sm:grid-cols-3 gap-12 pb-12 border-b border-white/10">
          {/* Navigation */}
          <div className="space-y-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#C41E3A]">
              Navigation
            </p>
            <ul className="space-y-3">
              {[
                { label: "Accueil", href: "/" },
                { label: "Boutique", href: "/produit" },
                { label: "À Propos", href: "/about-nous" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#E5E5E5]/70 hover:text-[#C41E3A] transition-colors duration-300 font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Catégories */}
          <div className="space-y-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#C41E3A]">
              Catégories
            </p>
            <ul className="space-y-3">
              {["Freins", "Filtres", "Suspension", "Électrique"].map((label) => (
                <li key={label}>
                  <Link
                    href="/produit"
                    className="text-xs text-[#E5E5E5]/70 hover:text-[#C41E3A] transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#C41E3A]">
              Contact
            </p>
            <div className="space-y-3 text-sm text-[#E5E5E5]/70">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#C41E3A]" />
                <span>+212 682-337693</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#C41E3A]" />
                <span>contact@medloutauto.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#C41E3A]" />
                <span>Maroc</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 text-center">
          <p className="text-[11px] text-[#E5E5E5]/40">
            © {new Date().getFullYear()} Medlout Auto. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
