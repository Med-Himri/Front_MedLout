import { ReduxProvider } from "@/redux/provider";
import "./globals.css";
import { Rajdhani, Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartHydrator } from "@/components/CartHydrator";
import { MetaPixel } from "@/components/MetaPixel";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SITE_URL } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Medlout Auto | Accessoires de Qualité au Maroc",
    template: "%s | Medlout Auto",
  },
  description:
    "Medlout Auto propose des accessoires auto de qualité. Livraison gratuite partout au Maroc.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
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
        {/* Each is off until its ID is set in Vercel (NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_META_PIXEL_ID) */}
        <GoogleAnalytics />
        <MetaPixel />
        <ReduxProvider>
          <CartHydrator />
          {children}
        </ReduxProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}