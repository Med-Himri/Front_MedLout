"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPasswordAPI } from "@/services/admin.service";
import { apiError } from "@/utils/axiosInstance";
import { AuthCard, authButton, authInput, authLabel } from "@/components/admin/AuthCard";

function ResetForm() {
  const params = useSearchParams();
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("password") !== f.get("confirm")) {
      setError("Les deux mots de passe sont différents.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { data } = await resetPasswordAPI(params.get("uid"), f.get("code"), f.get("password"));
      setDone(data.message);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <AuthCard title="Mot de passe modifié">
        <p className="text-sm">{done}</p>
        <Link href="/dashboard/login" className={`${authButton} mt-6`}>
          Se connecter
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Nouveau mot de passe">
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className={authLabel}>
          Code reçu par email
          <input
            name="code"
            defaultValue={params.get("code") || ""}
            inputMode="numeric"
            required
            className={authInput}
          />
        </label>
        <label className={authLabel}>
          Nouveau mot de passe (8 caractères min.)
          <input name="password" type="password" minLength={8} required autoComplete="new-password" className={authInput} />
        </label>
        <label className={authLabel}>
          Répétez le mot de passe
          <input name="confirm" type="password" required autoComplete="new-password" className={authInput} />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button disabled={busy} className={authButton}>
          {busy ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
