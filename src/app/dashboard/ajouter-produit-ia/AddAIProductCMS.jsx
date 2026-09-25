"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  X, ImagePlus, Sparkles, Loader2, Bot, Package, DollarSign, Tag, ArrowLeft,
} from "lucide-react";
import { createAIProductAPI } from "@/services/product.service";
import { useRouter } from "next/navigation";

export default function AddAIProductCMS() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Seuls les formats JPEG, PNG ou WEBP sont acceptés !");
      return;
    }
    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type));
    const newItems = validFiles.map((file) => ({ file, preview: URL.createObjectURL(file), alt: "" }));
    setGalleryItems((prev) => [...prev, ...newItems]);
  };

  const removeGalleryImage = (index) => {
    setGalleryItems((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName) return toast.error("Veuillez indiquer un nom de pièce.");
    if (!price) return toast.error("Veuillez indiquer un prix.");
    if (!mainImage) return toast.error("Ajoutez une image principale.");

    setIsSubmitting(true);
    try {
      await createAIProductAPI({
        productName,
        price,
        discountPrice,
        mainImage,
        galleryItems,
      });

      toast.success("Produit généré par IA et publié avec succès. 🎉");

      setProductName(""); setPrice(""); setDiscountPrice("");
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      setMainImage(null); setMainImagePreview(null);
      galleryItems.forEach((item) => URL.revokeObjectURL(item.preview));
      setGalleryItems([]);
    } catch (err) {
      console.error(err);
      toast.error("Échec de la génération IA !");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cuteInput =
    "w-full bg-[#F4F4F5]/60 hover:bg-[#F4F4F5] border border-[#B4B4B4]/30 rounded-xl px-4 py-3 text-[14px] text-[#1A1A1A] font-medium focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#C41E3A]/10 focus:border-[#C41E3A] transition-all";
  const smallInput =
    "w-full border border-[#B4B4B4]/30 rounded-lg px-2.5 py-2 text-xs outline-none focus:border-[#C41E3A] bg-white";
  const labelText = "text-[10px] font-bold text-[#626060] uppercase tracking-widest mb-2 flex items-center gap-1.5";
  const sidebarCard = "bg-white p-6 rounded-2xl border border-[#B4B4B4]/20 shadow-sm";

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-[#1A1A1A] py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="max-w-[1000px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-lg bg-white hover:bg-[#1A1A1A] hover:text-white transition-colors border border-[#B4B4B4]/30 shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#C41E3A]">
              Création Automatisée
            </span>
            <h1 className="text-[2rem] font-bold uppercase tracking-tight flex items-center gap-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              IA Accessoire <Bot className="w-8 h-8 text-[#C41E3A]" />
            </h1>
            <p className="text-xs font-medium text-[#626060]">
              Indiquez le nom, le prix et les photos. L'IA génère la description, le SEO et les tags.
            </p>
          </div>
        </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`hidden lg:flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white rounded-2xl shadow-md transition-all ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#1A1A1A] hover:bg-[#C41E3A]"
            }`}
          >
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Génération...</> : <><Sparkles className="w-4 h-4" /> Générer & Publier</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 lg:p-10 rounded-[2rem] border border-[#B4B4B4]/20 shadow-sm space-y-8">
              <div>
                <label className={labelText}><Package className="w-3.5 h-3.5 text-[#C41E3A]" /> Nom du Produit</label>
                <textarea
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="ex. Sac à Main Cuir Premium..."
                  className="w-full text-[2rem] lg:text-[2.2rem] font-bold text-[#1A1A1A] placeholder:text-gray-300 outline-none bg-transparent tracking-tight leading-tight resize-none h-32"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  required
                />
              </div>

              <hr className="border-[#B4B4B4]/20" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelText}><DollarSign className="w-3.5 h-3.5 text-[#C41E3A]" /> Prix (DH)</label>
                  <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="150.00" className={cuteInput} required />
                </div>
                <div>
                  <label className={labelText}><Tag className="w-3.5 h-3.5 text-[#C41E3A]" /> Prix Promo (DH)</label>
                  <input type="number" min="0" step="0.01" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} placeholder="120.00" className={cuteInput} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className={sidebarCard}>
              <h3 className={labelText}><ImagePlus className="w-3.5 h-3.5 text-[#C41E3A]" /> Image Principale</h3>
              <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-[#B4B4B4]/40 hover:border-[#C41E3A] bg-[#F4F4F5]/50 rounded-2xl transition-all cursor-pointer overflow-hidden relative group mt-4">
                {mainImagePreview ? (
                  <img src={mainImagePreview} alt="Aperçu" className="object-contain w-full h-full p-3" />
                ) : (
                  <div className="text-center">
                    <ImagePlus className="w-8 h-8 text-[#C41E3A] mx-auto mb-2" />
                    <span className="text-xs font-bold text-[#626060] uppercase tracking-wider">Ajouter une Photo</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
              </label>
            </div>

            <div className={sidebarCard}>
              <h3 className={labelText}><ImagePlus className="w-3.5 h-3.5 text-[#C41E3A]" /> Galerie</h3>
              <label className="flex items-center justify-center w-full py-3 border-2 border-dashed border-[#B4B4B4]/40 rounded-xl hover:border-[#C41E3A] bg-[#F4F4F5]/50 transition-all cursor-pointer mb-4 text-[#C41E3A] font-bold text-xs uppercase gap-2">
                <ImagePlus className="w-4 h-4" /> Ajouter des Photos
                <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
              </label>

              {galleryItems.length > 0 && (
                <div className="grid grid-cols-1 gap-3">
                  {galleryItems.map((item, idx) => (
                    <div key={item.preview} className="flex items-center gap-3 p-3 border border-[#B4B4B4]/20 rounded-xl bg-[#F4F4F5]/40">
                      <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-[#B4B4B4]/30 bg-white">
                        <img src={item.preview} alt={`Galerie ${idx + 1}`} className="object-contain w-full h-full p-1" />
                      </div>
                      <button type="button" onClick={() => removeGalleryImage(idx)} className="bg-white border border-[#B4B4B4]/20 p-2 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors shrink-0 ml-auto">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 lg:hidden">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white rounded-2xl shadow-md transition-all ${
              isSubmitting ? "bg-gray-400" : "bg-[#1A1A1A] hover:bg-[#C41E3A]"
            }`}
          >
            {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Génération...</> : <><Sparkles className="w-5 h-5" /> Générer & Publier</>}
          </button>
        </div>
      </form>
    </div>
  );
}