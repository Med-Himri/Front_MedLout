"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ShoppingCart, Trash2, ArrowRight, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "@/redux/slices/cartSlice";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Produits", href: "/produit" },
    { name: "À Propos", href: "/about-nous" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#1A1A1A] shadow-lg py-2 border-b-2 border-[#C41E3A]"
            : "bg-[#1A1A1A]/95 py-4"
        }`}
      >
        <nav className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="Medlout Auto - Accueil">
              <Image
                src="/medlout-full-transparent.png"
                alt="Medlout Auto"
                width={48}
                height={48}
                className="h-11 w-11 object-contain"
                priority
              />
              <span
                className="hidden sm:block font-bold uppercase tracking-wide text-[#F4F4F5] text-lg leading-tight"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                Medlout <span className="text-[#C41E3A]">Auto</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-[13px] font-semibold uppercase tracking-wide text-[#E5E5E5] hover:text-[#C41E3A] transition-colors duration-200 pb-1 group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C41E3A] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">

              <div className="relative">
                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="group relative p-2.5 rounded-lg text-[#E5E5E5] bg-[#2A2A2A] hover:bg-[#C41E3A] hover:text-white transition-all"
                  aria-label={`Ouvrir le panier, ${totalItems} articles`}
                  aria-expanded={isCartOpen}
                >
                  <ShoppingCart size={19} strokeWidth={2} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#C41E3A] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#1A1A1A]">
                      {totalItems}
                    </span>
                  )}
                </button>

                {isCartOpen && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsCartOpen(false)} aria-hidden="true" />
                    <div className="absolute right-0 mt-3 w-85 bg-[#1E1E1E] rounded-xl shadow-2xl border border-[#2A2A2A] z-50 overflow-hidden">
                      <div className="p-4 border-b border-[#2A2A2A] flex justify-between items-center bg-[#1A1A1A]">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#F4F4F5]">
                          Votre Panier
                        </span>
                        <span className="text-xs text-[#C41E3A] font-bold">
                          {totalItems} pièce{totalItems > 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="max-h-[320px] overflow-y-auto p-3 space-y-2">
                        {cartItems.length === 0 ? (
                          <div className="py-10 text-center">
                            <p className="text-xs text-[#A0A0A0] font-medium">
                              Votre panier est vide.
                            </p>
                          </div>
                        ) : (
                          cartItems.map((item) => (
                            <div key={item.id} className="flex gap-3 p-2.5 hover:bg-[#262626] rounded-lg transition-all group">
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#2A2A2A] bg-[#F4F4F5] flex-shrink-0">
                                <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[#F4F4F5] truncate">{item.title}</p>
                                <p className="text-[11px] text-[#A0A0A0] mt-1">
                                  Qté : {item.quantity} × <span className="text-[#C41E3A] font-bold">{item.price} DH</span>
                                </p>
                              </div>
                              <button
                                onClick={() => dispatch(removeFromCart(item.id))}
                                aria-label={`Retirer ${item.title}`}
                                className="self-center p-1.5 text-[#A0A0A0] hover:text-[#C41E3A] transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {cartItems.length > 0 && (
                        <div className="p-3 bg-[#1A1A1A] border-t border-[#2A2A2A]">
                          <Link
                            href="/panier"
                            onClick={() => setIsCartOpen(false)}
                            className="flex items-center justify-center gap-2 w-full bg-[#C41E3A] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-[#8F1529] transition-all"
                          >
                            Voir le Panier <ArrowRight size={14} />
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <button
                className="md:hidden p-2 text-[#E5E5E5]"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Ouvrir le menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#1A1A1A] z-[100] flex flex-col md:hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2A2A]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#C41E3A]">
              Medlout Auto
            </p>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-[#E5E5E5]" aria-label="Fermer le menu">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 px-8 py-10 flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-bold uppercase text-[#E5E5E5] flex justify-between items-center border-b border-[#2A2A2A] pb-4 hover:text-[#C41E3A] transition-colors"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                {link.name}
                <ArrowRight size={20} className="text-[#C41E3A] opacity-60" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}