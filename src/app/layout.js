import { ReduxProvider } from "@/redux/provider";
import "./globals.css";
import { Rajdhani, Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartHydrator } from "@/components/CartHydrator";
import Script from "next/script";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rajdhani",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://www.medloutauto.com"),
  title: {
    default: "Medlout Auto | Pièces Auto Neuves et d'Occasion au Maroc",
    template: "%s | Medlout Auto",
  },
  description:
    "Medlout Auto propose des pièces automobiles de qualité pour toutes marques et modèles : freins, filtres, suspension, électrique et plus. Livraison partout au Maroc.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.medloutauto.com",
    siteName: "Medlout Auto",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${rajdhani.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${inter.className} antialiased bg-[#121212] text-[#F4F4F5]`}
        suppressHydrationWarning
      >
        {/* Google Analytics — Strategy set to afterInteractive for LCP Optimization */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N492E2Z2TR"
          strategy="afterInteractive"
        />
        <Script id="medlout-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N492E2Z2TR');
          `}
        </Script>

        <ReduxProvider>
          <CartHydrator />
          {children}
        </ReduxProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}