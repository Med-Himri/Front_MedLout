"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MessageCircle, Phone, Package } from "lucide-react";
import { deleteOrderAPI, getOrderAPI, updateOrderAPI } from "@/services/admin.service";
import { useAdminData } from "@/components/admin/useAdminData";
import { useAdmin } from "@/components/admin/AdminShell";
import { apiError } from "@/utils/axiosInstance";
import {
  Card,
  ErrorBox,
  Loading,
  ORDER_STATUSES,
  PageTitle,
  STATUS_LABELS,
  StatusBadge,
  button,
  buttonDanger,
  date,
  input,
  label,
  mad,
  orderRef,
  waPhone,
} from "@/components/admin/ui";

export default function OrderDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { me } = useAdmin();
  const { data: order, loading, error, reload, setData } = useAdminData(() => getOrderAPI(id), [id]);

  const [status, setStatus] = useState("pending");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!order) return;
    setStatus(order.status);
    setNote(order.adminNote || "");
  }, [order]);

  if (loading && !order) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const ref = orderRef(order);
  const dirty = status !== order.status || note !== (order.adminNote || "");

  const save = async () => {
    if (status === "cancelled" && order.status !== "cancelled" && !confirm("Annuler cette commande ?")) return;
    setSaving(true);
    try {
      const { data } = await updateOrderAPI(order._id, { status, adminNote: note });
      setData(data.order);
      toast.success("Commande mise à jour");
    } catch (err) {
      toast.error(apiError(err, "Échec de la mise à jour"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Supprimer définitivement la commande ${ref} ?`)) return;
    try {
      await deleteOrderAPI(order._id);
      toast.success("Commande supprimée");
      router.push("/dashboard/commandes");
    } catch (err) {
      toast.error(apiError(err, "Échec de la suppression"));
    }
  };

  // Pre-filled WhatsApp message to the customer
  const waText = encodeURIComponent(
    `Bonjour ${order.customerName}, c'est Medlout Auto concernant votre commande ${ref} (${mad(order.total)}).`
  );

  return (
    <div className="space-y-6">
      <Link href="/dashboard/commandes" className="text-sm text-[#C41E3A] hover:underline">
        ← Commandes
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <PageTitle>{ref}</PageTitle>
        <StatusBadge status={order.status} />
      </div>
      <p className="text-sm text-[#626060]">
        Passée le {date(order.createdAt)} · Paiement à la livraison
        {order.updatedAt !== order.createdAt && <> · Modifiée le {date(order.updatedAt)}</>}
      </p>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card title="Articles">
          <table className="w-full text-sm">
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b border-[#B4B4B4]/20">
                  <td className="py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-[#B4B4B4]/30 bg-[#F4F4F5]">
                        {item.image ? (
                          <Image src={item.image} alt={item.title} fill sizes="48px" className="object-contain p-1" />
                        ) : (
                          <Package className="m-auto mt-3 text-[#B4B4B4]" size={20} />
                        )}
                      </div>
                      <div>
                        {item.slug ? (
                          <a href={`/produit/${item.slug}`} target="_blank" rel="noreferrer" className="hover:text-[#C41E3A]">
                            {item.title}
                          </a>
                        ) : (
                          item.title
                        )}
                        <div className="text-xs text-[#626060]">
                          {mad(item.price)} / pièce{item.partNumber && ` · Réf. ${item.partNumber}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center whitespace-nowrap">× {item.quantity}</td>
                  <td className="py-2.5 text-end">{mad(item.price * item.quantity)}</td>
                </tr>
              ))}
              <tr>
                <td className="pt-3 text-[#626060]">Livraison</td>
                <td />
                <td className="pt-3 text-end text-[#626060]">selon confirmation</td>
              </tr>
              <tr className="font-bold">
                <td className="pt-2">Total</td>
                <td />
                <td className="pt-2 text-end text-[#C41E3A]">{mad(order.total)}</td>
              </tr>
            </tbody>
          </table>
        </Card>

        <div className="space-y-6">
          <Card title="Client">
            <address className="text-sm not-italic leading-relaxed">
              <strong>{order.customerName}</strong>
              <br />
              <span dir="ltr">{order.phone}</span>
              {order.city && (
                <>
                  <br />
                  {order.city}
                </>
              )}
              {order.address && (
                <>
                  <br />
                  {order.address}
                </>
              )}
            </address>
            {order.notes && (
              <p className="mt-3 rounded-md bg-[#F4F4F5] p-3 text-sm">“{order.notes}”</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${waPhone(order.phone)}?text=${waText}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <a
                href={`tel:${order.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#B4B4B4]/60 px-3 py-2 text-sm hover:border-[#C41E3A] hover:text-[#C41E3A]"
              >
                <Phone size={15} /> Appeler
              </a>
            </div>
          </Card>

          <Card title="Mettre à jour">
            <div className="space-y-3">
              <label className={label}>
                Statut
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${input} mt-1`}>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>
              <label className={label}>
                Note interne (visible seulement par l&apos;équipe)
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  placeholder="ex. Client rappelé, livraison mardi"
                  className={`${input} mt-1`}
                />
              </label>
              <button className={button} disabled={saving || !dirty} onClick={save}>
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </Card>

          {me.role === "admin" && (
            <button className={buttonDanger} onClick={remove}>
              Supprimer la commande
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
