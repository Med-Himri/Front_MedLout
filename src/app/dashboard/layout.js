import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin | Medlout Auto",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
