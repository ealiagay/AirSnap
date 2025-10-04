"use client"

import { useState, useEffect } from "react"
import { MapPin, RefreshCw, Wind, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AQIGauge } from "@/components/aqi-gauge"
import { RegistrationModal } from "@/components/registration-modal"
import { HealthRecommendations } from "@/components/health-recommendations"

export default function HomePage() {
  const [showModal, setShowModal] = useState(false)
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 })
  const [loading, setLoading] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    // Check if user has already granted permission
    const permission = localStorage.getItem("locationPermission")
    if (permission === "granted") {
      setHasPermission(true)
      getLocation()
    } else {
      setShowModal(true)
    }
  }, [])

  const getLocation = () => {
    setLoading(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setLoading(false)
        },
      )
    }
  }

  const handleRefreshLocation = () => {
    getLocation()
  }

  const handleModalComplete = (email: string, granted: boolean) => {
    setShowModal(false)
    setHasPermission(granted)
    if (granted) {
      localStorage.setItem("locationPermission", "granted")
      getLocation()
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
                <a href="/photos">Fotos</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/news">Noticias</a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - AQI Gauge and Coordinates */}
          <div className="space-y-8">
            {/* AQI Gauge Section */}
            <Card className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-balance">Medición Actual</h2>
                <p className="mt-2 text-sm text-muted-foreground">Índice de calidad del aire en tu ubicación</p>
              </div>
              <AQIGauge value={42} />
            </Card>

            {/* Coordinates Section */}
            <Card className="p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Tu Ubicación</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshLocation}
                  disabled={loading || !hasPermission}
                  className="rounded-full bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Reenviar
                </Button>
              </div>

              {hasPermission ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Coordenadas</p>
                      <p className="mt-1 font-mono text-sm text-muted-foreground">
                        {coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° W
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Estación más cercana</p>
                        <p className="mt-1 text-xs text-muted-foreground">A 2.3 km de tu ubicación</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-muted p-6 text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Permiso de ubicación no otorgado</p>
                  <Button variant="outline" size="sm" onClick={() => setShowModal(true)} className="mt-4">
                    Configurar Permisos
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Health Recommendations */}
          <div>
            <HealthRecommendations aqiValue={42} />
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-secondary/10 p-3">
                <Wind className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">PM2.5</h3>
                <p className="mt-1 text-2xl font-bold">12 µg/m³</p>
                <p className="mt-1 text-xs text-muted-foreground">Nivel bajo</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-accent/10 p-3">
                <Wind className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">PM10</h3>
                <p className="mt-1 text-2xl font-bold">28 µg/m³</p>
                <p className="mt-1 text-xs text-muted-foreground">Nivel bajo</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Wind className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">O₃</h3>
                <p className="mt-1 text-2xl font-bold">45 ppb</p>
                <p className="mt-1 text-xs text-muted-foreground">Nivel moderado</p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Registration Modal */}
      <RegistrationModal open={showModal} onClose={() => setShowModal(false)} onComplete={handleModalComplete} />
    </div>
  )
}
