import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DeliveryBanner from "@/components/DeliveryBanner";
import { LanguageProvider } from "@/context/LanguageContext";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Shree Gaurai Agro Solutions And Consultancy - Trusted Bio Fertilizers",
  description: "Organic & Bio Fertilizers Trusted by Maharashtra Farmers. Committed to Pune, Indapur, and Baramati region.",
  icons: {
    icon: [
      { url: "/favicon.jpg" },
      { url: "/logo.jpg" },
    ],
    apple: "/logo.jpg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased font-sans`}>
        <LanguageProvider>
          <DeliveryBanner />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
