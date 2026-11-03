"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { CheckCircle, Loader2, Minus, Plus, Printer, ShoppingBag } from "lucide-react";
import axiosInstance, { apiError } from "@/utils/axiosInstance";
import { clearCart, removeFromCart } from "@/redux/slices/cartSlice";
import { getSingleProductAPI } from "@/services/product.service";

const money = (n) => `${Number(n).toFixed(2)} DH`;

const inputClass =
  "w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#F4F4F5] outline-none focus:border-[#C41E3A]";
const labelClass = "block text-xs font-bold uppercase tracking-wide text-[#A0A0A0] mb-1.5";

export function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const hydrated = useSelector((state) => state.cart.hydrated);
  const dispatch = useDispatch();

  // "Commander maintenant" on a product page opens /commande?produit=<slug>:
  // only that product is ordered and the cart is left untouched.
  const buyNowSlug = useSearchParams().get("produit");
  const [buyNow, setBuyNow] = useState({ status: buyNowSlug ? "loading" : "off", item: null });
  const [buyNowQty, setBuyNowQty] = useState(1);

  useEffect(() => {
    if (!buyNowSlug) {
      setBuyNow({ status: "off", item: null }); // e.g. back to the normal cart checkout
      return;
    }
    setBuyNow({ status: "loading", item: null });
    setBuyNowQty(1);
    getSingleProductAPI(buyNowSlug)
      .then(({ data: p }) => {
        if (p.stock !== "in_stock") return setBuyNow({ status: "unavailable", item: null });
        const promo = p.discountPrice > 0 && p.discountPrice < p.price;
        setBuyNow({
          status: "ready",
          item: { id: p._id, title: p.title, slug: p.slug, price: promo ? p.discountPrice : p.price, image: p.mainImage?.url, partNumber: "" },
        });
      })
      .catch(() => setBuyNow({ status: "unavailable", item: null }));
  }, [buyNowSlug]);

  const isBuyNow = buyNow.status !== "off";
  const items = isBuyNow ? (buyNow.item ? [{ ...buyNow.item, quantity: buyNowQty }] : []) : cartItems;

  const [form, setForm] = useState({ customerName: "", phone: "", city: "", address: "", notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placed, setPlaced] = useState(null); // the saved order, shown as a receipt

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customerName.trim() || !form.phone.trim()) {
      toast.error("Veuillez indiquer votre nom et numéro de téléphone");
      return;
    }
    if (items.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    setIsSubmitting(true);
    try {
      // Only ids and quantities are sent: the server computes prices and total,
      // saves the order (admin → Commandes) and emails the shop.
      const { data } = await axiosInstance.post("/api/order/create", {
        ...form,
        items: items.map((item) => ({ product: item.id, quantity: item.quantity })),
      });
      if (!isBuyNow) dispatch(clearCart()); // a quick order never empties the cart
      setPlaced(data.order);
      window.scrollTo({ top: 0 });
    } catch (err) {
      const unavailable = err.response?.data?.unavailable;
      if (unavailable && !isBuyNow) dispatch(removeFromCart(unavailable));
      toast.error(
        err.response
          ? apiError(err) // something to fix: sold-out item, phone number…
          : "Impossible d'envoyer la commande. Vérifiez votre connexion et réessayez."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placed) {
    return <Receipt order={placed} />;
  }

  if (buyNow.status === "loading") {
    return (
      <div className="flex justify-center pt-40 pb-32">
        <Loader2 className="animate-spin text-[#C41E3A]" size={32} />
      </div>
    );
  }

  if (buyNow.status === "unavailable") {
    return (
      <div className="max-w-xl mx-auto pt-36 pb-24 px-6 text-center space-y-6">
        <p className="text-[#A0A0A0]">Ce produit n&apos;est plus disponible pour le moment.</p>
        <Link
          href="/produit"
          className="inline-block bg-[#C41E3A] text-white px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#8F1529]"
        >
          Voir les produits
        </Link>
      </div>
    );
  }

  if (!isBuyNow && hydrated && cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto pt-36 pb-24 px-6 text-center space-y-6">
        <p className="text-[#A0A0A0]">Votre panier est vide.</p>
        <Link
          href="/produit"
          className="inline-block bg-[#C41E3A] text-white px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#8F1529]"
        >
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-32 pb-16 px-6">
      <h1 className="text-2xl font-bold text-[#F4F4F5] mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
        {isBuyNow ? "Commande Rapide" : "Commande"}
      </h1>
      <p className="text-sm text-[#A0A0A0] mb-8">
        Remplissez vos informations ci-dessous — nous vous appelons pour confirmer la commande.
        Paiement à la livraison.
      </p>

      <div className="bg-[#1E1E1E] rounded-xl p-5 mb-8 space-y-3 border border-[#2A2A2A]">
        {isBuyNow ? (
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div>
              <Link href={`/produit/${buyNow.item.slug}`} className="text-[#F4F4F5] font-medium hover:text-[#C41E3A]">
                {buyNow.item.title}
              </Link>
              <div className="text-xs text-[#A0A0A0]">{money(buyNow.item.price)} / pièce</div>
            </div>
            <div className="flex items-center gap-2 bg-[#262626] rounded-full p-1">
              <button
                type="button"
                onClick={() => setBuyNowQty((q) => Math.max(1, q - 1))}
                aria-label="Diminuer la quantité"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1E1E1E] text-[#F4F4F5] hover:text-[#C41E3A]"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-bold text-xs text-[#F4F4F5]" aria-live="polite">{buyNowQty}</span>
              <button
                type="button"
                onClick={() => setBuyNowQty((q) => Math.min(99, q + 1))}
                aria-label="Augmenter la quantité"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1E1E1E] text-[#F4F4F5] hover:text-[#C41E3A]"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 text-sm">
              <span className="text-[#F4F4F5]/85">
                {item.title} × {item.quantity}
              </span>
              <span className="text-[#F4F4F5] font-medium whitespace-nowrap">{money(item.price * item.quantity)}</span>
            </div>
          ))
        )}
        <div className="flex justify-between pt-3 border-t border-[#2A2A2A] font-bold text-[#F4F4F5]">
          <span>Total</span>
          <span>{money(total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customerName" className={labelClass}>Nom Complet *</label>
          <input id="customerName" name="customerName" value={form.customerName} onChange={handleChange} autoComplete="name" maxLength={100} className={inputClass} required />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>Numéro de Téléphone *</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="06XXXXXXXX" autoComplete="tel" maxLength={30} className={inputClass} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className={labelClass}>Ville</label>
            <input id="city" name="city" value={form.city} onChange={handleChange} autoComplete="address-level2" maxLength={100} className={inputClass} />
          </div>
          <div>
            <label htmlFor="address" className={labelClass}>Adresse</label>
            <input id="address" name="address" value={form.address} onChange={handleChange} autoComplete="street-address" maxLength={300} className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className={labelClass}>Notes (optionnel)</label>
          <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={2} maxLength={1000} className={inputClass} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-[#C41E3A] text-white py-4 rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-[#8F1529] transition-all disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
          {isSubmitting ? "Envoi en cours..." : "Confirmer la Commande"}
        </button>
      </form>
    </div>
  );
}

/** Shown right after the order is saved — no other page or app opens. */
function Receipt({ order }) {
  const line = (label, value) =>
    value ? (
      <div className="flex justify-between gap-4">
        <span className="text-[#A0A0A0]">{label}</span>
        <span className="text-right text-[#F4F4F5]">{value}</span>
      </div>
    ) : null;

  return (
    <div className="max-w-xl mx-auto pt-32 pb-24 px-6">
      <div className="text-center space-y-3 mb-8">
        <CheckCircle size={56} className="mx-auto text-green-500" />
        <h1 className="text-2xl font-bold text-[#F4F4F5]" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Merci {order.customerName.split(" ")[0]}, votre commande est envoyée !
        </h1>
        <p className="text-sm text-[#A0A0A0]">
          Nous vous appelons au <strong className="text-[#F4F4F5]" dir="ltr">{order.phone}</strong> pour
          confirmer la livraison. Paiement à la livraison.
        </p>
      </div>

      <section className="bg-[#1E1E1E] border border-[#2A2A2A] border-t-4 border-t-[#C41E3A] rounded-xl p-6 text-sm space-y-5">
        <div className="flex justify-between items-baseline gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0]">Reçu de commande</h2>
          <span className="text-lg font-bold text-[#F4F4F5]" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            {order.orderNumber}
          </span>
        </div>

        <div className="space-y-1.5">
          {line("Date", order.createdAt && new Date(order.createdAt).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" }))}
          {line("Nom", order.customerName)}
          {line("Téléphone", order.phone)}
          {line("Ville", order.city)}
          {line("Adresse", order.address)}
        </div>

        <div className="border-t border-[#2A2A2A] pt-4 space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between gap-4">
              <span className="text-[#F4F4F5]/85">
                {item.title} × {item.quantity}
              </span>
              <span className="text-[#F4F4F5] whitespace-nowrap">{money(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between text-[#A0A0A0]">
            <span>Livraison</span>
            <span>selon confirmation</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-[#2A2A2A] text-base font-bold text-[#F4F4F5]">
            <span>Total</span>
            <span className="text-[#C41E3A]">{money(order.total)}</span>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 border border-[#2A2A2A] text-[#F4F4F5] px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:border-[#C41E3A]"
        >
          <Printer size={16} /> Imprimer le reçu
        </button>
        <Link
          href="/produit"
          className="inline-flex items-center justify-center bg-[#C41E3A] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#8F1529]"
        >
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
