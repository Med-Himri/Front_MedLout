"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordAPI } from "@/services/admin.service";
import { apiError } from "@/utils/axiosInstance";
import { AuthCard, authButton, authInput, authLabel } from "@/components/admin/AuthCard";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    setBusy(true);
    setError("");
    try {
      const { data } = await forgotPasswordAPI(email);
      setMessage(data.message);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Mot de passe oublié">
      {message ? (
        <p className="text-sm text-[#1A1A1A]">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-sm text-[#626060]">
            Indiquez l&apos;email de votre compte : vous recevrez un lien pour choisir un nouveau mot
            de passe.
          </p>
          <label className={authLabel}>
            Email
            <input name="email" type="email" required className={authInput} />
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button disabled={busy} className={authButton}>
            {busy ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>
      )}
      <p className="mt-5 text-center text-xs">
        <Link href="/dashboard/login" className="text-[#626060] hover:text-[#C41E3A]">
          ← Retour à la connexion
        </Link>
      </p>
    </AuthCard>
  );
}
