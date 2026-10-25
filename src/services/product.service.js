import axiosInstance from "@/utils/axiosInstance";

/* ================= PUBLIC ================= */
export const getAllProductsAPI = () => axiosInstance.get("/api/product/getallproducts");

export const getSingleProductAPI = (slug) => axiosInstance.get(`/api/product/${slug}`);

/* ================= ADMIN — LISTE COMPLÈTE (visibles + masqués) ================= */
export const getProductsAPI = () => axiosInstance.get("/api/product/getproducts");

/* ================= ADMIN — DÉTAIL PAR ID ================= */
export const getProductByIdAPI = (id) => axiosInstance.get(`/api/product/admin/${id}`);

/* ================= ADMIN — PUBLIER ================= */
export const acceptProductAPI = (id) => axiosInstance.post("/api/product/acceptproduct", { id });

/* ================= ADMIN — SUPPRIMER ================= */
export const deleteProductAPI = (id) => axiosInstance.post("/api/product/delete", { id });

// Builds the multipart body shared by create and update.
const productFormData = (data) => {
  const formData = new FormData();
  const fields = [
    "title", "slug", "price", "discountPrice", "stock", "category",
    "shortDescription", "metaTitle", "metaDescription", "description",
  ];
  fields.forEach((key) => formData.append(key, data[key] ?? ""));
  formData.append("tags", Array.isArray(data.tags) ? data.tags.join(",") : data.tags || "");
  formData.append("accepted", data.accepted ? "true" : "false");
  if (data.mainImage) formData.append("mainImage", data.mainImage);
  data.gallery?.forEach((img) => formData.append("gallery", img));
  return formData;
};

/* ================= ADMIN — CRÉER ================= */
export const createProductAPI = (data) =>
  axiosInstance.post("/api/product/addproduct", productFormData(data));

/* ================= ADMIN — MODIFIER ================= */
export const updateProductAPI = (id, data) => {
  const formData = productFormData(data);
  formData.append("id", id);
  if (data.removeGallery?.length) {
    formData.append("removeGallery", JSON.stringify(data.removeGallery));
  }
  return axiosInstance.post("/api/product/updateproduct", formData);
};

/* ================= ADMIN — CRÉATION ASSISTÉE PAR IA ================= */
export const createAIProductAPI = ({ productName, price, discountPrice, mainImage, galleryItems }) => {
  const formData = new FormData();
  formData.append("productName", productName);
  formData.append("price", price);
  if (discountPrice) formData.append("discountPrice", discountPrice);
  if (mainImage) formData.append("mainImage", mainImage);

  if (galleryItems?.length) {
    galleryItems.forEach((item) => formData.append("galleryImages", item.file));
    formData.append("galleryMeta", JSON.stringify(galleryItems.map((item) => ({ alt: item.alt || "" }))));
  }

  return axiosInstance.post("/api/product/createaiproduct", formData);
};
