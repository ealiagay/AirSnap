import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import "leaflet/dist/leaflet.css";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "AirQuality Monitor - Monitoreo de Calidad del Aire",
  description:
    "Monitorea la calidad del aire en tiempo real y cuida tu salud respiratoria",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
