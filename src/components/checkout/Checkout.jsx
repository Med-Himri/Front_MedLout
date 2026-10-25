"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { CheckCircle, MessageCircle, Loader2, Minus, Plus } from "lucide-react";
import axiosInstance, { apiError } from "@/utils/axiosInstance";
import { clearCart, removeFromCart } from "@/redux/slices/cartSlice";
import { openLater, whatsappLink } from "@/lib/site";
import { getSingleProductAPI } from "@/services/product.service";

const money = (n) => `${Number(n).toFixed(2)} DH`;

// The order number (e.g. ML-7K2QX9) is the link between this WhatsApp message
// and the same order in the admin (Commandes page).
const buildWhatsAppMessage = (order) =>
  [
    order.orderNumber
      ? `Nouvelle commande ${order.orderNumber} — Medlout Auto`
      : `Nouvelle commande — Medlout Auto`,
    ``,
    `Client : ${order.customerName}`,
    `Téléphone : ${order.phone}`,
    order.city ? `Ville : ${order.city}` : null,
    order.address ? `Adresse : ${order.address}` : null,
    ``,
    `Articles :`,
    ...order.items.map(
      (item) =>
        `- ${item.title}${item.partNumber ? ` (Réf. ${item.partNumber})` : ""} x${item.quantity} — ${money(item.price * item.quantity)}`
    ),
    ``,
    `Total : ${money(order.total)}`,
    order.notes ? `\nNotes : ${order.notes}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

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
  const [placed, setPlaced] = useState(null); // { order, whatsappUrl }

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

    // Open the WhatsApp tab now, while we're still inside the click
    const tab = openLater();
    setIsSubmitting(true);

    let order;
    try {
      // Only ids and quantities are sent: the server computes prices and total.
      const { data } = await axiosInstance.post("/api/order/create", {
        ...form,
        items: items.map((item) => ({ product: item.id, quantity: item.quantity })),
      });
      order = data.order;
    } catch (err) {
      const status = err.response?.status;
      if (status === 400 || status === 429) {
        // Something the customer must fix (sold-out item, bad phone…)
        tab.cancel();
        const unavailable = err.response?.data?.unavailable;
        if (unavailable && !isBuyNow) dispatch(removeFromCart(unavailable));
        toast.error(apiError(err));
        setIsSubmitting(false);
        return;
      }
      // Server unreachable: still send the order on WhatsApp so it isn't lost
      console.error("Erreur lors de l'enregistrement de la commande:", err);
      order = {
        ...form,
        items: items.map((i) => ({ title: i.title, partNumber: i.partNumber, price: i.price, quantity: i.quantity })),
        total,
      };
    }

    const whatsappUrl = whatsappLink(buildWhatsAppMessage(order));
    tab.go(whatsappUrl);

    if (!isBuyNow) dispatch(clearCart()); // a quick order never empties the cart
    setPlaced({ order, whatsappUrl });
    setIsSubmitting(false);
  };

  if (placed) {
    return (
      <div className="max-w-xl mx-auto pt-36 pb-24 px-6 text-center space-y-6">
        <CheckCircle size={56} className="mx-auto text-[#C41E3A]" />
        <h1 className="text-2xl font-bold text-[#F4F4F5]" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          {placed.order.orderNumber ? `Commande ${placed.order.orderNumber} enregistrée` : "Commande prête"}
        </h1>
        <p className="text-sm text-[#A0A0A0]">
          Dernière étape : <strong className="text-[#F4F4F5]">envoyez le message WhatsApp</strong> qui
          vient de s&apos;ouvrir. Nous vous rappelons pour confirmer la commande et la livraison.
        </p>
        <a
          href={placed.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide hover:opacity-90"
        >
          <MessageCircle size={18} /> Ouvrir WhatsApp
        </a>
        <p>
          <Link href="/produit" className="text-sm text-[#A0A0A0] underline hover:text-[#C41E3A]">
            Continuer mes achats
          </Link>
        </p>
      </div>
    );
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
        Remplissez vos informations ci-dessous — nous confirmerons votre commande sur WhatsApp.
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
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
          {isSubmitting ? "Envoi en cours..." : "Confirmer via WhatsApp"}
        </button>
      </form>
    </div>
  );
}
