/**
 * Inserts a Cloudinary transformation into an existing Cloudinary URL so
 * every product image renders at the same actual pixel dimensions —
 * padded onto a square canvas rather than relying on CSS alone, which
 * can't fully normalize wildly different source aspect ratios.
 *
 * c_pad   = fit the whole image inside the box without cropping
 * w_/h_   = target square size
 * b_white = fills empty space with white (matches your product card background)
 *
 * If the URL isn't a Cloudinary URL (e.g. a local fallback image), it's
 * returned unchanged.
 */
export function getUniformThumbnail(url, size = 800) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  return url.replace(
    "/upload/",
    `/upload/c_pad,w_${size},h_${size},b_white/`
  );
}