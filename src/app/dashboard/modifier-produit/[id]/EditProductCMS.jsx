"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuill } from "react-quilljs";
import { toast } from "react-toastify";
import "quill/dist/quill.snow.css";
import {
  UploadCloud, Package, DollarSign, Tag, FileText, Loader2, Layers, ArrowLeft,
} from "lucide-react";
import { getProductByIdAPI, updateProductAPI } from "@/services/product.service";

export default function EditProductCMS({ productId }) {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [existingGallery, setExistingGallery] = useState([]);
  const [newGallery, setNewGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const mainRef = useRef(null);
  const galleryRef = useRef(null);

  const [form, setForm] = useState({
    title: "", slug: "", price: "", discountPrice: "",
    category: "", tags: "",
    shortDescription: "", metaTitle: "", metaDescription: "",
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

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const response = await getProductByIdAPI(productId);
        const data = response.data;

        setForm({
          title: data.title || "",
          slug: data.slug || "",
          price: data.price || "",
          discountPrice: data.discountPrice || "",
          category: data.category || "",
          tags: data.tags ? data.tags.join(", ") : "",
          shortDescription: data.shortDescription || "",
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
        });

        if (data.mainImage?.url) setMainPreview(data.mainImage.url);
        if (data.gallery?.length > 0) setExistingGallery(data.gallery);
        if (data.description) {
          setDescription(data.description);
          if (quill) quill.clipboard.dangerouslyPasteHTML(data.description);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        toast.error("Échec du chargement du produit");
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, quill]);

  useEffect(() => {
    if (!quill) return;
    quill.on("text-change", () => setDescription(quill.root.innerHTML));
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
    setNewGallery((p) => [...p, ...files]);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateProductAPI(productId, {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        description,
        mainImage,
        gallery: newGallery,
      });
      toast.success("Produit mis à jour avec succès.");
      router.push("/dashboard/catalogue");
    } catch (err) {
      console.error(err);
      toast.error("Échec de la mise à jour");
    } finally {
      setIsUpdating(false);
    }
  };

  const inputClass = "w-full border border-[#B4B4B4]/30 rounded-lg p-3 text-xs outline-none focus:border-[#C41E3A] text-[#1A1A1A]";
  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-[#626060] mb-2";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#C41E3A]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5] p-4 md:p-8 text-[#1A1A1A]">
      <header className="bg-white p-5 rounded-xl shadow-sm border border-[#B4B4B4]/20 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/catalogue")}
            className="p-2 rounded-lg bg-[#F4F4F5] hover:bg-[#1A1A1A] hover:text-white transition-colors border border-[#B4B4B4]/30"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#C41E3A]">
              Édition
            </span>
            <h1 className="text-xl font-bold uppercase flex items-center gap-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              <Package size={20} className="text-[#C41E3A]" /> Modifier le Produit
            </h1>
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="w-full sm:w-auto px-8 py-3 bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#C41E3A] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isUpdating && <Loader2 size={16} className="animate-spin" />}
          {isUpdating ? "Mise à jour..." : "Enregistrer les Modifications"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#B4B4B4]/20 space-y-6">
            <div>
              <label className={labelClass}>Titre du Produit</label>
              <input
                name="title" value={form.title} onChange={handleChange}
                className="text-xl font-bold w-full outline-none border-b border-[#B4B4B4]/30 focus:border-[#C41E3A] pb-2"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-[#F4F4F5] rounded-lg border border-[#B4B4B4]/20 text-xs">
              <span className="text-[#626060] font-mono text-[11px]">medloutauto.com/produit/</span>
              <input name="slug" value={form.slug} onChange={handleChange} className="font-mono text-[11px] bg-transparent flex-1 outline-none font-semibold" />
            </div>

            <div>
              <label className={labelClass}>Résumé Court</label>
              <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={3} className={inputClass} />
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
        </div>

        <div className="lg:col-span-4 space-y-6">
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

          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#B4B4B4]/20 space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-2 border-b border-[#B4B4B4]/20">
              <Tag size={16} className="text-[#C41E3A]" /> Détails du Produit
            </label>
            <input name="category" placeholder="Catégorie" value={form.category} onChange={handleChange} className={inputClass} />
            <input name="tags" placeholder="Tags séparés par virgule" value={form.tags} onChange={handleChange} className={inputClass} />
          </div>

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
                  <span className="text-[10px] uppercase font-bold">Changer la Photo</span>
                </div>
              )}
            </div>
            <input type="file" hidden ref={mainRef} accept="image/*" onChange={handleMainImage} />
          </div>

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
              {existingGallery.map((img, i) => (
                <div key={`old-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-[#B4B4B4]/30 bg-[#F4F4F5]">
                  <img src={img.url} className="w-full h-full object-contain p-1" alt={`Existant ${i}`} />
                </div>
              ))}
              {newGallery.map((img, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#C41E3A] bg-[#F4F4F5]">
                  <img src={URL.createObjectURL(img)} className="w-full h-full object-contain p-1" alt={`Nouveau ${i}`} />
                  <span className="absolute top-1 right-1 bg-[#C41E3A] text-white text-[8px] font-bold px-1 rounded">NOUVEAU</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-[#B4B4B4]/20 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider block pb-2 border-b border-[#B4B4B4]/20">Métadonnées SEO</span>
            <input name="metaTitle" placeholder="Titre SEO" value={form.metaTitle} onChange={handleChange} className={inputClass} />
            <textarea name="metaDescription" placeholder="Description SEO..." value={form.metaDescription} onChange={handleChange} rows={3} className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  );
}