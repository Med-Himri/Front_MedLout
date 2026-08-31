"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CheckCircle, Trash2, Pencil, ArrowLeft, Loader2, XCircle } from "lucide-react";
import { getProductsAPI, acceptProductAPI, rejectProductAPI } from "@/services/product.service";

export default function CatalogueOverview() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const getAllProductRequests = useCallback(async () => {
    try {
      const response = await getProductsAPI();
      setProducts(response.data || []);
    } catch (err) {
      console.error("Erreur lors du chargement du catalogue:", err);
      // A 404 here just means "no products yet" — not a real error
      if (err.response?.status !== 404) {
        toast.error("Échec du chargement du catalogue");
      }
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllProductRequests();
  }, [getAllProductRequests]);

  const handleApprove = async (id) => {
    setActionLoadingId(id);
    try {
      await acceptProductAPI(id);
      toast.success("Pièce approuvée — elle est maintenant visible sur le site.");
      await getAllProductRequests();
    } catch (err) {
      console.error("Erreur lors de l'approbation:", err);
      toast.error("Échec de l'approbation");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    setActionLoadingId(id);
    try {
      await rejectProductAPI(id);
      toast.success("Pièce supprimée");
      await getAllProductRequests();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      toast.error("Échec de la suppression");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] p-4 md:p-8 text-[#1A1A1A]">
      <header className="bg-white p-5 rounded-xl shadow-sm border border-[#B4B4B4]/20 mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="p-2 rounded-lg bg-[#F4F4F5] hover:bg-[#1A1A1A] hover:text-white transition-colors border border-[#B4B4B4]/30"
          aria-label="Retour au dashboard"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#C41E3A]">
            Gestion du Catalogue
          </span>
          <h1 className="text-xl font-bold uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Toutes les Pièces
          </h1>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-[#C41E3A]" size={32} />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center border border-[#B4B4B4]/20">
          <p className="text-[#626060]">Aucune pièce dans le catalogue pour le moment.</p>
          <Link
            href="/dashboard/ajouter-produit"
            className="inline-block mt-6 bg-[#1A1A1A] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-[#C41E3A] transition-all"
          >
            Ajouter la Première Pièce
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#B4B4B4]/20 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F4F4F5] border-b border-[#B4B4B4]/20">
              <tr>
                <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wide text-[#626060]">Image</th>
                <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wide text-[#626060]">Titre</th>
                <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wide text-[#626060]">Statut</th>
                <th className="text-right p-4 text-[10px] font-bold uppercase tracking-wide text-[#626060]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-[#B4B4B4]/10 last:border-0 hover:bg-[#F4F4F5]/50">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F4F4F5] border border-[#B4B4B4]/20">
                      {product.mainImage?.url && (
                        <img src={product.mainImage.url} alt={product.title} className="w-full h-full object-contain p-1" />
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium">{product.title}</td>
                  <td className="p-4">
                    {product.accepted ? (
                      <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                        <CheckCircle size={11} /> Approuvée
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                        <XCircle size={11} /> En Attente
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {!product.accepted && (
                        <button
                          onClick={() => handleApprove(product._id)}
                          disabled={actionLoadingId === product._id}
                          className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50"
                          title="Approuver"
                        >
                          {actionLoadingId === product._id ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                        </button>
                      )}
                      <Link
                        href={`/dashboard/modifier-produit/${product._id}`}
                        className="p-2 rounded-lg bg-[#F4F4F5] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
                        title="Modifier"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={actionLoadingId === product._id}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                        title="Supprimer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
