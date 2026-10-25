"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ImagePlus, Loader2, Sparkles, X } from "lucide-react";
import { createAIProductAPI } from "@/services/product.service";
import { apiError } from "@/utils/axiosInstance";
import { Card, PageTitle, button, input, label } from "@/components/admin/ui";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_MB = 8;

const checkImage = (file) => {
  if (!IMAGE_TYPES.includes(file.type)) return "Formats acceptés : JPEG, PNG, WEBP, AVIF.";
  if (file.size > MAX_MB * 1024 * 1024) return `Image trop lourde (${MAX_MB} Mo maximum).`;
  return null;
};

export default function AIProductPage() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(
    () => () => {
      galleryItems.forEach((g) => URL.revokeObjectURL(g.preview));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onMain = (e) => {
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
    const ok = files
      .filter((f) => {
        const problem = checkImage(f);
        if (problem) toast.error(`${f.name} : ${problem}`);
        return !problem;
      })
      .map((file) => ({ file, preview: URL.createObjectURL(file), alt: "" }));
    setGalleryItems((g) => [...g, ...ok].slice(0, 10));
  };

  const removeGallery = (index) =>
    setGalleryItems((g) => {
      URL.revokeObjectURL(g[index].preview);
      return g.filter((_, i) => i !== index);
    });

  const submit = async (e) => {
    e.preventDefault();
    if (!productName.trim()) return toast.error("Indiquez le nom du produit.");
    if (!(Number(price) > 0)) return toast.error("Indiquez un prix valide.");
    if (!mainImage) return toast.error("Ajoutez une image principale.");

    setBusy(true);
    try {
      const { data } = await createAIProductAPI({ productName, price, discountPrice, mainImage, galleryItems });
      toast.success("Produit généré ! Relisez-le puis publiez-le.");
      router.push(`/dashboard/produits/${data.product._id}`);
    } catch (err) {
      toast.error(apiError(err, "Échec de la génération IA"));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <Link href="/dashboard/produits" className="text-sm text-[#C41E3A] hover:underline">
        ← Produits
      </Link>
      <PageTitle
        action={
          <button type="submit" disabled={busy} className={button}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {busy ? "Génération… (jusqu'à 30 s)" : "Générer le produit"}
          </button>
        }
      >
        Nouveau produit avec l&apos;IA
      </PageTitle>
      <p className="text-sm text-[#626060]">
        Donnez le nom, le prix et une photo. L&apos;IA regarde la photo et écrit la description, la
        catégorie, les tags et le SEO en français. Le produit reste <strong>masqué</strong> jusqu&apos;à
        ce que vous le vérifiiez.
      </p>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card title="Produit">
          <div className="space-y-4">
            <label className={label}>
              Nom du produit
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="ex. Tapis de sol caoutchouc Dacia Logan"
                required
                maxLength={200}
                className={`${input} mt-1`}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={label}>
                Prix (DH)
                <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className={`${input} mt-1`} />
              </label>
              <label className={label}>
                Prix promo (DH)
                <input type="number" min="0" step="0.01" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} placeholder="optionnel" className={`${input} mt-1`} />
              </label>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Image principale (analysée par l'IA)">
            <label className="relative flex h-56 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-[#B4B4B4]/50 bg-[#F4F4F5] hover:border-[#C41E3A]">
              {mainPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mainPreview} alt="Aperçu" className="h-full w-full object-contain p-2" />
              ) : (
                <span className="flex flex-col items-center text-xs font-semibold uppercase text-[#626060]">
                  <ImagePlus className="mb-2 text-[#C41E3A]" /> Ajouter une photo
                </span>
              )}
              <input type="file" accept={IMAGE_TYPES.join(",")} onChange={onMain} className="hidden" />
            </label>
          </Card>

          <Card title="Galerie (optionnel)">
            <div className="grid grid-cols-3 gap-2">
              {galleryItems.map((g, i) => (
                <div key={g.preview} className="relative aspect-square overflow-hidden rounded-md border border-[#B4B4B4]/40 bg-[#F4F4F5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.preview} alt="" className="h-full w-full object-contain p-1" />
                  <button
                    type="button"
                    onClick={() => removeGallery(i)}
                    aria-label="Retirer la photo"
                    className="absolute right-1 top-1 rounded-full bg-white/90 p-0.5 text-red-600 shadow hover:bg-red-600 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-[#B4B4B4]/50 text-[#C41E3A] hover:border-[#C41E3A]">
                <ImagePlus size={20} />
                <input type="file" accept={IMAGE_TYPES.join(",")} multiple onChange={onGallery} className="hidden" />
              </label>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
