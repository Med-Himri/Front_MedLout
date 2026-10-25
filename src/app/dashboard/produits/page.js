"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Package } from "lucide-react";
import { acceptProductAPI, getProductsAPI } from "@/services/product.service";
import { useAdminData } from "@/components/admin/useAdminData";
import { apiError } from "@/utils/axiosInstance";
import {
  Card,
  ErrorBox,
  Loading,
  PageTitle,
  TextLink,
  button,
  buttonOutline,
  input,
  mad,
} from "@/components/admin/ui";

const FILTERS = {
  "": "Tous les produits",
  visibles: "Visibles sur le site",
  masques: "Masqués",
  ia: "IA — à vérifier",
  rupture: "En rupture de stock",
};

function Products() {
  const params = useSearchParams();
  const { data, loading, error, reload, setData } = useAdminData(getProductsAPI);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [filter, setFilter] = useState(FILTERS[params.get("filtre")] ? params.get("filtre") : "");
  const [busyId, setBusyId] = useState(null);

  const products = data || [];
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products]
  );

  const shown = products.filter((p) => {
    if (cat && p.category !== cat) return false;
    if (q && !`${p.title} ${p.slug}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (filter === "visibles") return p.accepted;
    if (filter === "masques") return !p.accepted;
    if (filter === "ia") return p.aiGenerated && !p.accepted;
    if (filter === "rupture") return p.stock === "out_of_stock";
    return true;
  });

  const publish = async (id) => {
    setBusyId(id);
    try {
      await acceptProductAPI(id);
      setData(products.map((p) => (p._id === id ? { ...p, accepted: true, aiGenerated: false } : p)));
      toast.success("Produit publié — il est visible sur le site.");
    } catch (err) {
      toast.error(apiError(err, "Échec de la publication"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/produits/ia" className={button}>
              ✦ Nouveau produit avec l&apos;IA
            </Link>
            <Link href="/dashboard/produits/nouveau" className={buttonOutline}>
              + Nouveau produit
            </Link>
          </div>
        }
      >
        Produits
      </PageTitle>

      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher…"
          className={`${input} max-w-xs`}
          aria-label="Rechercher un produit"
        />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={`${input} max-w-xs`} aria-label="Catégorie">
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${input} max-w-xs`} aria-label="Filtre">
          {Object.entries(FILTERS).map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : loading && !data ? (
        <Loading />
      ) : (
        <Card>
          {shown.length === 0 ? (
            <p className="text-sm text-[#626060]">
              {products.length === 0 ? "Aucun produit pour le moment." : "Aucun produit ne correspond."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="text-xs uppercase text-[#626060]">
                  <tr className="border-b border-[#B4B4B4]/30">
                    <th className="py-2 text-start font-semibold">Produit</th>
                    <th className="py-2 text-start font-semibold">Catégorie</th>
                    <th className="py-2 text-start font-semibold">Prix</th>
                    <th className="py-2 text-start font-semibold">Stock</th>
                    <th className="py-2 text-start font-semibold">Statut</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody>
                  {shown.map((p) => {
                    const promo = p.discountPrice > 0 && p.discountPrice < p.price;
                    return (
                      <tr key={p._id} className="border-b border-[#B4B4B4]/20 last:border-0 hover:bg-[#F4F4F5]/60">
                        <td className="py-2.5">
                          <div className="flex items-center gap-3">
                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-[#B4B4B4]/30 bg-[#F4F4F5]">
                              {p.mainImage?.url ? (
                                <Image src={p.mainImage.url} alt="" fill sizes="44px" className="object-contain p-1" />
                              ) : (
                                <Package className="m-auto mt-3 text-[#B4B4B4]" size={18} />
                              )}
                            </div>
                            <div>
                              <TextLink href={`/dashboard/produits/${p._id}`}>{p.title}</TextLink>
                              {p.aiGenerated && !p.accepted && (
                                <span className="ms-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                                  IA — à vérifier
                                </span>
                              )}
                              <div className="text-xs text-[#626060]">{p.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5">{p.category || "—"}</td>
                        <td className="py-2.5">
                          {mad(promo ? p.discountPrice : p.price)}
                          {promo && <div className="text-xs text-[#626060] line-through">{mad(p.price)}</div>}
                        </td>
                        <td className="py-2.5">
                          {p.stock === "out_of_stock" ? (
                            <span className="text-red-700">Rupture</span>
                          ) : (
                            "En stock"
                          )}
                        </td>
                        <td className="py-2.5">
                          {p.accepted ? (
                            <span className="text-green-700">Visible</span>
                          ) : (
                            <span className="text-[#626060]">Masqué</span>
                          )}
                        </td>
                        <td className="py-2.5 text-end">
                          {!p.accepted && (
                            <button
                              onClick={() => publish(p._id)}
                              disabled={busyId === p._id}
                              className="text-sm font-medium text-green-700 hover:underline disabled:opacity-50"
                            >
                              Publier
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Products />
    </Suspense>
  );
}
