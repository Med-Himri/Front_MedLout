"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // The login page itself must never be guarded, or nobody could ever log in
    if (pathname === "/dashboard/login") {
      setChecked(true);
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/dashboard/login");
      return;
    }

    setChecked(true);
  }, [pathname, router]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#C41E3A]" size={32} />
      </div>
    );
  }

  return children;
}
