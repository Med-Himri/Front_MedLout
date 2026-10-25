import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Suspense } from "react";
import { Checkout } from "@/components/checkout/Checkout";

export const metadata = {
  title: "Commande",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />
      {/* Suspense: Checkout reads ?produit=... for "Commander maintenant" */}
      <Suspense>
        <Checkout />
      </Suspense>
      <Footer />
    </div>
  );
}
