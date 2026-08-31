"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { MessageCircle, Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { clearCart } from "@/redux/slices/cartSlice";

const WHATSAPP_NUMBER = "212682337693"; // Replace with your actual WhatsApp number

export function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    customerName: "", phone: "", city: "", address: "", notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const buildWhatsAppMessage = (order) => {
    const lines = [
      `Nouvelle commande depuis Medlout Auto`,
      ``,
      `Client : ${order.customerName}`,
      `Téléphone : ${order.phone}`,
      order.city ? `Ville : ${order.city}` : null,
      order.address ? `Adresse : ${order.address}` : null,
      ``,
      `Articles :`,
      ...order.items.map(
        (item) =>
          `- ${item.title}${item.partNumber ? ` (Réf. ${item.partNumber})` : ""} x${item.quantity} - ${item.price} DH`
      ),
      ``,
      `Total : ${order.total} DH`,
      order.notes ? `\nNotes : ${order.notes}` : null,
    ].filter(Boolean);

    return lines.join("\n");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customerName || !form.phone) {
      toast.error("Veuillez indiquer votre nom et numéro de téléphone");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    const orderPayload = {
      ...form,
      items: cartItems.map((item) => ({
        product: item.id,
        title: item.title,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        partNumber: item.partNumber || "",
      })),
      total,
    };

    const message = encodeURIComponent(buildWhatsAppMessage(orderPayload));
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, "_blank");

    setIsSubmitting(true);
    try {
      await axiosInstance.post("/api/order/create", orderPayload);
      toast.success("Commande enregistrée ! Envoyez le message WhatsApp pour la confirmer.");
      dispatch(clearCart());
      setForm({ customerName: "", phone: "", city: "", address: "", notes: "" });
    } catch (err) {
      console.error("Erreur lors de la soumission de la commande:", err);
      toast.error("Commande envoyée sur WhatsApp, mais l'enregistrement a échoué — envoyez quand même le message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="text-2xl font-bold text-[#F4F4F5] mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
        Commande
      </h1>
      <p className="text-sm text-[#A0A0A0] mb-8">
        Remplissez vos informations ci-dessous — nous confirmerons votre commande sur WhatsApp.
      </p>

      <div className="bg-[#1E1E1E] rounded-xl p-5 mb-8 space-y-3 border border-[#2A2A2A]">
        {cartItems.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-[#F4F4F5]/85">
              {item.title} × {item.quantity}
            </span>
            <span className="text-[#F4F4F5] font-medium">
              {(item.price * item.quantity).toFixed(2)} DH
            </span>
          </div>
        ))}
        <div className="flex justify-between pt-3 border-t border-[#2A2A2A] font-bold text-[#F4F4F5]">
          <span>Total</span>
          <span>{total.toFixed(2)} DH</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-[#A0A0A0] mb-1.5">
            Nom Complet *
          </label>
          <input
            name="customerName" value={form.customerName} onChange={handleChange}
            className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#F4F4F5] outline-none focus:border-[#C41E3A]"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-[#A0A0A0] mb-1.5">
            Numéro de Téléphone *
          </label>
          <input
            name="phone" value={form.phone} onChange={handleChange} placeholder="06XXXXXXXX"
            className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#F4F4F5] outline-none focus:border-[#C41E3A]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#A0A0A0] mb-1.5">Ville</label>
            <input
              name="city" value={form.city} onChange={handleChange}
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#F4F4F5] outline-none focus:border-[#C41E3A]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#A0A0A0] mb-1.5">Adresse</label>
            <input
              name="address" value={form.address} onChange={handleChange}
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#F4F4F5] outline-none focus:border-[#C41E3A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-[#A0A0A0] mb-1.5">
            Notes (optionnel)
          </label>
          <textarea
            name="notes" value={form.notes} onChange={handleChange} rows={2}
            className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-[#F4F4F5] outline-none focus:border-[#C41E3A]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-[#C41E3A] text-white py-4 rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-[#8F1529] transition-all disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
          {isSubmitting ? "Envoi en cours..." : "Confirmer via WhatsApp"}
        </button>
      </form>
    </div>
  );
}
