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