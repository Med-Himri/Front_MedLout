// Product photos are shrunk in the browser before upload. Vercel refuses any
// request body over 4.5 MB (the request never reaches the API), and phone or
// AI-generated pictures are often 3–10 MB each.

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const IMAGE_ACCEPT = IMAGE_TYPES.join(",");

const MAX_INPUT_MB = 30; // what we accept from the user, before shrinking
const MAX_SIDE = 1600; // px — the site shows product photos at 1200 px max
const QUALITY = 0.85;

// Total for one save, below Vercel's 4.5 MB with room for the text fields.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image illisible."));
    };
    img.src = url;
  });

/**
 * Checks a picked file and returns a smaller JPEG (max 1600 px, white
 * background for transparent PNGs). Throws an Error with a French message.
 */
export async function prepareImage(file) {
  if (!IMAGE_TYPES.includes(file.type)) {
    throw new Error("Formats acceptés : JPEG, PNG, WEBP, AVIF.");
  }
  if (file.size > MAX_INPUT_MB * 1024 * 1024) {
    throw new Error(`Image trop lourde (${MAX_INPUT_MB} Mo maximum).`);
  }

  const img = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF"; // the site shows products on white
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
  if (!blob) throw new Error("Impossible de préparer l'image.");

  // Already small and not resized: keep the original if it is lighter
  if (scale === 1 && file.type === "image/jpeg" && file.size <= blob.size) return file;

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
}

/** Total size of the files about to be sent, and whether it fits. */
export const uploadFits = (files) =>
  files.filter(Boolean).reduce((sum, f) => sum + f.size, 0) <= MAX_UPLOAD_BYTES;

export const TOO_MANY_PHOTOS =
  "Trop de photos à envoyer en une fois. Enregistrez avec moins de photos, puis ajoutez les autres en modifiant le produit.";
