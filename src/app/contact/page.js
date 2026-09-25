"use client";

import { useState } from "react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { ArrowRight, Phone, Mail, CheckCircle, MapPin } from "lucide-react";

const WHATSAPP_NUMBER = "212682337693";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", cityAddress: "", message: "" });
  const [succeeded, setSucceeded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const buildMessage = () => {
    const lines = [
      `Nouvelle demande depuis Medlout Auto`,
      ``,
      `Nom : ${form.name}`,
      form.cityAddress ? `Ville/Adresse : ${form.cityAddress}` : null,
      ``,
      `Message :`,
      form.message,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;

    const message = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    setSucceeded(true);
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        <div className="rounded-xl overflow-hidden border border-[#2A2A2A] shadow-2xl">
          <div className="grid lg:grid-cols-5">
            {/* Left - Brand info */}
            <div className="lg:col-span-2 bg-[#1A1A1A] p-10 lg:p-14 text-white space-y-8 border-b-4 lg:border-b-0 lg:border-r-4 border-[#C41E3A]">
              <div>
                <span className="inline-block bg-[#C41E3A]/20 border border-[#C41E3A]/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#C41E3A]">
                  Service Client
                </span>
                <h2
                  className="text-3xl lg:text-4xl font-bold uppercase mt-4 leading-tight"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  Contactez <span className="text-[#C41E3A]">Medlout Auto</span>
                </h2>
                <p className="text-white/70 text-sm mt-4 leading-relaxed">
                  Une question sur un produit, sa disponibilité, ou une commande ? Écrivez-nous directement.
                </p>
              </div>

              <div className="space-y-5 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-[#C41E3A]/20 p-2.5 rounded-lg text-[#C41E3A]">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-white/50 text-[9px] uppercase font-bold">Téléphone</p>
                    <a href="tel:+212682337693" className="text-white text-sm font-medium hover:text-[#C41E3A]">
                      +212 682-337693
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#C41E3A]/20 p-2.5 rounded-lg text-[#C41E3A]">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-white/50 text-[9px] uppercase font-bold">Email</p>
                    <a href="mailto:contact@medloutauto.com" className="text-white text-sm font-medium hover:text-[#C41E3A]">
                      contact@medloutauto.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#C41E3A]/20 p-2.5 rounded-lg text-[#C41E3A]">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-white/50 text-[9px] uppercase font-bold">Livraison</p>
                    <span className="text-white text-sm font-medium">Partout au Maroc</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className="lg:col-span-3 bg-[#1E1E1E] p-10 lg:p-16 flex flex-col justify-center">
              {succeeded ? (
                <div className="text-center space-y-6 py-12">
                  <div className="flex justify-center">
                    <div className="bg-[#C41E3A]/10 p-5 rounded-full border border-[#C41E3A]/30">
                      <CheckCircle size={56} className="text-[#C41E3A]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#F4F4F5]">WhatsApp Ouvert</h3>
                    <p className="text-[#A0A0A0] text-sm mt-2 max-w-xs mx-auto">
                      Votre message est prêt dans WhatsApp — appuyez sur envoyer pour nous joindre directement.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSucceeded(false);
                      setForm({ name: "", cityAddress: "", message: "" });
                    }}
                    className="px-6 py-3 rounded-lg border border-[#C41E3A] text-[#F4F4F5] hover:bg-[#C41E3A] transition-all text-xs font-bold uppercase"
                  >
                    Envoyer un Autre Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-[#F4F4F5] mb-2">Envoyez-nous un Message</h3>
                  <p className="text-[#A0A0A0] text-xs mb-8">
                    Remplissez le formulaire — nous ouvrirons WhatsApp pour envoyer votre message directement.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#A0A0A0]">
                          Nom Complet
                        </label>
                        <input
                          name="name" required value={form.name} onChange={handleChange}
                          className="w-full py-3 bg-transparent border-b-2 border-[#2A2A2A] focus:outline-none focus:border-[#C41E3A] text-sm text-[#F4F4F5]"
                          placeholder="Ahmed Bennani"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#A0A0A0]">
                          Ville / Adresse
                        </label>
                        <input
                          name="cityAddress" value={form.cityAddress} onChange={handleChange}
                          className="w-full py-3 bg-transparent border-b-2 border-[#2A2A2A] focus:outline-none focus:border-[#C41E3A] text-sm text-[#F4F4F5]"
                          placeholder="Casablanca"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#A0A0A0]">
                        Votre Message
                      </label>
                      <textarea
                        name="message" required rows={3} value={form.message} onChange={handleChange}
                        className="w-full py-3 bg-transparent border-b-2 border-[#2A2A2A] focus:outline-none focus:border-[#C41E3A] resize-none text-sm text-[#F4F4F5]"
                        placeholder="Dites-nous ce que vous cherchez..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-lg text-white font-bold text-xs uppercase tracking-widest bg-[#C41E3A] hover:bg-[#8F1529] transition-all flex items-center justify-center gap-2"
                    >
                      Envoyer via WhatsApp <ArrowRight size={14} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}