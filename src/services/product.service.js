import axiosInstance from "@/utils/axiosInstance";

export const getAllProductsAPI = async () => {
  const response = await axiosInstance.get("/api/product/getallproducts");
  return response;
};

export const getSingleProductAPI = async (slug) => {
  const response = await axiosInstance.get(`/api/product/${slug}`);
  return response;
};

// Recherche par compatibilité véhicule — make/model/year
export const getProductsByVehicleAPI = async (make, model, year) => {
  const response = await axiosInstance.get("/api/product/fits", {
    params: { make, model, year },
  });
  return response;
};

/* ================= ADMIN — LISTE COMPLÈTE (avec statut accepted) ================= */
export const getProductsAPI = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Utilisateur non connecté");

  const response = await axiosInstance.get("/api/product/getproducts", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response;
};

/* ================= ADMIN — DÉTAIL PAR ID (ignore le statut accepted) ================= */
export const getProductByIdAPI = async (id) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Utilisateur non connecté");

  const response = await axiosInstance.get(`/api/product/admin/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response;
};

/* ================= ADMIN — APPROUVER ================= */
export const acceptProductAPI = async (id) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Utilisateur non connecté");

  const response = await axiosInstance.post(
    "/api/product/acceptproduct",
    { id },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response;
};

/* ================= ADMIN — SUPPRIMER ================= */
export const rejectProductAPI = async (id) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Utilisateur non connecté");

  const response = await axiosInstance.post(
    "/api/product/delete",
    { id },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response;
};

/* ================= ADMIN — MODIFIER ================= */
export const updateProductAPI = async (id, data) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Utilisateur non connecté");

  const {
    title, slug, price, discountPrice, partNumber, sku, condition,
    category, tags, brand, shortDescription, metaTitle, metaDescription,
    description, mainImage, gallery, compatibility,
  } = data;

  const formData = new FormData();
  formData.append("id", id);
  formData.append("title", title || "");
  formData.append("slug", slug || "");
  formData.append("price", price || "");
  formData.append("discountPrice", discountPrice || "");
  formData.append("partNumber", partNumber || "");
  formData.append("sku", sku || "");
  formData.append("condition", condition || "new");
  formData.append("category", category || "");
  formData.append("tags", Array.isArray(tags) ? tags.join(",") : tags || "");
  formData.append("brand", brand || "");
  formData.append("shortDescription", shortDescription || "");
  formData.append("metaTitle", metaTitle || "");
  formData.append("metaDescription", metaDescription || "");
  formData.append("description", description || "");

  if (compatibility) {
    formData.append("compatibility", JSON.stringify(compatibility));
  }
  if (mainImage) formData.append("mainImage", mainImage);
  gallery?.forEach((img) => formData.append("gallery", img));

  const response = await axiosInstance.post("/api/product/updateproduct", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};
export const createProductAPI = async (data) => {
  if (typeof window === "undefined") return;
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Utilisateur non connecté");
  }

  const {
    title,
    slug,
    price,
    discountPrice,
    partNumber,
    sku,
    condition,
    category,
    tags,
    brand,
    shortDescription,
    metaTitle,
    metaDescription,
    description,
    mainImage,
    gallery,
    compatibility, // [{ make, model, yearFrom, yearTo }]
  } = data;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("slug", slug);
  formData.append("price", price);
  formData.append("discountPrice", discountPrice || "");
  formData.append("partNumber", partNumber || "");
  formData.append("sku", sku || "");
  formData.append("condition", condition || "new");
  formData.append("category", category || "");
  formData.append("tags", tags || "");
  formData.append("brand", brand || "");
  formData.append("shortDescription", shortDescription || "");
  formData.append("metaTitle", metaTitle || "");
  formData.append("metaDescription", metaDescription || "");
  formData.append("description", description || "");
  formData.append("mainImage", mainImage);

  if (compatibility && compatibility.length > 0) {
    formData.append("compatibility", JSON.stringify(compatibility));
  }

  gallery?.forEach((img) => formData.append("gallery", img));

  const response = await axiosInstance.post("/api/product/addproduct", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};

/* ================= ADMIN — CRÉATION ASSISTÉE PAR IA ================= */
export const createAIProductAPI = async (data) => {
  if (typeof window === "undefined") return;
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Utilisateur non connecté");
  }

  const {
    productName,
    price,
    discountPrice,
    partNumber,
    sku,
    condition,
    brand,
    mainImage,
    galleryItems,
    compatibility,
  } = data;

  const formData = new FormData();
  formData.append("productName", productName);
  formData.append("price", price);
  if (discountPrice) formData.append("discountPrice", discountPrice);
  formData.append("partNumber", partNumber || "");
  formData.append("sku", sku || "");
  formData.append("condition", condition || "new");
  formData.append("brand", brand || "");
  if (mainImage) formData.append("mainImage", mainImage);

  if (compatibility && compatibility.length > 0) {
    formData.append("compatibility", JSON.stringify(compatibility));
  }

  if (galleryItems && galleryItems.length > 0) {
    const galleryMeta = [];
    galleryItems.forEach((item) => {
      formData.append("galleryImages", item.file);
      galleryMeta.push({ alt: item.alt || "" });
    });
    formData.append("galleryMeta", JSON.stringify(galleryMeta));
  }

  const response = await axiosInstance.post("/api/product/createaiproduct", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};
