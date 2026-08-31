"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2, Lock, Mail } from "lucide-react";
import { userLoginAPI } from "@/services/user.service";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Veuillez indiquer votre email et mot de passe");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await userLoginAPI(email, password);
      // Backend returns { message, token, username } — not accessToken/user
      const { token, username } = response.data;

      if (!token) {
        throw new Error("Aucun token reçu du serveur");
      }

      localStorage.setItem("accessToken", token);
      if (username) {
        localStorage.setItem("username", username);
      }

      toast.success("Connexion réussie !");
      router.push("/dashboard");
    } catch (err) {
      console.error("Erreur de connexion:", err);
      const message = err.response?.data?.message || "Email ou mot de passe incorrect";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C41E3A]">
            Espace Staff
          </span>
          <h1
            className="text-2xl font-bold uppercase text-white mt-1"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Medlout <span className="text-[#C41E3A]">Auto</span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-8 border-t-4 border-[#C41E3A] shadow-2xl space-y-5"
        >
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide text-[#626060] mb-1.5 flex items-center gap-1.5">
              <Mail size={12} className="text-[#C41E3A]" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#B4B4B4]/40 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#C41E3A]"
              placeholder="staff@medloutauto.com"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide text-[#626060] mb-1.5 flex items-center gap-1.5">
              <Lock size={12} className="text-[#C41E3A]" /> Mot de Passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#B4B4B4]/40 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#C41E3A]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#C41E3A] transition-all disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Connexion..." : "Se Connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
