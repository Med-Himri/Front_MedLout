"use client";

import { use, useMemo } from "react";
import ProductForm from "@/components/admin/ProductForm";
import { useAdminData } from "@/components/admin/useAdminData";
import { ErrorBox, Loading } from "@/components/admin/ui";
import { getProductByIdAPI, getProductsAPI } from "@/services/product.service";
import { CATEGORIES } from "@/lib/categories";

// /dashboard/produits/nouveau → create, /dashboard/produits/<id> → edit
export default function ProductEditPage({ params }) {
  const { id } = use(params);
  const isNew = id === "nouveau";

  const product = useAdminData(() => (isNew ? Promise.resolve({ data: null }) : getProductByIdAPI(id)), [id]);
  const list = useAdminData(getProductsAPI);
  // The shop's 6 categories first, then any other names already used
  const categories = useMemo(
    () => [...new Set([...CATEGORIES.map((c) => c.label), ...(list.data || []).map((p) => p.category).filter(Boolean)])],
    [list.data]
  );

  if (product.loading) return <Loading />;
  if (product.error) return <ErrorBox message={product.error} onRetry={product.reload} />;

  // key: remount the form when switching from "nouveau" to the created product
  return <ProductForm key={id} product={product.data} categories={categories} />;
}
