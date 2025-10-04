"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Upload, ImageIcon, MapPin, Clock, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function PhotosPage() {
  const [uploadedPhotos, setUploadedPhotos] = useState<
    Array<{ id: string; url: string; timestamp: string; location: string }>
  >([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newPhoto = {
            id: Date.now().toString() + Math.random(),
            url: e.target?.result as string,
            timestamp: new Date().toLocaleString("es-MX"),
            location: "Ciudad de México",
          }
          setUploadedPhotos((prev) => [newPhoto, ...prev])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
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
                <a href="/news">Noticias</a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-balance">Documentación Visual</h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty max-w-2xl">
            Captura y documenta la calidad del aire en tu área. Tus fotos ayudan a crear conciencia sobre la
            contaminación ambiental.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Upload Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Card */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Tomar Fotos desde la App</h2>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative rounded-2xl border-2 border-dashed transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/30"
                } p-12`}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-primary/10 p-6 mb-6">
                    <Camera className="h-12 w-12 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">Sube una Foto</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    Arrastra y suelta una imagen aquí, o haz clic para seleccionar desde tu dispositivo
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="rounded-full">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Seleccionar Archivo
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files)}
                        />
                      </label>
                    </Button>

                    <Button variant="outline" asChild className="rounded-full bg-transparent">
                      <label htmlFor="camera-upload" className="cursor-pointer">
                        <Camera className="mr-2 h-4 w-4" />
                        Usar Cámara
                        <input
                          id="camera-upload"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files)}
                        />
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Uploaded Photos Gallery */}
            {uploadedPhotos.length > 0 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Tus Fotos ({uploadedPhotos.length})</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {uploadedPhotos.map((photo) => (
                    <div key={photo.id} className="group relative overflow-hidden rounded-xl bg-muted">
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt="Air quality photo"
                        className="aspect-square w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{photo.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{photo.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {uploadedPhotos.length === 0 && (
              <Card className="p-12 text-center">
                <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay fotos aún</h3>
                <p className="text-sm text-muted-foreground">Sube tu primera foto para comenzar a documentar</p>
              </Card>
            )}
          </div>

          {/* Right Column - Recommendations */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Recomendación de Fotos</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Las mejores fotos se toman durante las horas pico de tráfico (7-9 AM y 5-7 PM) cuando la
                    contaminación es más visible.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Consejos para Mejores Fotos</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Captura el horizonte para mostrar la visibilidad del aire</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Incluye puntos de referencia conocidos en tu ciudad</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Toma fotos desde el mismo lugar para comparar cambios</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Evita usar filtros que alteren los colores reales</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-secondary/10">
              <h3 className="font-bold mb-2 text-secondary-foreground">Mejor Momento</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Hoy es un buen día para tomar fotos. La calidad del aire está en nivel moderado, lo que permite capturar
                la diferencia visual.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-secondary-foreground">
                <Clock className="h-4 w-4" />
                <span>Próxima hora recomendada: 6:00 PM</span>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
