import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal, Package } from "lucide-react";
import { getUniformThumbnail } from "@/utils/cloudinaryImage";
import { SITE_URL } from "@/lib/site";
import { CATEGORIES, categoryBySlug, categoryOf } from "@/lib/categories";

export const metadata = {
  title: "Boutique — Tous Nos Accessoires",
  description: "Parcourez notre catalogue complet d'accessoires auto. Livraison gratuite partout au Maroc, paiement à la livraison.",
  alternates: { canonical: `${SITE_URL}/produit` },
};

async function fetchProducts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/api/product/getallproducts`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Erreur de récupération des produits:", error);
    return [];
  }
}

export default async function ProductListPage({ searchParams }) {
  // searchParams is a promise in Next.js 15+; awaiting a plain object is
  // also safe (it just resolves immediately), so this works either way.
  const resolvedSearchParams = (await searchParams) || {};
  const activeCategory = categoryBySlug(resolvedSearchParams.categorie);

  const allProducts = await fetchProducts();

  // Only show categories that have at least one product
  const categories = CATEGORIES.filter((c) => allProducts.some((p) => categoryOf(p)?.slug === c.slug));

  const products = activeCategory
    ? allProducts.filter((p) => categoryOf(p)?.slug === activeCategory.slug)
    : allProducts;

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />

      {/* Page header band */}
      <div className="border-b border-[#2A2A2A] bg-[#1A1A1A] pt-32 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C41E3A]">
            Catalogue Complet
          </span>
          <div className="flex items-end justify-between flex-wrap gap-4 mt-2">
            <h1
              className="text-3xl md:text-4xl font-bold uppercase text-[#F4F4F5]"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {activeCategory ? activeCategory.label : "Tous Nos Accessoires"}
            </h1>
            <p className="text-sm text-[#A0A0A0]">
              {products.length} produit{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Categories on phones (the side rail below is for large screens) */}
        {categories.length > 0 && (
          <nav aria-label="Catégories" className="lg:hidden -mx-6 px-6 mb-6 flex gap-2 overflow-x-auto pb-2">
            {[{ slug: "", label: "Tout" }, ...categories].map((cat) => {
              const active = cat.slug ? activeCategory?.slug === cat.slug : !activeCategory;
              return (
                <Link
                  key={cat.slug || "all"}
                  href={cat.slug ? `/produit?categorie=${cat.slug}` : "/produit"}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? "border-[#C41E3A] bg-[#C41E3A] text-white"
                      : "border-[#2A2A2A] bg-[#1E1E1E] text-[#A0A0A0] hover:text-[#F4F4F5]"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </nav>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {/* Filter rail */}
          <aside className="hidden lg:block">
            <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-5 sticky top-28">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2A2A2A]">
                <SlidersHorizontal size={15} className="text-[#C41E3A]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F4F4F5]">
                  Catégories
                </span>
              </div>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/produit"
                    className={`block px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      !activeCategory
                        ? "bg-[#C41E3A]/15 text-[#C41E3A]"
                        : "text-[#A0A0A0] hover:bg-[#262626] hover:text-[#F4F4F5]"
                    }`}
                  >
                    Tous les Produits
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/produit?categorie=${cat.slug}`}
                      className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        activeCategory?.slug === cat.slug
                          ? "bg-[#C41E3A]/15 text-[#C41E3A] font-semibold"
                          : "text-[#A0A0A0] hover:bg-[#262626] hover:text-[#F4F4F5]"
                      }`}
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product grid */}
          <div>
            {products.length === 0 ? (
              <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl py-24 text-center">
                <Package className="mx-auto text-[#A0A0A0] mb-4" size={32} />
                <p className="text-[#A0A0A0]">
                  {activeCategory
                    ? "Aucun produit dans cette catégorie pour le moment."
                    : "Aucun produit disponible pour le moment."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {products.map((product) => {
                  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
                  return (
                    <Link
                      key={product._id}
                      href={`/produit/${product.slug}`}
                      className="group block bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl overflow-hidden transition-all duration-200 hover:border-[#C41E3A]/50 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                    >
                      <div className="relative aspect-square bg-[#F4F4F5]">
                        {product.mainImage?.url ? (
                          <Image
                            src={getUniformThumbnail(product.mainImage.url)}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <Package className="absolute inset-0 m-auto text-[#B4B4B4]" size={40} />
                        )}
                        {hasDiscount && (
                          <span className="absolute top-2 left-2 bg-[#C41E3A] text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                            Promo
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        {product.category && (
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#C41E3A] mb-1.5">
                            {categoryOf(product)?.label || product.category}
                          </p>
                        )}
                        <h3 className="text-sm font-semibold text-[#F4F4F5] line-clamp-2 mb-2 leading-snug">
                          {product.title}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-[#F4F4F5]">
                            {(product.discountPrice || product.price).toFixed(2)} DH
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-[#A0A0A0] line-through">
                              {product.price.toFixed(2)} DH
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}