"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Minus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { increaseQty, decreaseQty, removeFromCart } from "@/redux/slices/cartSlice";
import { Header } from "@/components/home/Header";

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#121212] pt-32 pb-24">
      <Header />

      <div className="max-w-7xl mx-auto px-6">
        <Link
          href="/produit"
          className="inline-flex items-center gap-2 text-[#A0A0A0] hover:text-[#C41E3A] mb-8 transition-colors text-sm font-semibold uppercase"
        >
          <ArrowLeft size={16} />
          Continuer mes Achats
        </Link>

        <div className="flex items-center justify-between mb-8 border-b border-[#2A2A2A] pb-4">
          <h1 className="text-3xl font-bold uppercase text-[#F4F4F5]" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Votre Panier
          </h1>
          <span className="text-xs uppercase tracking-widest text-[#C41E3A] font-bold">
            {cartItems.length} pièce{cartItems.length > 1 ? "s" : ""}
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-[#1E1E1E] rounded-xl p-16 text-center border border-[#2A2A2A] max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-[#262626] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C41E3A]">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-xl font-bold text-[#F4F4F5] mb-3">Votre panier est vide</h2>
            <p className="text-[#A0A0A0] text-sm mb-8">Découvrez notre catalogue de pièces auto.</p>
            <Link
              href="/produit"
              className="inline-block bg-[#C41E3A] text-white px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#8F1529] transition-all"
            >
              Voir les Pièces
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-[#1E1E1E] rounded-xl p-6 flex flex-col sm:flex-row gap-6 border border-[#2A2A2A]">
                  <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-[#F4F4F5] shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-contain p-3" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-base font-semibold text-[#F4F4F5]">{item.title}</h3>
                        <p className="text-base font-bold text-[#F4F4F5]">
                          {(item.price * item.quantity).toFixed(2)} DH
                        </p>
                      </div>
                      {item.partNumber && (
                        <p className="text-xs text-[#C41E3A] font-semibold mt-1">Réf. {item.partNumber}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#2A2A2A]">
                      <div className="flex items-center gap-2 bg-[#262626] rounded-full p-1">
                        <button
                          onClick={() => dispatch(decreaseQty(item.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1E1E1E] text-[#F4F4F5] hover:text-[#C41E3A] transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-xs text-[#F4F4F5]">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(increaseQty(item.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1E1E1E] text-[#F4F4F5] hover:text-[#C41E3A] transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-[#A0A0A0] hover:text-red-400 flex items-center gap-1.5 text-xs font-semibold uppercase transition-colors"
                      >
                        <Trash2 size={15} />
                        <span className="hidden sm:inline">Retirer</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4">
              <div className="bg-[#1E1E1E] text-[#F4F4F5] rounded-xl p-8 sticky top-32 border border-[#2A2A2A] border-t-4 border-t-[#C41E3A]">
                <h2 className="text-xl font-bold uppercase mb-6 border-b border-[#2A2A2A] pb-4">
                  Résumé de la Commande
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-[#A0A0A0]">
                    <span>Sous-total</span>
                    <span className="font-medium text-[#F4F4F5]">{subtotal.toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between text-[#A0A0A0]">
                    <span>Livraison</span>
                    <span className="text-[#C41E3A] font-bold text-xs uppercase">Selon Confirmation</span>
                  </div>
                  <div className="pt-6 mt-6 border-t border-[#2A2A2A] flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-[#C41E3A]">{subtotal.toFixed(2)} DH</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/commande")}
                  className="w-full mt-8 bg-[#C41E3A] text-white py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#8F1529] transition-all"
                >
                  Passer la Commande
                </button>

                <p className="text-center mt-6 text-[#A0A0A0] text-[11px]">
                  Commande via WhatsApp — Aucun Paiement en Ligne Requis
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
