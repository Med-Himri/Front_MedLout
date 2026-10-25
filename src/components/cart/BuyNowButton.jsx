import Link from "next/link";
import { Zap } from "lucide-react";

// Goes straight to the order form with only this product — the cart is not touched.
export default function BuyNowButton({ product }) {
  const isOutOfStock = product.stock !== "in_stock";
  const className =
    "w-full bg-[#C41E3A] text-white py-4 px-8 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg transition-all duration-300";

  if (isOutOfStock) {
    return (
      <span className={`${className} opacity-40 cursor-not-allowed`} style={{ fontFamily: "'Rajdhani', sans-serif" }}>
        Rupture de Stock
      </span>
    );
  }

  return (
    <Link
      href={`/commande?produit=${encodeURIComponent(product.slug)}`}
      className={`${className} hover:bg-[#8F1529]`}
      style={{ fontFamily: "'Rajdhani', sans-serif" }}
    >
      <Zap size={18} />
      <span>Commander Maintenant</span>
    </Link>
  );
}
