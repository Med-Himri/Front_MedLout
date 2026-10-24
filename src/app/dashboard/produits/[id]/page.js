"use client";

import { use, useMemo } from "react";
import ProductForm from "@/components/admin/ProductForm";
import { useAdminData } from "@/components/admin/useAdminData";
import { ErrorBox, Loading } from "@/components/admin/ui";
import { getProductByIdAPI, getProductsAPI } from "@/services/product.service";

// /dashboard/produits/nouveau → create, /dashboard/produits/<id> → edit
export default function ProductEditPage({ params }) {
  const { id } = use(params);
  const isNew = id === "nouveau";

  const product = useAdminData(() => (isNew ? Promise.resolve({ data: null }) : getProductByIdAPI(id)), [id]);
  const list = useAdminData(getProductsAPI);
  const categories = useMemo(
    () => [...new Set((list.data || []).map((p) => p.category).filter(Boolean))].sort(),
    [list.data]
  );

  if (product.loading) return <Loading />;
  if (product.error) return <ErrorBox message={product.error} onRetry={product.reload} />;

  // key: remount the form when switching from "nouveau" to the created product
  return <ProductForm key={id} product={product.data} categories={categories} />;
}
