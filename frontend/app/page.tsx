"use client";

import { useState } from "react";
import Link from "next/link";
import { Wind, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AirQualityMap } from "@/components/air-quality-map";
import { AirQualityDashboard } from "@/components/air-quality-dashboard";

interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  co: number;
  quality: string;
  recommendation: string;
  timestamp: string;
}

export default function HomePage() {
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleDataReceived = (data: AirQualityData) => {
    setAirQualityData(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Wind className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">AirSnap</h1>
            </div>
            <nav className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="/">Inicio</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="/photos">Fotos</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="/news">Noticias</a>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
            <Wind className="h-4 w-4" /> <span>Monitoreo en Tiempo Real</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 md:text-5xl">
            Calidad del Aire en
            <span className="text-primary"> Tu Ubicación</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Obtén datos precisos de calidad del aire basados en tu ubicación
            actual o selecciona cualquier punto en el mapa para consultar
            información detallada.
          </p>
          <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  ¿Cómo funciona?
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Al entrar, te pediremos acceso a tu ubicación para mostrarte
                  datos locales. Si prefieres no compartir tu ubicación, puedes
                  hacer clic en cualquier punto del mapa.
                </p>
              </div>
            </div>
          </Card>
        </div>
        {/* Map and Dashboard Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Map Section */}
          <div className="space-y-4">
            <AirQualityMap onDataReceived={handleDataReceived} />
          </div>
          {/* Dashboard Section */}
          <div className="space-y-4">
            <AirQualityDashboard data={airQualityData} loading={loading} />
          </div>
        </div>
        {/* Additional Actions */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/photos">
                Ver Fotos de Calidad del Aire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <Link href="/news"> Leer Noticias Ambientales </Link>
            </Button>
          </div>
        </div>
        {/* Quick Info Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Wind className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Datos Precisos</h3>
            <p className="text-sm text-muted-foreground">
              Información de múltiples fuentes incluyendo NASA TEMPO y OpenAQ
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <ArrowRight className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Fácil de Usar</h3>
            <p className="text-sm text-muted-foreground">
              Interfaz intuitiva con datos visuales claros y recomendaciones
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Info className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Recomendaciones</h3>
            <p className="text-sm text-muted-foreground">
              Consejos personalizados para proteger tu salud respiratoria
            </p>
          </Card>
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wind className="h-5 w-5 text-primary" />
                <h4 className="text-lg font-semibold">AirSnap</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Monitoreo de calidad del aire en tiempo real para cuidar tu
                salud respiratoria.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Fuentes de Datos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>NASA TEMPO</li> <li>OpenAQ</li> <li>Estaciones Locales</li>
                <li>Sensores Comunitarios</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Enlaces</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/photos"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Galería de Fotos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/news"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Noticias Ambientales
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 AirSnap. Cuidando tu salud respiratoria.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
