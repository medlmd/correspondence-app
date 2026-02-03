import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { DocumentsProvider } from "@/context/DocumentsContext";
import { LanguageProvider } from "@/context/LanguageContext";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "نظام إدارة المراسلات",
  description: "نظام شامل لإدارة المراسلات الواردة والصادرة والداخلية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${tajawal.variable} font-sans antialiased`}
      >
        <LanguageProvider>
          <DocumentsProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </DocumentsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
