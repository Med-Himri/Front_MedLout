"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { ImagePlus, X } from "lucide-react";
import { createProductAPI, deleteProductAPI, updateProductAPI } from "@/services/product.service";
import { apiError } from "@/utils/axiosInstance";
import { Card, PageTitle, button, buttonDanger, buttonOutline, input, label } from "./ui";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_MB = 8;

const slugify = (str = "") =>
  str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const checkImage = (file) => {
  if (!IMAGE_TYPES.includes(file.type)) return "Formats acceptés : JPEG, PNG, WEBP, AVIF.";
  if (file.size > MAX_MB * 1024 * 1024) return `Image trop lourde (${MAX_MB} Mo maximum).`;
  return null;
};

const emptyForm = {
  title: "",
  slug: "",
  price: "",
  discountPrice: "",
  stock: "in_stock",
  category: "",
  tags: "",
  shortDescription: "",
  metaTitle: "",
  metaDescription: "",
  accepted: true,
};

/**
 * Create (product = null) or edit a product.
 * `categories` feeds the category suggestions.
 */
export default function ProductForm({ product, categories = [] }) {
  const router = useRouter();
  const isNew = !product;

  const [form, setForm] = useState(() =>
    product
      ? {
          title: product.title || "",
          slug: product.slug || "",
          price: product.price ?? "",
          discountPrice: product.discountPrice ?? "",
          stock: product.stock || "in_stock",
          category: product.category || "",
          tags: (product.tags || []).join(", "),
          shortDescription: product.shortDescription || "",
          metaTitle: product.metaTitle || "",
          metaDescription: product.metaDescription || "",
          accepted: Boolean(product.accepted),
        }
      : emptyForm
  );
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [description, setDescription] = useState(product?.description || "");

  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(product?.mainImage?.url || null);
  const [existingGallery, setExistingGallery] = useState(product?.gallery || []);
  const [removeGallery, setRemoveGallery] = useState([]);
  const [newGallery, setNewGallery] = useState([]); // [{ file, preview }]
  const [saving, setSaving] = useState(false);

  /* ---------- rich text editor ---------- */
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
  const pasted = useRef(false);

  useEffect(() => {
    if (!quill) return;
    if (!pasted.current && product?.description) {
      quill.clipboard.dangerouslyPasteHTML(product.description);
      pasted.current = true;
    }
    const onChange = () => setDescription(quill.root.innerHTML);
    quill.on("text-change", onChange);
    return () => quill.off("text-change", onChange);
  }, [quill, product]);

  // Free object URLs when leaving the page
  useEffect(
    () => () => {
      newGallery.forEach((g) => URL.revokeObjectURL(g.preview));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /* ---------- handlers ---------- */
  const set = (name, value) =>
    setForm((f) => ({
      ...f,
      [name]: value,
      ...(name === "title" && !slugTouched ? { slug: slugify(value) } : {}),
    }));
  const onField = (e) => set(e.target.name, e.target.type === "checkbox" ? e.target.checked : e.target.value);

  const onMainImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const problem = checkImage(file);
    if (problem) return toast.error(problem);
    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const onGallery = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    const ok = [];
    for (const file of files) {
      const problem = checkImage(file);
      if (problem) toast.error(`${file.name} : ${problem}`);
      else ok.push({ file, preview: URL.createObjectURL(file) });
    }
    setNewGallery((g) => [...g, ...ok].slice(0, 10));
  };

  const dropExisting = (img) => {
    setExistingGallery((g) => g.filter((x) => x !== img));
    if (img.publicId) setRemoveGallery((ids) => [...ids, img.publicId]);
  };

  const dropNew = (index) =>
    setNewGallery((g) => {
      URL.revokeObjectURL(g[index].preview);
      return g.filter((_, i) => i !== index);
    });

  const descriptionIsEmpty = !description || description.replace(/<[^>]*>/g, "").trim() === "";

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Indiquez un titre.");
    if (!(Number(form.price) > 0)) return toast.error("Indiquez un prix valide.");
    if (form.discountPrice !== "" && Number(form.discountPrice) >= Number(form.price)) {
      return toast.error("Le prix promo doit être inférieur au prix normal.");
    }
    if (descriptionIsEmpty) return toast.error("Écrivez une description.");
    if (isNew && !mainImage) return toast.error("Ajoutez une image principale.");

    setSaving(true);
    const payload = {
      ...form,
      description,
      mainImage,
      gallery: newGallery.map((g) => g.file),
    };
    try {
      if (isNew) {
        const { data } = await createProductAPI(payload);
        toast.success("Produit créé.");
        router.replace(`/dashboard/produits/${data.product._id}`);
      } else {
        await updateProductAPI(product._id, { ...payload, removeGallery });
        toast.success("Produit enregistré.");
        router.push("/dashboard/produits");
      }
    } catch (err) {
      toast.error(apiError(err, "Échec de l'enregistrement"));
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Supprimer définitivement « ${product.title} » et ses images ?`)) return;
    try {
      await deleteProductAPI(product._id);
      toast.success("Produit supprimé.");
      router.push("/dashboard/produits");
    } catch (err) {
      toast.error(apiError(err, "Échec de la suppression"));
    }
  };

  const counter = (value, max) => (
    <span className={`text-xs ${value.length > max ? "text-red-700" : "text-[#626060]"}`}>
      {value.length}/{max}
    </span>
  );

  return (
    <form onSubmit={save} className="space-y-6">
      <Link href="/dashboard/produits" className="text-sm text-[#C41E3A] hover:underline">
        ← Produits
      </Link>
      <PageTitle
        action={
          <div className="flex flex-wrap gap-2">
            {!isNew && product.accepted && (
              <a href={`/produit/${product.slug}`} target="_blank" rel="noreferrer" className={buttonOutline}>
                Voir sur le site ↗
              </a>
            )}
            <button type="submit" disabled={saving} className={button}>
              {saving ? "Enregistrement…" : isNew ? "Créer le produit" : "Enregistrer"}
            </button>
          </div>
        }
      >
        {isNew ? "Nouveau produit" : "Modifier le produit"}
      </PageTitle>

      {product?.aiGenerated && !product.accepted && (
        <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Ce produit a été écrit par l&apos;IA et il est masqué du site. Relisez le titre, le prix, la
          catégorie et la description, puis cochez <strong>Visible sur le site</strong> et enregistrez.
        </p>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card title="Informations">
            <div className="space-y-4">
              <label className={label}>
                Titre
                <input name="title" value={form.title} onChange={onField} required maxLength={200} className={`${input} mt-1`} />
              </label>
              <label className={label}>
                Adresse de la page (slug)
                <div className="mt-1 flex items-center rounded-md border border-[#B4B4B4]/50 bg-[#F4F4F5] text-sm focus-within:border-[#C41E3A]">
                  <span className="ps-3 text-[#626060]">/produit/</span>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set("slug", e.target.value);
                    }}
                    className="w-full bg-transparent px-1 py-2 font-mono text-xs outline-none"
                  />
                </div>
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className={label}>
                  Prix (DH)
                  <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={onField} required className={`${input} mt-1`} />
                </label>
                <label className={label}>
                  Prix promo (DH)
                  <input name="discountPrice" type="number" min="0" step="0.01" value={form.discountPrice} onChange={onField} placeholder="optionnel" className={`${input} mt-1`} />
                </label>
                <label className={label}>
                  Stock
                  <select name="stock" value={form.stock} onChange={onField} className={`${input} mt-1`}>
                    <option value="in_stock">En stock</option>
                    <option value="out_of_stock">Rupture de stock</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={label}>
                  Catégorie
                  <input name="category" value={form.category} onChange={onField} list="categories" className={`${input} mt-1`} />
                  <datalist id="categories">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </label>
                <label className={label}>
                  Tags (séparés par des virgules)
                  <input name="tags" value={form.tags} onChange={onField} className={`${input} mt-1`} />
                </label>
              </div>
              <label className={label}>
                <span className="flex justify-between">
                  Description courte (sous le prix) {counter(form.shortDescription, 160)}
                </span>
                <textarea name="shortDescription" value={form.shortDescription} onChange={onField} rows={2} className={`${input} mt-1`} />
              </label>
            </div>
          </Card>

          <Card title="Description">
            <div className="rounded-md border border-[#B4B4B4]/50 [&_.ql-container]:min-h-[260px] [&_.ql-container]:border-0 [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-[#B4B4B4]/40">
              <div ref={quillRef} />
            </div>
          </Card>

          <Card title="Référencement Google (SEO)">
            <div className="space-y-4">
              <label className={label}>
                <span className="flex justify-between">Titre SEO {counter(form.metaTitle, 60)}</span>
                <input name="metaTitle" value={form.metaTitle} onChange={onField} placeholder={form.title} className={`${input} mt-1`} />
              </label>
              <label className={label}>
                <span className="flex justify-between">Description SEO {counter(form.metaDescription, 160)}</span>
                <textarea name="metaDescription" value={form.metaDescription} onChange={onField} rows={2} placeholder={form.shortDescription} className={`${input} mt-1`} />
              </label>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Publication">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="accepted" checked={form.accepted} onChange={onField} className="h-4 w-4 accent-[#C41E3A]" />
              Visible sur le site
            </label>
            <p className="mt-2 text-xs text-[#626060]">Décochez pour masquer le produit sans le supprimer.</p>
          </Card>

          <Card title="Image principale">
            <label className="relative flex h-56 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-[#B4B4B4]/50 bg-[#F4F4F5] hover:border-[#C41E3A]">
              {mainPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mainPreview} alt="Aperçu" className="h-full w-full object-contain p-2" />
              ) : (
                <span className="flex flex-col items-center text-xs font-semibold uppercase text-[#626060]">
                  <ImagePlus className="mb-2 text-[#C41E3A]" /> Ajouter une photo
                </span>
              )}
              <input type="file" accept={IMAGE_TYPES.join(",")} onChange={onMainImage} className="hidden" />
            </label>
            {mainPreview && <p className="mt-2 text-xs text-[#626060]">Cliquez sur l&apos;image pour la remplacer.</p>}
          </Card>

          <Card title="Galerie">
            <div className="grid grid-cols-3 gap-2">
              {existingGallery.map((img) => (
                <Thumb key={img.publicId || img.url} src={img.url} onRemove={() => dropExisting(img)} />
              ))}
              {newGallery.map((g, i) => (
                <Thumb key={g.preview} src={g.preview} isNew onRemove={() => dropNew(i)} />
              ))}
              <label className="flex aspect-square cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-[#B4B4B4]/50 text-[#C41E3A] hover:border-[#C41E3A]">
                <ImagePlus size={20} />
                <input type="file" accept={IMAGE_TYPES.join(",")} multiple onChange={onGallery} className="hidden" />
              </label>
            </div>
            {removeGallery.length > 0 && (
              <p className="mt-2 text-xs text-amber-800">
                {removeGallery.length} photo(s) seront supprimées à l&apos;enregistrement.
              </p>
            )}
          </Card>

          {!isNew && (
            <button type="button" onClick={remove} className={`${buttonDanger} w-full`}>
              Supprimer le produit
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function Thumb({ src, onRemove, isNew }) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-md border border-[#B4B4B4]/40 bg-[#F4F4F5]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-contain p-1" />
      {isNew && <span className="absolute bottom-1 left-1 rounded bg-[#C41E3A] px-1 text-[9px] font-bold text-white">NOUVEAU</span>}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Retirer la photo"
        className="absolute right-1 top-1 rounded-full bg-white/90 p-0.5 text-red-600 shadow hover:bg-red-600 hover:text-white"
      >
        <X size={14} />
      </button>
    </div>
  );
}
