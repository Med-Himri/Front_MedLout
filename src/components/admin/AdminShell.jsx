"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getMeAPI } from "@/services/admin.service";
import { PUBLIC_ADMIN_PATHS, apiError } from "@/utils/axiosInstance";
import { Loading } from "./ui";

const AdminContext = createContext({ me: null });

/** The signed-in staff member: { id, name, email, role: "admin" | "staff" } */
export const useAdmin = () => useContext(AdminContext);

const links = [
  { href: "/dashboard", label: "Tableau de bord", exact: true },
  { href: "/dashboard/commandes", label: "Commandes" },
  { href: "/dashboard/produits", label: "Produits" },
  { href: "/dashboard/messages", label: "Messages" },
  { href: "/dashboard/equipe", label: "Équipe", adminOnly: true },
];

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("username");
  window.location.href = "/dashboard/login";
};

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC_ADMIN_PATHS.includes(pathname);
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPublic) return;
    if (!localStorage.getItem("accessToken")) {
      router.replace("/dashboard/login");
      return;
    }
    // Check the token with the server (it may be expired or the account deleted);
    // a 401 is handled by the axios interceptor (redirect to login).
    getMeAPI()
      .then((res) => setMe(res.data.user))
      .catch((err) => {
        if (err.response?.status !== 401) setError(apiError(err, "Serveur injoignable"));
      });
  }, [isPublic, router]);

  if (isPublic) return children;

  if (!me) {
    return (
      <div className="min-h-screen bg-[#F4F4F5]">
        {error ? (
          <div className="mx-auto max-w-md px-5 py-24 text-center text-sm text-red-700">
            {error}
            <br />
            <button onClick={() => window.location.reload()} className="mt-4 underline">
              Réessayer
            </button>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    );
  }

  const isActive = (link) => (link.exact ? pathname === link.href : pathname.startsWith(link.href));

  return (
    <AdminContext.Provider value={{ me }}>
      <div className="min-h-screen bg-[#F4F4F5] text-[#1A1A1A]">
        <header className="border-b-2 border-[#C41E3A] bg-[#1A1A1A]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
            <Link
              href="/dashboard"
              className="text-2xl font-bold uppercase text-white"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Medlout <span className="text-[#C41E3A]">Auto</span>{" "}
              <span className="text-sm font-medium normal-case text-[#A0A0A0]">admin</span>
            </Link>
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {links
                .filter((l) => !l.adminOnly || me.role === "admin")
                .map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={
                      isActive(l)
                        ? "font-semibold text-white underline decoration-[#C41E3A] decoration-2 underline-offset-8"
                        : "text-[#C9C9C9] hover:text-white"
                    }
                  >
                    {l.label}
                  </Link>
                ))}
              <a href="/" target="_blank" rel="noreferrer" className="text-[#C9C9C9] hover:text-white">
                Voir le site ↗
              </a>
              <Link
                href="/dashboard/compte"
                title={me.email}
                className={pathname === "/dashboard/compte" ? "text-white" : "text-[#C9C9C9] hover:text-white"}
              >
                {me.name} <span className="text-xs">({me.role === "admin" ? "admin" : "staff"})</span>
              </Link>
              <button
                onClick={logout}
                className="rounded-md border border-[#444] px-3 py-1 text-[#C9C9C9] hover:border-[#C41E3A] hover:text-white"
              >
                Déconnexion
              </button>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      </div>
    </AdminContext.Provider>
  );
}
