"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";

// Shared building blocks for the admin pages (same idea as Arganisme's
// components/admin.tsx), in Medlout's red / black colours.

export const ORDER_STATUSES = ["pending", "contacted", "confirmed", "shipped", "delivered", "cancelled"];

export const STATUS_LABELS = {
  pending: "Nouvelle (à appeler)",
  contacted: "Contactée",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const statusColors = {
  pending: "bg-amber-100 text-amber-800",
  contacted: "bg-sky-100 text-sky-800",
  confirmed: "bg-[#C41E3A]/10 text-[#C41E3A]",
  shipped: "bg-violet-100 text-violet-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-[#1A1A1A]/10 text-[#626060] line-through",
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status] || "bg-gray-100"}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export const mad = (n) =>
  `${Number(n || 0).toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH`;

export const date = (iso) =>
  iso ? new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }) : "";

/** Moroccan numbers (06…, +212 6…, 00212…) → the digits wa.me expects. */
export const waPhone = (phone = "") => {
  let digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 10) digits = "212" + digits.slice(1);
  return digits;
};

/** Short display reference for an order (old orders have no orderNumber). */
export const orderRef = (order) => order.orderNumber || `#${String(order._id).slice(-6).toUpperCase()}`;

export function PageTitle({ children, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1
        className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#1A1A1A]"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        {children}
      </h1>
      {action}
    </div>
  );
}

export function Card({ title, action, children, className = "" }) {
  return (
    <section className={`min-w-0 rounded-lg border border-[#B4B4B4]/30 bg-white p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-sm font-bold uppercase tracking-wide text-[#1A1A1A]">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-[#B4B4B4]/30 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#626060]">{label}</p>
      <p
        className="mt-1 text-3xl font-bold text-[#C41E3A]"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-[#626060]">{hint}</p>}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex justify-center py-24">
      <Loader2 className="animate-spin text-[#C41E3A]" size={30} />
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <Card>
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className={`${buttonOutline} mt-3`}>
          Réessayer
        </button>
      )}
    </Card>
  );
}

export function TextLink({ href, children, ...rest }) {
  return (
    <Link href={href} className="font-medium text-[#C41E3A] underline-offset-2 hover:underline" {...rest}>
      {children}
    </Link>
  );
}

export const input =
  "w-full rounded-md border border-[#B4B4B4]/50 bg-white px-3 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/10";
export const label = "block text-sm text-[#1A1A1A]";
export const button =
  "inline-flex items-center justify-center gap-2 rounded-md bg-[#C41E3A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#8F1529] disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
export const buttonDark =
  "inline-flex items-center justify-center gap-2 rounded-md bg-[#1A1A1A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C41E3A] disabled:opacity-50 transition-colors";
export const buttonOutline =
  "inline-flex items-center justify-center gap-2 rounded-md border border-[#B4B4B4]/60 bg-white px-4 py-2 text-sm text-[#1A1A1A] hover:border-[#C41E3A] hover:text-[#C41E3A] disabled:opacity-50 transition-colors";
export const buttonDanger =
  "inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-sm text-red-700 hover:bg-red-600 hover:text-white disabled:opacity-50 transition-colors";
