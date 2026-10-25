"use client";

import { toast } from "react-toastify";
import { MessageCircle } from "lucide-react";
import { deleteMessageAPI, getMessagesAPI, updateMessageAPI } from "@/services/admin.service";
import { useAdminData } from "@/components/admin/useAdminData";
import { apiError } from "@/utils/axiosInstance";
import { Card, ErrorBox, Loading, PageTitle, date, waPhone } from "@/components/admin/ui";

export default function MessagesPage() {
  const { data, loading, error, reload, setData } = useAdminData(getMessagesAPI);

  if (loading && !data) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const toggleRead = async (m) => {
    try {
      await updateMessageAPI(m._id, { read: !m.read });
      setData(data.map((x) => (x._id === m._id ? { ...x, read: !m.read } : x)));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const remove = async (m) => {
    if (!confirm(`Supprimer le message de ${m.name} ?`)) return;
    try {
      await deleteMessageAPI(m._id);
      setData(data.filter((x) => x._id !== m._id));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const unread = data.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <PageTitle>Messages</PageTitle>
      <p className="text-sm text-[#626060]">
        Messages du formulaire de contact (ils sont aussi envoyés sur WhatsApp).
        {unread > 0 && <strong className="text-[#C41E3A]"> {unread} non lu{unread > 1 ? "s" : ""}.</strong>}
      </p>
      {data.length === 0 && <p className="text-sm text-[#626060]">Aucun message pour le moment.</p>}
      {data.map((m) => (
        <Card key={m._id} className={m.read ? "" : "border-l-4 border-l-[#C41E3A]"}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-semibold">
              {m.name}
              {m.cityAddress && <span className="font-normal text-[#626060]"> · {m.cityAddress}</span>}
            </p>
            <p className="text-xs text-[#626060]">{date(m.createdAt)}</p>
          </div>
          {m.phone && (
            <p className="mt-1 flex items-center gap-3 text-sm">
              <span dir="ltr">{m.phone}</span>
              <a
                href={`https://wa.me/${waPhone(m.phone)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-green-700 hover:underline"
              >
                <MessageCircle size={14} /> Répondre sur WhatsApp
              </a>
            </p>
          )}
          <p className="mt-3 whitespace-pre-line text-sm">{m.message}</p>
          <div className="mt-4 flex gap-4 text-xs">
            <button onClick={() => toggleRead(m)} className="text-[#C41E3A] hover:underline">
              {m.read ? "Marquer comme non lu" : "Marquer comme lu"}
            </button>
            <button onClick={() => remove(m)} className="text-[#626060] hover:text-red-700">
              Supprimer
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
