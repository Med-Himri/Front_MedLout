"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { loginAPI } from "@/services/admin.service";
import { apiError } from "@/utils/axiosInstance";
import { AuthCard, authButton, authInput, authLabel } from "@/components/admin/AuthCard";

function LoginForm() {
  const router = useRouter();
  const expired = useSearchParams().get("expired");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      const { data } = await loginAPI(f.get("email"), f.get("password"));
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("username", data.username);
      router.push("/dashboard");
    } catch (err) {
      setError(apiError(err, "Email ou mot de passe incorrect"));
      setBusy(false);
    }
  };

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} className="space-y-5">
        {expired && !error && (
          <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
            Votre session a expiré, reconnectez-vous.
          </p>
        )}
        <label className={authLabel}>
          Email
          <input name="email" type="email" autoComplete="username" required className={authInput} />
        </label>
        <label className={authLabel}>
          Mot de passe
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={authInput}
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={authButton}>
          {busy && <Loader2 size={16} className="animate-spin" />}
          {busy ? "Connexion..." : "Se Connecter"}
        </button>
        <p className="text-center text-xs">
          <Link href="/dashboard/mot-de-passe-oublie" className="text-[#626060] hover:text-[#C41E3A]">
            Mot de passe oublié ?
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
