"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { getOrdersAPI } from "@/services/admin.service";
import { useAdminData } from "@/components/admin/useAdminData";
import {
  Card,
  ErrorBox,
  Loading,
  ORDER_STATUSES,
  PageTitle,
  STATUS_LABELS,
  StatusBadge,
  TextLink,
  buttonOutline,
  date,
  input,
  mad,
  orderRef,
  waPhone,
} from "@/components/admin/ui";

function Orders() {
  const router = useRouter();
  const params = useSearchParams();
  const status = ORDER_STATUSES.includes(params.get("status")) ? params.get("status") : "";
  const q = params.get("q") || "";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const [search, setSearch] = useState(q);

  const { data, loading, error, reload } = useAdminData(
    () => getOrdersAPI({ status: status || undefined, q: q || undefined, page }),
    [status, q, page]
  );

  const go = (next) => {
    const sp = new URLSearchParams({ status, q, page: String(page), ...next });
    for (const [k, v] of [...sp.entries()]) if (!v || (k === "page" && v === "1")) sp.delete(k);
    router.replace(`/dashboard/commandes${sp.size ? `?${sp}` : ""}`);
  };

  // Search as you type (debounced)
  useEffect(() => {
    if (search === q) return;
    const t = setTimeout(() => go({ q: search, page: "1" }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const counts = data?.counts || {};
  const all = Object.values(counts).reduce((a, b) => a + b, 0);

  const pill = (active) =>
    `rounded-full border px-3 py-1 transition-colors ${
      active
        ? "border-[#C41E3A] bg-[#C41E3A] text-white"
        : "border-[#B4B4B4]/50 bg-white hover:border-[#C41E3A]"
    }`;

  return (
    <div className="space-y-6">
      <PageTitle>Commandes</PageTitle>
      <p className="text-sm text-[#626060]">
        Chaque commande du site est enregistrée ici <strong>et</strong> envoyée sur WhatsApp avec le
        même numéro (ex. ML-7K2QX9) pour retrouver la conversation.
      </p>

      <div className="flex flex-wrap gap-2 text-sm">
        <button onClick={() => go({ status: "", page: "1" })} className={pill(!status)}>
          Toutes {data && <span className="opacity-70">({all})</span>}
        </button>
        {ORDER_STATUSES.map((s) => (
          <button key={s} onClick={() => go({ status: s, page: "1" })} className={pill(status === s)}>
            {STATUS_LABELS[s]} {data && <span className="opacity-70">({counts[s] || 0})</span>}
          </button>
        ))}
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher : n° de commande, nom, téléphone, ville…"
        className={`${input} max-w-md`}
        aria-label="Rechercher une commande"
      />

      {error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : loading && !data ? (
        <Loading />
      ) : (
        <Card>
          {data.orders.length === 0 ? (
            <p className="text-sm text-[#626060]">Aucune commande.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full min-w-[760px] text-sm ${loading ? "opacity-60" : ""}`}>
                <thead className="text-xs uppercase text-[#626060]">
                  <tr className="border-b border-[#B4B4B4]/30">
                    <th className="py-2 text-start font-semibold">Commande</th>
                    <th className="py-2 text-start font-semibold">Client</th>
                    <th className="py-2 text-start font-semibold">Ville</th>
                    <th className="py-2 text-start font-semibold">Articles</th>
                    <th className="py-2 text-start font-semibold">Statut</th>
                    <th className="py-2 text-end font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map((o) => (
                    <tr key={o._id} className="border-b border-[#B4B4B4]/20 last:border-0 hover:bg-[#F4F4F5]/60">
                      <td className="py-2.5">
                        <TextLink href={`/dashboard/commandes/${o._id}`}>{orderRef(o)}</TextLink>
                        <div className="text-xs text-[#626060]">{date(o.createdAt)}</div>
                      </td>
                      <td className="py-2.5">
                        {o.customerName}
                        <div className="flex items-center gap-2 text-xs text-[#626060]">
                          <span dir="ltr">{o.phone}</span>
                          <a
                            href={`https://wa.me/${waPhone(o.phone)}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Ouvrir WhatsApp"
                            className="text-green-600 hover:text-green-800"
                          >
                            <MessageCircle size={13} />
                          </a>
                        </div>
                      </td>
                      <td className="py-2.5">{o.city || "—"}</td>
                      <td className="py-2.5">{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
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

          {data.pages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                className={buttonOutline}
                disabled={page <= 1}
                onClick={() => go({ page: String(page - 1) })}
              >
                ← Précédent
              </button>
              <span className="text-[#626060]">
                Page {data.page} / {data.pages}
              </span>
              <button
                className={buttonOutline}
                disabled={page >= data.pages}
                onClick={() => go({ page: String(page + 1) })}
              >
                Suivant →
              </button>
            </div>
          )}
        </Card>
      )}

      <p className="text-xs text-[#626060]">
        Astuce : les commandes passées avant cette mise à jour n&apos;ont pas de numéro ML-… ; elles
        s&apos;affichent avec les 6 derniers caractères de leur identifiant.{" "}
        <Link href="/dashboard" className="underline">
          Retour au tableau de bord
        </Link>
      </p>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Orders />
    </Suspense>
  );
}
