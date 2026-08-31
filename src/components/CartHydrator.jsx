"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrateCart } from "@/redux/slices/cartSlice";

// Renders nothing — loads the cart from localStorage into Redux after
// mount, client-side only. See cartSlice.js comment for why this can't
// happen during initial state creation.
export function CartHydrator() {
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        dispatch(hydrateCart(JSON.parse(stored)));
      } catch (err) {
        console.error("Failed to parse stored cart:", err);
      }
    }
  }, [dispatch]);

  return null;
}
