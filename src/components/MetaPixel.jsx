"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { META_PIXEL_ID, PIXEL_CURRENCY, isTrackedPath, loadPixel, track } from "@/lib/metaPixel";

// Loads the Meta Pixel and sends PageView on every page of the shop.
// Next.js changes pages without reloading, so each new path is sent here.
// Does nothing while NEXT_PUBLIC_META_PIXEL_ID is not set, and never on /dashboard.
export function MetaPixel() {
  const pathname = usePathname();
  const lastTracked = useRef(null);

  useEffect(() => {
    if (!META_PIXEL_ID || !isTrackedPath(pathname) || lastTracked.current === pathname) return;
    loadPixel();
    lastTracked.current = pathname;
    window.fbq("track", "PageView");
  }, [pathname]);

  return null;
}

/** Sends ViewContent once when a product page opens. */
export function TrackViewContent({ product }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    loadPixel();
    const promo = product.discountPrice > 0 && product.discountPrice < product.price;
    track("ViewContent", {
      content_ids: [String(product._id)],
      content_name: product.title,
      content_category: product.category || undefined,
      content_type: "product",
      value: promo ? product.discountPrice : product.price,
      currency: PIXEL_CURRENCY,
    });
  }, [product]);

  return null;
}
