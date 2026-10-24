"use client";

import Link from "next/link";
import { getDashboardAPI } from "@/services/admin.service";
import { useAdminData } from "@/components/admin/useAdminData";
import {
  Card,
  ErrorBox,
  Loading,
  PageTitle,
  Stat,
  StatusBadge,
  TextLink,
  date,
  mad,
  orderRef,
} from "@/components/admin/ui";

export default function DashboardHome() {
  const { data: d, loading, error, reload } = useAdminData(getDashboardAPI);

  if (loading && !d) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const todo = [
    d.toCall > 0 && {
      text: `${d.toCall} nouvelle${d.toCall > 1 ? "s" : ""} commande${d.toCall > 1 ? "s" : ""} à confirmer par téléphone / WhatsApp.`,
      href: "/dashboard/commandes?status=pending",
      cta: "Les ouvrir",
    },
    d.aiDrafts > 0 && {
      text: `${d.aiDrafts} produit${d.aiDrafts > 1 ? "s" : ""} écrit${d.aiDrafts > 1 ? "s" : ""} par l'IA attend${d.aiDrafts > 1 ? "ent" : ""} une vérification (masqué${d.aiDrafts > 1 ? "s" : ""} du site).`,
      href: "/dashboard/produits?filtre=ia",
      cta: "Vérifier",
    },
    d.hiddenProducts - d.aiDrafts > 0 && {
      text: `${d.hiddenProducts - d.aiDrafts} autre${d.hiddenProducts - d.aiDrafts > 1 ? "s" : ""} produit${d.hiddenProducts - d.aiDrafts > 1 ? "s" : ""} masqué${d.hiddenProducts - d.aiDrafts > 1 ? "s" : ""}.`,
      href: "/dashboard/produits?filtre=masques",
      cta: "Voir",
    },
    d.unreadMessages > 0 && {
      text: `${d.unreadMessages} message${d.unreadMessages > 1 ? "s" : ""} non lu${d.unreadMessages > 1 ? "s" : ""}.`,
      href: "/dashboard/messages",
      cta: "Lire",
    },
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <PageTitle>Tableau de bord</PageTitle>

      {todo.length > 0 && (
        <Card title="À faire">
          <ul className="list-disc space-y-1.5 ps-5 text-sm">
            {todo.map((t) => (
              <li key={t.href}>
                {t.text} <TextLink href={t.href}>{t.cta}</TextLink>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Chiffre d'affaires" value={mad(d.revenue)} hint="Commandes confirmées, expédiées et livrées" />
        <Stat label="Commandes" value={d.orderCount} />
        <Stat label="Commandes en cours" value={d.openOrders} hint={`${d.toCall} à appeler`} />
        <Stat label="Produits" value={d.productCount} hint={`${d.hiddenProducts} masqué${d.hiddenProducts > 1 ? "s" : ""}`} />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card title="Dernières commandes" action={<TextLink href="/dashboard/commandes">Toutes les commandes</TextLink>}>
          {d.recentOrders.length === 0 ? (
            <p className="text-sm text-[#626060]">Aucune commande pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <tbody>
                  {d.recentOrders.map((o) => (
                    <tr key={o._id} className="border-b border-[#B4B4B4]/20 last:border-0">
                      <td className="py-2.5">
                        <TextLink href={`/dashboard/commandes/${o._id}`}>{orderRef(o)}</TextLink>
                        <div className="text-xs text-[#626060]">{date(o.createdAt)}</div>
                      </td>
                      <td className="py-2.5">
                        {o.customerName}
                        <div className="text-xs text-[#626060]" dir="ltr">{o.phone}</div>
                      </td>
                      <td className="py-2.5">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="py-2.5 text-end font-medium">{mad(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card title="En rupture de stock">
            {d.outOfStock.length === 0 ? (
              <p className="text-sm text-[#626060]">Aucun produit en rupture.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {d.outOfStock.map((p) => (
                  <li key={p._id}>
                    <TextLink href={`/dashboard/produits/${p._id}`}>{p.title}</TextLink>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Derniers messages" action={<TextLink href="/dashboard/messages">Tous</TextLink>}>
            {d.recentMessages.length === 0 ? (
              <p className="text-sm text-[#626060]">Aucun message pour le moment.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {d.recentMessages.map((m) => (
                  <li key={m._id}>
                    <span className="font-medium">{m.name}</span>{" "}
                    {!m.read && <span className="rounded-full bg-[#C41E3A] px-1.5 text-[10px] text-white">nouveau</span>}
                    <span className="text-xs text-[#626060]"> · {date(m.createdAt)}</span>
                    <p className="line-clamp-1 text-[#626060]">{m.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Raccourcis">
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/dashboard/produits/ia" className="text-[#C41E3A] hover:underline">✦ Nouveau produit avec l&apos;IA</Link>
              <Link href="/dashboard/produits/nouveau" className="text-[#C41E3A] hover:underline">+ Nouveau produit</Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
