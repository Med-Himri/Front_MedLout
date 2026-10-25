"use client";

import { useState } from "react";
import { changeMyPasswordAPI } from "@/services/admin.service";
import { useAdmin } from "@/components/admin/AdminShell";
import { apiError } from "@/utils/axiosInstance";
import { Card, PageTitle, button, input, label } from "@/components/admin/ui";

export default function AccountPage() {
  const { me } = useAdmin();
  const [msg, setMsg] = useState({ text: "", ok: false });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const f = new FormData(formEl);
    if (f.get("next") !== f.get("confirm")) {
      setMsg({ text: "Les deux nouveaux mots de passe sont différents.", ok: false });
      return;
    }
    setBusy(true);
    try {
      const { data } = await changeMyPasswordAPI(f.get("current"), f.get("next"));
      setMsg({ text: data.message, ok: true });
      formEl.reset();
    } catch (err) {
      setMsg({ text: apiError(err, "Impossible de changer le mot de passe"), ok: false });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <PageTitle>Mon compte</PageTitle>
      <Card>
        <p className="text-sm">
          <strong>{me.name}</strong> · {me.email} · {me.role === "admin" ? "Admin" : "Staff"}
        </p>
      </Card>
      <Card title="Changer mon mot de passe">
        <form onSubmit={submit} className="space-y-3">
          <label className={label}>
            Mot de passe actuel
            <input name="current" type="password" autoComplete="current-password" required className={`${input} mt-1`} />
          </label>
          <label className={label}>
            Nouveau mot de passe (8 caractères min.)
            <input name="next" type="password" autoComplete="new-password" minLength={8} required className={`${input} mt-1`} />
          </label>
          <label className={label}>
            Répétez le nouveau mot de passe
            <input name="confirm" type="password" autoComplete="new-password" required className={`${input} mt-1`} />
          </label>
          <button disabled={busy} className={button}>
            {busy ? "Enregistrement…" : "Changer le mot de passe"}
          </button>
          {msg.text && <p className={`text-sm ${msg.ok ? "text-green-700" : "text-red-700"}`}>{msg.text}</p>}
        </form>
      </Card>
    </div>
  );
}
