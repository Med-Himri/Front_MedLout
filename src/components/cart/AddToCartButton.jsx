"use client";

import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { addToCart, increaseQty, decreaseQty } from "@/redux/slices/cartSlice";

export default function AddToCartButton({ product }) {
  const dispatch = useDispatch();

  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.id === product._id)
  );

  const handleAdd = () => {
    dispatch(
      addToCart({
        id: product._id,
        title: product.title,
        price: product.discountPrice || product.price,
        image: product.mainImage?.url,
        slug: product.slug,
        partNumber: product.partNumber || "",
      })
    );
  };

  const increase = () => dispatch(increaseQty(product._id));
  const decrease = () => dispatch(decreaseQty(product._id));

  if (cartItem) {
    return (
      <div className="w-full bg-[#1E1E1E] rounded-lg p-3 border border-[#2A2A2A] flex items-center justify-between">
        <button
          type="button"
          onClick={decrease}
          className="w-11 h-11 rounded-lg bg-[#262626] border border-[#333333] text-[#F4F4F5]
            flex items-center justify-center hover:bg-[#C41E3A] hover:border-[#C41E3A] transition-all cursor-pointer"
          aria-label="Diminuer la quantité"
        >
          <Minus size={18} />
        </button>

        <div className="text-center px-4">
          <div className="text-lg font-bold text-[#F4F4F5]" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            {cartItem.quantity} {cartItem.quantity === 1 ? "Pièce" : "Pièces"}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#C41E3A]">
            Dans le Panier
          </div>
        </div>

        <button
          type="button"
          onClick={increase}
          className="w-11 h-11 rounded-lg bg-[#C41E3A] text-white border border-[#C41E3A]
            flex items-center justify-center hover:bg-[#8F1529] transition-all cursor-pointer"
          aria-label="Augmenter la quantité"
        >
          <Plus size={18} />
        </button>
      </div>
    );
  }

  // Out of stock: the "Commander maintenant" button already says so
  if (product.stock !== "in_stock") return null;

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="w-full bg-transparent border-2 border-[#C41E3A] text-[#F4F4F5]
        py-3.5 px-8 rounded-lg font-bold text-xs uppercase tracking-widest
        hover:bg-[#C41E3A] transition-all duration-300
        flex items-center justify-center gap-3 cursor-pointer"
      style={{ fontFamily: "'Rajdhani', sans-serif" }}
    >
      <ShoppingCart size={18} />
      <span>Ajouter au Panier</span>
    </button>
  );
}
