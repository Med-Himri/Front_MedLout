import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Checkout } from "@/components/checkout/Checkout";

export const metadata = {
  title: "Commande | Medlout Auto",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />
      <Checkout />
      <Footer />
    </div>
  );
}
