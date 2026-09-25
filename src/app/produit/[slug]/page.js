import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { CheckCircle, ShieldCheck, Package, ChevronRight } from "lucide-react";
import { getUniformThumbnail } from "@/utils/cloudinaryImage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Same translation map as produit/page.js — categories already in the
// database were saved in English from an earlier AI prompt version.
const CATEGORY_FR = {
  "Brakes": "Freins",
  "Filters": "Filtres",
  "Oil Filters": "Filtres à Huile",
  "Air Filters": "Filtres à Air",
  "Fuel Filters": "Filtres à Carburant",
  "Suspension": "Suspension",
  "Engine Components": "Composants Moteur",
  "Electrical": "Électrique",
  "Cooling System": "Système de Refroidissement",
  "Exhaust": "Échappement",
  "Body Parts": "Carrosserie",
  "Lighting": "Éclairage",
  "Tools & Accessories": "Outils & Accessoires",
};

const translateCategory = (cat) => CATEGORY_FR[cat] || cat;

async function fetchProduct(slug) {
  try {
    const res = await fetch(`${API_URL}/api/product/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Erreur SEO Fetch:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return { title: "Produit Introuvable | Medlout Auto", robots: { index: false } };
  }

  return {
    title: `${product.metaTitle || product.title} | Medlout Auto`,
    description: product.metaDescription || product.shortDescription,
    alternates: { canonical: `https://www.medloutauto.com/produit/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: product.mainImage?.url ? [{ url: product.mainImage.url }] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return (
      <div className="py-40 text-center bg-[#121212] min-h-screen text-[#F4F4F5]">
        <h1 className="text-2xl mb-4">Produit introuvable.</h1>
        <Link href="/produit" className="text-[#C41E3A] underline text-sm">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const isInStock = product.stock === "in_stock";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [product.mainImage?.url],
    description: product.shortDescription || "",
    brand: { "@type": "Brand", name: "Medlout Auto" },
    offers: {
      "@type": "Offer",
      url: `https://www.medloutauto.com/produit/${product.slug}`,
      priceCurrency: "MAD",
      price: String(product.discountPrice || product.price),
      availability: isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="bg-[#121212] min-h-screen text-[#F4F4F5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Header />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#A0A0A0] mb-8">
          <Link href="/produit" className="hover:text-[#C41E3A] transition-colors">Boutique</Link>
          <ChevronRight size={12} />
          <span className="text-[#F4F4F5]">{translateCategory(product.category) || "Produit"}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
          {/* Image */}
          <div className="lg:col-span-6">
            <div className="relative aspect-square bg-[#F4F4F5] rounded-2xl border border-[#2A2A2A] overflow-hidden shadow-2xl">
              <Image
                src={getUniformThumbnail(product.mainImage?.url, 1200) || "/fallback.jpg"}
                alt={product.title}
                fill
                priority
                className="object-contain p-10"
              />
            </div>
            {product.gallery && product.gallery.length > 0 && (
              <div className="flex gap-3 mt-4">
                {product.gallery.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl border border-[#2A2A2A] bg-[#F4F4F5] overflow-hidden">
                    <Image src={getUniformThumbnail(img.url, 300)} alt={`Vue ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-6 space-y-7">
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <span className="inline-flex items-center gap-1.5 bg-[#C41E3A]/15 text-[#C41E3A] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  <Package size={11} /> {translateCategory(product.category)}
                </span>
              )}
            </div>

            <h1
              className="text-2xl md:text-3xl font-bold leading-tight"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                {(hasDiscount ? product.discountPrice : product.price).toFixed(2)} <span className="text-2xl">DH</span>
              </span>
              {hasDiscount && (
                <span className="text-base text-[#A0A0A0] line-through">
                  {product.price.toFixed(2)} DH
                </span>
              )}
            </div>

            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                isInStock
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              <CheckCircle size={13} />
              {isInStock ? "En Stock" : "Rupture de Stock"}
            </div>

            <p className="text-[#F4F4F5]/70 text-sm leading-relaxed border-l-2 border-[#C41E3A] pl-4">
              {product.shortDescription}
            </p>

            <div className="pt-2 max-w-md">
              <AddToCartButton product={product} />
            </div>

            <div className="flex items-center gap-2 pt-4 text-[11px] text-[#A0A0A0]">
              <ShieldCheck size={14} className="text-[#C41E3A]" />
              Commande via WhatsApp — Livraison partout au Maroc
            </div>
          </div>
        </div>

        {/* Full description */}
        <section className="mt-24 pt-14 border-t border-[#2A2A2A] max-w-3xl mx-auto">
          <h2
            className="text-xl font-bold uppercase mb-8 text-center"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Détails du Produit
          </h2>
          <article
            className="prose prose-invert prose-sm max-w-none prose-p:text-[#F4F4F5]/75 prose-headings:text-[#F4F4F5] prose-strong:text-[#F4F4F5] prose-li:text-[#F4F4F5]/75"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}