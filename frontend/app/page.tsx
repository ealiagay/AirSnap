import Link from "next/link"
import { Wind, MapPin, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background px-6 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary-foreground">
                <Wind className="h-4 w-4" />
                <span>Monitoreo en Tiempo Real</span>
              </div>

              <h1 className="text-5xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
                Respira con
                <span className="text-primary"> Confianza</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-xl">
                Monitorea la calidad del aire en tiempo real y recibe recomendaciones personalizadas para cuidar tu
                salud respiratoria.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/home">
                    Comenzar Ahora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent">
                  <Link href="/news">Ver Noticias</Link>
                </Button>
              </div>
            </div>

            {/* Live AQI Preview Card */}
            <Card className="p-8 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Calidad del Aire Actual</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Actualizado hace 5 min</span>
                  </div>
                </div>

                {/* AQI Display */}
                <div className="flex items-center justify-center py-8">
                  <div className="relative">
                    <div className="flex h-40 w-40 items-center justify-center rounded-full bg-secondary/20">
                      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-secondary/40">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-secondary-foreground">42</div>
                          <div className="text-sm font-medium text-muted-foreground">AQI</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">Ciudad de México</span>
                  </div>
                  <div className="rounded-lg bg-secondary/10 p-4">
                    <p className="text-sm font-medium text-secondary-foreground">Buena Calidad del Aire</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Condiciones ideales para actividades al aire libre
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">Monitoreo en Tu Área</h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Visualiza lecturas de calidad del aire cerca de ti
            </p>
          </div>

          <Card className="overflow-hidden shadow-lg">
            <div className="aspect-video bg-muted relative">
              <img
                src="/air-quality-map-with-pollution-markers.jpg"
                alt="Mapa de calidad del aire"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap gap-3">
                  <div className="rounded-full bg-card px-4 py-2 shadow-lg">
                    <span className="text-sm font-medium">19.4326° N, 99.1332° W</span>
                  </div>
                  <div className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground shadow-lg">
                    <span className="text-sm font-medium">5 estaciones cercanas</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Wind className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Datos en Tiempo Real</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Información actualizada de NASA TEMPO y OpenAQ
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <MapPin className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Monitoreo Local</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Seguimiento preciso de tu ubicación</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Recomendaciones</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Consejos personalizados para tu salud</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h4 className="mb-4 text-lg font-semibold">AirQuality Monitor</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cuidando tu salud respiratoria con datos precisos y confiables.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold">Fuentes de Datos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>NASA TEMPO</li>
                <li>OpenAQ</li>
                <li>Estaciones Locales</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold">Contacto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>info@airquality.com</li>
                <li>Soporte 24/7</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 AirQuality Monitor. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
