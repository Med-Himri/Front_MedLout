"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  createStaffAPI,
  deleteStaffAPI,
  getStaffAPI,
  setStaffPasswordAPI,
  updateStaffRoleAPI,
} from "@/services/admin.service";
import { useAdmin } from "@/components/admin/AdminShell";
import { useAdminData } from "@/components/admin/useAdminData";
import { apiError } from "@/utils/axiosInstance";
import { Card, ErrorBox, Loading, PageTitle, button, date, input, label } from "@/components/admin/ui";

const ROLE_HELP = {
  admin: "Tout, y compris gérer l'équipe et supprimer des commandes",
  staff: "Commandes, produits et messages",
};

export default function StaffPage() {
  const { me } = useAdmin();
  const router = useRouter();
  const isAdmin = me.role === "admin";

  useEffect(() => {
    if (!isAdmin) router.replace("/dashboard");
  }, [isAdmin, router]);

  const { data, loading, error, reload } = useAdminData(
    () => (isAdmin ? getStaffAPI() : Promise.resolve({ data: [] })),
    [isAdmin]
  );
  const [busy, setBusy] = useState(false);

  if (!isAdmin) return null;
  if (loading && !data) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const add = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const f = new FormData(formEl);
    setBusy(true);
    try {
      await createStaffAPI(Object.fromEntries(f));
      toast.success("Compte créé. Donnez l'email et le mot de passe à la personne.");
      formEl.reset();
      reload();
    } catch (err) {
      toast.error(apiError(err, "Impossible de créer le compte"));
    } finally {
      setBusy(false);
    }
  };

  const changeRole = async (member, role) => {
    try {
      await updateStaffRoleAPI(member.id, role);
      toast.success("Rôle modifié");
      reload();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  // No email needed: the admin chooses the new password and gives it to the person.
  const resetPassword = async (member) => {
    const password = prompt(`Nouveau mot de passe pour ${member.name} (8 caractères min.) :`);
    if (password === null) return;
    try {
      const { data } = await setStaffPasswordAPI(member.id, password);
      toast.success(data.message);
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const remove = async (member) => {
    if (!confirm(`Supprimer le compte de ${member.name} ? Cette personne ne pourra plus se connecter.`)) return;
    try {
      await deleteStaffAPI(member.id);
      toast.success("Compte supprimé");
      reload();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <PageTitle>Équipe</PageTitle>
      <p className="text-sm text-[#626060]">
        Les personnes qui peuvent se connecter à cet admin. Le compte défini par ADMIN_EMAIL sur le
        serveur est toujours admin. Si quelqu&apos;un oublie son mot de passe, cliquez sur
        « Nouveau mot de passe » et donnez-le-lui.
      </p>

      <Card title="Comptes">
        <div className="divide-y divide-[#B4B4B4]/20">
          {data.map((m) => {
            const isMe = m.id === me.id;
            return (
              <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">
                    {m.name} {isMe && <span className="text-xs text-[#626060]">(vous)</span>}
                  </p>
                  <p className="text-xs text-[#626060]">
                    {m.email} · depuis le {date(m.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={m.role}
                    disabled={isMe}
                    onChange={(e) => changeRole(m, e.target.value)}
                    className={`${input} w-auto`}
                    aria-label={`Rôle de ${m.name}`}
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                  {!isMe && (
                    <>
                      <button onClick={() => resetPassword(m)} className="text-sm text-[#C41E3A] hover:underline">
                        Nouveau mot de passe
                      </button>
                      <button onClick={() => remove(m)} className="text-sm text-red-700 hover:underline">
                        Supprimer
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Ajouter un membre">
        <form onSubmit={add} className="grid gap-4 sm:grid-cols-2">
          <label className={label}>
            Nom
            <input name="name" required minLength={2} className={`${input} mt-1`} />
          </label>
          <label className={label}>
            Email
            <input name="email" type="email" required className={`${input} mt-1`} />
          </label>
          <label className={label}>
            Mot de passe (8 caractères min.)
            <input name="password" type="text" required minLength={8} autoComplete="new-password" className={`${input} mt-1`} />
          </label>
          <label className={label}>
            Rôle
            <select name="role" defaultValue="staff" className={`${input} mt-1`}>
              <option value="staff">Staff — {ROLE_HELP.staff}</option>
              <option value="admin">Admin — {ROLE_HELP.admin}</option>
            </select>
          </label>
          <div className="sm:col-span-2">
            <button disabled={busy} className={button}>
              {busy ? "Création…" : "Ajouter"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
