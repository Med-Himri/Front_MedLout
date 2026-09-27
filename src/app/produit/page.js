// import { Header } from "@/components/home/Header";
// import { Footer } from "@/components/home/Footer";
// import Link from "next/link";
// import Image from "next/image";
// import { SlidersHorizontal, Package } from "lucide-react";
// import { getUniformThumbnail } from "@/utils/cloudinaryImage";

// export const metadata = {
//   title: "Boutique | Tous Nos Accessoires",
//   description: "Parcourez notre catalogue complet d'accessoires.",
// };

// // Categories already in the database were saved in English (from an earlier
// // version of the AI prompt) — this translates them for display without
// // needing to edit every existing product. New AI-generated products now
// // come out in French directly (see productController.js).
// const CATEGORY_FR = {
//   "Brakes": "Freins",
//   "Filters": "Filtres",
//   "Oil Filters": "Filtres à Huile",
//   "Air Filters": "Filtres à Air",
//   "Fuel Filters": "Filtres à Carburant",
//   "Suspension": "Suspension",
//   "Engine Components": "Composants Moteur",
//   "Electrical": "Électrique",
//   "Cooling System": "Système de Refroidissement",
//   "Exhaust": "Échappement",
//   "Body Parts": "Carrosserie",
//   "Lighting": "Éclairage",
//   "Tools & Accessories": "Outils & Accessoires",
// };

// const translateCategory = (cat) => CATEGORY_FR[cat] || cat;

// async function fetchProducts() {
//   try {
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
//     const res = await fetch(`${apiUrl}/api/product/getallproducts`, {
//       next: { revalidate: 60 },
//     });
//     if (!res.ok) return [];
//     return res.json();
//   } catch (error) {
//     console.error("Erreur de récupération des produits:", error);
//     return [];
//   }
// }

// export default async function ProductListPage() {
//   const products = await fetchProducts();

//   // Group by category for a quick filter rail — purely presentational for now
//   const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

//   return (
//     <div className="min-h-screen bg-[#121212]">
//       <Header />

//       {/* Page header band */}
//       <div className="border-b border-[#2A2A2A] bg-[#1A1A1A] pt-32 pb-10">
//         <div className="max-w-7xl mx-auto px-6">
//           <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C41E3A]">
//             Catalogue Complet
//           </span>
//           <div className="flex items-end justify-between flex-wrap gap-4 mt-2">
//             <h1
//               className="text-3xl md:text-4xl font-bold uppercase text-[#F4F4F5]"
//               style={{ fontFamily: "'Rajdhani', sans-serif" }}
//             >
//               Tous Nos Accessoires
//             </h1>
//             <p className="text-sm text-[#A0A0A0]">
//               {products.length} produit{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
//             </p>
//           </div>
//         </div>
//       </div>

//       <main className="max-w-7xl mx-auto px-6 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
//           {/* Filter rail */}
//           <aside className="hidden lg:block">
//             <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-5 sticky top-28">
//               <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2A2A2A]">
//                 <SlidersHorizontal size={15} className="text-[#C41E3A]" />
//                 <span className="text-[11px] font-bold uppercase tracking-wider text-[#F4F4F5]">
//                   Catégories
//                 </span>
//               </div>
//               <ul className="space-y-1">
//                 <li>
//                   <span className="block px-3 py-2 rounded-lg text-xs font-semibold bg-[#C41E3A]/15 text-[#C41E3A] cursor-default">
//                     Tous les Produits
//                   </span>
//                 </li>
//                 {categories.map((cat) => (
//                   <li key={cat}>
//                     <span className="block px-3 py-2 rounded-lg text-xs font-medium text-[#A0A0A0] hover:bg-[#262626] hover:text-[#F4F4F5] transition-colors cursor-default">
//                       {translateCategory(cat)}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </aside>

//           {/* Product grid */}
//           <div>
//             {products.length === 0 ? (
//               <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl py-24 text-center">
//                 <Package className="mx-auto text-[#A0A0A0] mb-4" size={32} />
//                 <p className="text-[#A0A0A0]">Aucun produit disponible pour le moment.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
//                 {products.map((product) => {
//                   const hasDiscount = product.discountPrice && product.discountPrice < product.price;
//                   return (
//                     <Link
//                       key={product._id}
//                       href={`/produit/${product.slug}`}
//                       className="group block bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl overflow-hidden transition-all duration-200 hover:border-[#C41E3A]/50 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
//                     >
//                       <div className="relative aspect-square bg-[#F4F4F5]">
//                         <Image
//                           src={getUniformThumbnail(product.mainImage?.url) || "/fallback.jpg"}
//                           alt={product.title}
//                           fill
//                           className="object-cover group-hover:scale-105 transition-transform duration-300"
//                           sizes="(max-width: 768px) 50vw, 25vw"
//                         />
//                         {hasDiscount && (
//                           <span className="absolute top-2 left-2 bg-[#C41E3A] text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wide">
//                             Promo
//                           </span>
//                         )}
//                       </div>
//                       <div className="p-4">
//                         {product.category && (
//                           <p className="text-[9px] font-bold uppercase tracking-wider text-[#C41E3A] mb-1.5">
//                             {translateCategory(product.category)}
//                           </p>
//                         )}
//                         <h3 className="text-sm font-semibold text-[#F4F4F5] line-clamp-2 mb-2 leading-snug">
//                           {product.title}
//                         </h3>
//                         <div className="flex items-baseline gap-2">
//                           <span className="text-base font-bold text-[#F4F4F5]">
//                             {(product.discountPrice || product.price).toFixed(2)} DH
//                           </span>
//                           {hasDiscount && (
//                             <span className="text-xs text-[#A0A0A0] line-through">
//                               {product.price.toFixed(2)} DH
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import Image from "next/image";
import { getUniformThumbnail } from "@/utils/cloudinaryImage";

export default function ProductGallery({ mainImage, gallery = [], title }) {
  // All available images: the main one first, then the gallery photos.
  const allImages = [
    ...(mainImage ? [{ url: mainImage }] : []),
    ...gallery.filter((img) => img?.url),
  ];

  const [selectedUrl, setSelectedUrl] = useState(mainImage || allImages[0]?.url);

  return (
    <div>
      <div className="relative aspect-square bg-[#F4F4F5] rounded-2xl border border-[#2A2A2A] overflow-hidden shadow-2xl">
        <Image
          src={getUniformThumbnail(selectedUrl, 1200) || "/fallback.jpg"}
          alt={title}
          fill
          priority
          className="object-contain p-10"
        />
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-3 mt-4">
          {allImages.map((img, i) => {
            const isActive = img.url === selectedUrl;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedUrl(img.url)}
                aria-label={`Voir la photo ${i + 1}`}
                aria-pressed={isActive}
                className={`relative w-20 h-20 rounded-xl border bg-[#F4F4F5] overflow-hidden shrink-0 transition-colors ${
                  isActive ? "border-[#C41E3A] border-2" : "border-[#2A2A2A] hover:border-[#C41E3A]/60"
                }`}
              >
                <Image
                  src={getUniformThumbnail(img.url, 300)}
                  alt={`Vue ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}