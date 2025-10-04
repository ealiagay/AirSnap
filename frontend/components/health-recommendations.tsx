"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Heart, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface HealthRecommendationsProps {
  aqiValue: number
}

export function HealthRecommendations({ aqiValue }: HealthRecommendationsProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const getRecommendations = (aqi: number) => {
    if (aqi <= 50) {
      return [
        {
          icon: CheckCircle,
          title: "Actividades al Aire Libre",
          description: "Excelente momento para ejercicio al aire libre y actividades recreativas.",
          color: "text-secondary",
          bgColor: "bg-secondary/10",
        },
        {
          icon: Heart,
          title: "Ventilación",
          description: "Abre las ventanas para ventilar tu hogar y disfrutar del aire fresco.",
          color: "text-secondary",
          bgColor: "bg-secondary/10",
        },
        {
          icon: CheckCircle,
          title: "Sin Restricciones",
          description: "No hay restricciones para personas con condiciones respiratorias.",
          color: "text-secondary",
          bgColor: "bg-secondary/10",
        },
      ]
    } else if (aqi <= 100) {
      return [
        {
          icon: Heart,
          title: "Ejercicio Moderado",
          description: "Las actividades al aire libre son seguras para la mayoría de las personas.",
          color: "text-accent",
          bgColor: "bg-accent/10",
        },
        {
          icon: AlertTriangle,
          title: "Grupos Sensibles",
          description: "Personas con asma deben considerar reducir esfuerzos prolongados.",
          color: "text-accent",
          bgColor: "bg-accent/10",
        },
        {
          icon: CheckCircle,
          title: "Ventilación Normal",
          description: "Puedes ventilar tu hogar sin preocupaciones.",
          color: "text-accent",
          bgColor: "bg-accent/10",
        },
      ]
    } else {
      return [
        {
          icon: AlertTriangle,
          title: "Limita Actividades",
          description: "Evita ejercicio intenso al aire libre, especialmente si tienes asma.",
          color: "text-destructive",
          bgColor: "bg-destructive/10",
        },
        {
          icon: Heart,
          title: "Usa Mascarilla",
          description: "Considera usar mascarilla N95 si debes salir.",
          color: "text-destructive",
          bgColor: "bg-destructive/10",
        },
        {
          icon: AlertTriangle,
          title: "Mantén Ventanas Cerradas",
          description: "Usa purificadores de aire en interiores.",
          color: "text-destructive",
          bgColor: "bg-destructive/10",
        },
      ]
    }
  }

  const recommendations = getRecommendations(aqiValue)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % recommendations.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + recommendations.length) % recommendations.length)
  }

  const currentRec = recommendations[currentSlide]
  const Icon = currentRec.icon

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-balance">Recomendaciones de Salud</h2>
        <p className="mt-2 text-sm text-muted-foreground">Consejos personalizados según la calidad del aire actual</p>
      </div>

      {/* Slide Content */}
      <div className="min-h-[300px] flex flex-col justify-between">
        <div className={`rounded-2xl ${currentRec.bgColor} p-8 mb-6`}>
          <div className={`inline-flex rounded-full bg-background p-3 mb-4`}>
            <Icon className={`h-8 w-8 ${currentRec.color}`} />
          </div>
          <h3 className={`text-xl font-bold mb-3 ${currentRec.color}`}>{currentRec.title}</h3>
          <p className="text-foreground leading-relaxed">{currentRec.description}</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full bg-transparent">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            {recommendations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full bg-transparent">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
