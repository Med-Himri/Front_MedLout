"use client";

import { useState, useRef, useMemo } from "react";
import { useQuill } from "react-quilljs";
import { toast } from "react-toastify";
import "quill/dist/quill.snow.css";
import {
  UploadCloud,
  Package,
  DollarSign,
  Tag,
  FileText,
  Car,
  X,
  Loader2,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { createProductAPI } from "@/services/product.service";
import { useRouter } from "next/navigation";

const slugify = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function AddProductCMS() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [compatibility, setCompatibility] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mainRef = useRef(null);
  const galleryRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    price: "",
    discountPrice: "",
    partNumber: "",
    sku: "",
    condition: "new",
    category: "",
    tags: "",
    brand: "",
    shortDescription: "",
    metaTitle: "",
    metaDescription: "",
  });

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const { quill, quillRef } = useQuill({ theme: "snow", modules });

  useState(() => {
    if (quill) {
      quill.on("text-change", () => setDescription(quill.root.innerHTML));
    }
  }, [quill]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleMainImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const handleGallery = (e) => {
    const files = Array.from(e.target.files || []);
    setGallery((p) => [...p, ...files]);
  };

  /* ================= Compatibilité véhicule ================= */
  const addCompatibility = () => {
    setCompatibility((prev) => [...prev, { make: "", model: "", yearFrom: "", yearTo: "" }]);
  };

  const updateCompatibility = (index, field, value) => {
    setCompatibility((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeCompatibility = (index) => {
    setCompatibility((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.title) {
      toast.error("Veuillez indiquer un titre pour la pièce");
      return;
    }
    if (!form.price) {
      toast.error("Veuillez indiquer un prix");
      return;
    }
    if (!mainImage) {
      toast.error("Veuillez ajouter une image principale");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProductAPI({
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        description,
        mainImage,
        gallery,
        compatibility: compatibility
          .filter((c) => c.make && c.model)
          .map((c) => ({
            make: c.make,
            model: c.model,
            yearFrom: Number(c.yearFrom) || new Date().getFullYear(),
            yearTo: Number(c.yearTo) || new Date().getFullYear(),
          })),
      });

      toast.success("Pièce publiée avec succès.");

      setForm({
        title: "", slug: "", price: "", discountPrice: "", partNumber: "",
        sku: "", condition: "new", category: "", tags: "", brand: "",
        shortDescription: "", metaTitle: "", metaDescription: "",
      });
      setMainImage(null);
      setMainPreview(null);
      setGallery([]);
      setCompatibility([]);
      setDescription("");
      if (quill) quill.setText("");
    } catch (err) {
      console.error(err);
      toast.error("Échec de la publication de la pièce");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-[#B4B4B4]/30 rounded-lg p-3 text-xs outline-none focus:border-[#C41E3A] text-[#1A1A1A]";
  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-[#626060] mb-2";

  return (
    <div className="min-h-screen bg-[#F4F4F5] p-4 md:p-8 text-[#1A1A1A]">
      <header className="bg-white p-5 rounded-xl shadow-sm border border-[#B4B4B4]/20 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-lg bg-[#F4F4F5] hover:bg-[#1A1A1A] hover:text-white transition-colors border border-[#B4B4B4]/30"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#C41E3A]">
              Création de Pièce
            </span>
            <h1 className="text-xl font-bold uppercase flex items-center gap-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              <Package size={20} className="text-[#C41E3A]" /> Ajouter une Pièce
            </h1>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#C41E3A] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
          {isSubmitting ? "Publication..." : "Publier la Pièce"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#B4B4B4]/20 space-y-6">
            <div>
              <label className={labelClass}>Titre de la Pièce</label>
              <input
                name="title"
                placeholder="ex. Plaquettes de Frein Avant Bosch"
                value={form.title}
                onChange={handleChange}
                className="text-xl font-bold w-full outline-none border-b border-[#B4B4B4]/30 focus:border-[#C41E3A] pb-2"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-[#F4F4F5] rounded-lg border border-[#B4B4B4]/20 text-xs">
              <span className="text-[#626060] font-mono text-[11px]">medloutauto.com/produit/</span>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="font-mono text-[11px] bg-transparent flex-1 outline-none font-semibold"
              />
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, slug: slugify(p.title) }))}
                className="text-[10px] uppercase tracking-wider font-bold border border-[#B4B4B4]/40 px-3 py-1 rounded-lg bg-white hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                Générer
              </button>
            </div>

            <div>
              <label className={labelClass}>Résumé Court</label>
              <textarea
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                rows={3}
                className={inputClass}
                placeholder="Résumé affiché sous le prix..."
              />
            </div>

            <div>
              <label className={`${labelClass} flex items-center gap-1.5`}>
                <FileText size={14} className="text-[#C41E3A]" /> Description Complète
              </label>
              <div className="rounded-lg overflow-hidden border border-[#B4B4B4]/30">
                <div ref={quillRef} style={{ height: 300 }} />
              </div>
            </div>
          </div>

          {/* Compatibilité Véhicule */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#B4B4B4]/20 space-y-4">
            <div className="flex justify-between items-center border-b border-[#B4B4B4]/20 pb-3">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <Car size={16} className="text-[#C41E3A]" /> Compatibilité Véhicule
              </span>
              <button
                type="button"
                onClick={addCompatibility}
                className="text-[10px] font-bold uppercase tracking-wider text-[#C41E3A] hover:underline"
              >
                + Ajouter un Véhicule
              </button>
            </div>

            <p className="text-[11px] text-[#626060]">
              Laissez vide si la pièce est universelle (compatible avec tous les véhicules).
            </p>

            {compatibility.length > 0 && (
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_1fr_80px_80px_32px] gap-2 px-1">
                  <span className="text-[9px] font-bold uppercase text-[#626060]">Marque</span>
                  <span className="text-[9px] font-bold uppercase text-[#626060]">Modèle</span>
                  <span className="text-[9px] font-bold uppercase text-[#626060]">De</span>
                  <span className="text-[9px] font-bold uppercase text-[#626060]">À</span>
                  <span />
                </div>
                {compatibility.map((c, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_80px_80px_32px] gap-2 items-center">
                    <input
                      placeholder="Toyota"
                      value={c.make}
                      onChange={(e) => updateCompatibility(i, "make", e.target.value)}
                      className={inputClass}
                    />
                    <input
                      placeholder="Corolla"
                      value={c.model}
                      onChange={(e) => updateCompatibility(i, "model", e.target.value)}
                      className={inputClass}
                    />
                    <input
                      type="number"
                      placeholder="2015"
                      value={c.yearFrom}
                      onChange={(e) => updateCompatibility(i, "yearFrom", e.target.value)}
                      className={inputClass}
                    />
                    <input
                      type="number"
                      placeholder="2020"
                      value={c.yearTo}
                      onChange={(e) => updateCompatibility(i, "yearTo", e.target.value)}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeCompatibility(i)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Prix */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#B4B4B4]/20 space-y-4">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-2 border-b border-[#B4B4B4]/20">
              <DollarSign size={16} className="text-[#C41E3A]" /> Prix
            </label>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#626060]">Prix Standard (DH)</span>
              <input name="price" value={form.price} onChange={handleChange} className={`${inputClass} mt-1`} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#626060]">Prix Promo (DH)</span>
              <input name="discountPrice" value={form.discountPrice} onChange={handleChange} className={`${inputClass} mt-1 text-[#C41E3A] font-bold`} />
            </div>
          </div>

          {/* Détails Pièce */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#B4B4B4]/20 space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-2 border-b border-[#B4B4B4]/20">
              <Tag size={16} className="text-[#C41E3A]" /> Détails de la Pièce
            </label>
            <input name="partNumber" placeholder="Référence Constructeur" value={form.partNumber} onChange={handleChange} className={inputClass} />
            <input name="sku" placeholder="SKU Interne" value={form.sku} onChange={handleChange} className={inputClass} />
            <select name="condition" value={form.condition} onChange={handleChange} className={inputClass}>
              <option value="new">Neuf</option>
              <option value="used">Occasion</option>
              <option value="refurbished">Reconditionné</option>
            </select>
            <input name="brand" placeholder="Marque (ex. Bosch)" value={form.brand} onChange={handleChange} className={inputClass} />
            <input name="category" placeholder="Catégorie (ex. Freins)" value={form.category} onChange={handleChange} className={inputClass} />
            <input name="tags" placeholder="Tags séparés par virgule" value={form.tags} onChange={handleChange} className={inputClass} />
          </div>

          {/* Image Principale */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#B4B4B4]/20 space-y-3">
            <span className="block text-xs font-bold uppercase tracking-wider">Image Principale</span>
            <div
              onClick={() => mainRef.current?.click()}
              className="relative border-2 border-dashed border-[#B4B4B4]/40 hover:border-[#C41E3A] rounded-xl aspect-video flex items-center justify-center cursor-pointer overflow-hidden bg-[#F4F4F5]"
            >
              {mainPreview ? (
                <img src={mainPreview} alt="Aperçu" className="object-contain w-full h-full p-3" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#626060]">
                  <UploadCloud size={26} className="text-[#C41E3A]" />
                  <span className="text-[10px] uppercase font-bold">Ajouter une Photo</span>
                </div>
              )}
            </div>
            <input type="file" hidden ref={mainRef} accept="image/*" onChange={handleMainImage} />
          </div>

          {/* Galerie */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#B4B4B4]/20 space-y-3">
            <div className="flex justify-between items-center border-b border-[#B4B4B4]/20 pb-2">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <Layers size={16} className="text-[#C41E3A]" /> Photos Galerie
              </span>
              <button type="button" onClick={() => galleryRef.current?.click()} className="text-[10px] font-bold uppercase text-[#C41E3A] hover:underline">
                + Ajouter
              </button>
            </div>
            <input type="file" multiple hidden ref={galleryRef} accept="image/*" onChange={handleGallery} />
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-[#B4B4B4]/30 bg-[#F4F4F5]">
                  <img src={URL.createObjectURL(img)} className="w-full h-full object-contain p-1" alt={`Galerie ${i}`} />
                </div>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#B4B4B4]/20 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider block pb-2 border-b border-[#B4B4B4]/20">
              Métadonnées SEO
            </span>
            <input name="metaTitle" placeholder="Titre SEO" value={form.metaTitle} onChange={handleChange} className={inputClass} />
            <textarea name="metaDescription" placeholder="Description SEO..." value={form.metaDescription} onChange={handleChange} rows={3} className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  );
}
