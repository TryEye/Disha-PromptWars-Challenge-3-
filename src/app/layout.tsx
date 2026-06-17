import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NavBar } from "@/components/layout/NavBar";
import { PageWrapper } from "@/components/layout/PageWrapper";

const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Disha | AI Carbon Footprint Dashboard",
  description: "Disha is an AI-powered carbon footprint tracking dashboard for daily climate action.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-full bg-background text-text-primary antialiased">
        <NavBar />
        <PageWrapper>{children}</PageWrapper>
      </body>
    </html>
  );
}
