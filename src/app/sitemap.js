import { SITE_URL } from "@/lib/site";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Regenerated at most once an hour.
export const revalidate = 3600;

export default async function sitemap() {
  const pages = ["", "/produit", "/about-nous", "/contact"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/produit" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  let products = [];
  try {
    const res = await fetch(`${API_URL}/api/product/`, { next: { revalidate } });
    if (res.ok) products = await res.json();
  } catch (error) {
    console.error("Sitemap: impossible de charger les produits", error);
  }

  return [
    ...pages,
    ...products.map((p) => ({
      url: `${SITE_URL}/produit/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
