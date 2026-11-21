import { ReduxProvider } from "@/redux/provider";
import "./globals.css";
// Fonts are bundled with the site (no download from Google at build time)
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/rajdhani/latin-500.css";
import "@fontsource/rajdhani/latin-600.css";
import "@fontsource/rajdhani/latin-700.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartHydrator } from "@/components/CartHydrator";
import { MetaPixel } from "@/components/MetaPixel";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SITE_URL } from "@/lib/site";

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
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className="antialiased bg-[#121212] text-[#F4F4F5]"
        suppressHydrationWarning
      >
        {/* Each is off until its ID is set in Vercel (NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_META_PIXEL_ID) */}
        <GoogleAnalytics />
        <MetaPixel />
        <ReduxProvider>
          <CartHydrator />
          {children}
        </ReduxProvider>
        <WhatsAppButton />
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}