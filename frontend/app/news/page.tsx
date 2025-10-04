"use client"

import { useState } from "react"
import { ExternalLink, Filter, Globe, MapPin, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type NewsFilter = "all" | "local" | "regional" | "global"

interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  category: NewsFilter
  source: string
  date: string
  image?: string
}

export default function NewsPage() {
  const [activeFilter, setActiveFilter] = useState<NewsFilter>("all")

  const newsArticles: NewsArticle[] = [
    {
      id: "1",
      title: "Ciudad de México Implementa Nuevas Medidas para Reducir Contaminación",
      description:
        "El gobierno local anuncia restricciones vehiculares más estrictas y expansión del transporte público para mejorar la calidad del aire en la capital.",
      url: "#",
      category: "local",
      source: "El Universal",
      date: "Hace 2 horas",
      image: "/city-pollution.jpg",
    },
    {
      id: "2",
      title: "Estudio Revela Impacto de la Contaminación en la Salud Respiratoria",
      description:
        "Nueva investigación muestra correlación directa entre niveles de PM2.5 y aumento en casos de asma en zonas urbanas de América Latina.",
      url: "#",
      category: "regional",
      source: "Nature Medicine",
      date: "Hace 5 horas",
      image: "/medical-research.png",
    },
    {
      id: "3",
      title: "NASA TEMPO Detecta Mejoras en Calidad del Aire Durante Fin de Semana",
      description:
        "Datos satelitales muestran reducción significativa de NO₂ en áreas metropolitanas durante días de menor actividad vehicular.",
      url: "#",
      category: "global",
      source: "NASA",
      date: "Hace 1 día",
      image: "/satellite-earth.jpg",
    },
    {
      id: "4",
      title: "Vecinos de Polanco Reportan Mejora en Calidad del Aire",
      description:
        "Residentes locales notan cambios positivos tras implementación de zona de bajas emisiones en el área.",
      url: "#",
      category: "local",
      source: "Reforma",
      date: "Hace 1 día",
      image: "/neighborhood-park.jpg",
    },
    {
      id: "5",
      title: "OMS Actualiza Guías sobre Límites de Contaminación del Aire",
      description:
        "La Organización Mundial de la Salud establece nuevos estándares más estrictos para proteger la salud pública global.",
      url: "#",
      category: "global",
      source: "WHO",
      date: "Hace 2 días",
      image: "/world-health.jpg",
    },
    {
      id: "6",
      title: "Monterrey Invierte en Red de Sensores de Calidad del Aire",
      description:
        "La ciudad implementa 50 nuevas estaciones de monitoreo para proporcionar datos en tiempo real a sus ciudadanos.",
      url: "#",
      category: "regional",
      source: "El Norte",
      date: "Hace 3 días",
      image: "/air-quality-sensor.jpg",
    },
  ]

  const filteredNews =
    activeFilter === "all" ? newsArticles : newsArticles.filter((article) => article.category === activeFilter)

  const getFilterIcon = (filter: NewsFilter) => {
    switch (filter) {
      case "local":
        return MapPin
      case "regional":
        return Building2
      case "global":
        return Globe
      default:
        return Filter
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">AirQuality Monitor</h1>
            <nav className="flex gap-4">
              <Button variant="ghost" asChild>
                <a href="/">Inicio</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/home">Monitor</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/photos">Fotos</a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-balance">Noticias Ambientales</h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty max-w-2xl">
            Mantente informado sobre las últimas noticias y desarrollos en calidad del aire y medio ambiente.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {(["all", "local", "regional", "global"] as NewsFilter[]).map((filter) => {
            const Icon = getFilterIcon(filter)
            const labels = {
              all: "Todas",
              local: "Local",
              regional: "Regional",
              global: "Global",
            }

            return (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className="rounded-full bg-transparent"
              >
                <Icon className="mr-2 h-4 w-4" />
                {labels[filter]}
              </Button>
            )
          })}
        </div>

        {/* News Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((article) => (
            <Card key={article.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              {/* Article Image */}
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>

              {/* Article Content */}
              <div className="p-6 space-y-4">
                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      article.category === "local"
                        ? "bg-primary/10 text-primary"
                        : article.category === "regional"
                          ? "bg-secondary/10 text-secondary"
                          : "bg-accent/10 text-accent"
                    }`}
                  >
                    {article.category === "local" && <MapPin className="h-3 w-3" />}
                    {article.category === "regional" && <Building2 className="h-3 w-3" />}
                    {article.category === "global" && <Globe className="h-3 w-3" />}
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold leading-tight text-balance line-clamp-2">{article.title}</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{article.description}</p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-medium text-muted-foreground">{article.source}</span>
                  <Button variant="ghost" size="sm" asChild className="rounded-full bg-transparent">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      Leer más
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredNews.length === 0 && (
          <Card className="p-12 text-center">
            <Filter className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay noticias en esta categoría</h3>
            <p className="text-sm text-muted-foreground">Intenta con otro filtro para ver más contenido</p>
          </Card>
        )}
      </main>
    </div>
  )
}
