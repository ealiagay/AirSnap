"use client"

import { Card } from "@/components/ui/card"

interface AQIGaugeProps {
  value: number
}

export function AQIGauge({ value }: AQIGaugeProps) {
  // Determine AQI category and color
  const getAQIInfo = (aqi: number) => {
    if (aqi <= 50) {
      return {
        category: "Buena",
        description: "La calidad del aire es satisfactoria",
        color: "text-secondary",
        bgColor: "bg-secondary/20",
        ringColor: "stroke-secondary",
      }
    } else if (aqi <= 100) {
      return {
        category: "Moderada",
        description: "Aceptable para la mayoría",
        color: "text-accent",
        bgColor: "bg-accent/20",
        ringColor: "stroke-accent",
      }
    } else if (aqi <= 150) {
      return {
        category: "Dañina para grupos sensibles",
        description: "Precaución para grupos sensibles",
        color: "text-chart-4",
        bgColor: "bg-chart-4/20",
        ringColor: "stroke-chart-4",
      }
    } else if (aqi <= 200) {
      return {
        category: "Dañina",
        description: "Todos pueden experimentar efectos",
        color: "text-destructive",
        bgColor: "bg-destructive/20",
        ringColor: "stroke-destructive",
      }
    } else {
      return {
        category: "Muy Dañina",
        description: "Alerta de salud",
        color: "text-destructive",
        bgColor: "bg-destructive/30",
        ringColor: "stroke-destructive",
      }
    }
  }

  const aqiInfo = getAQIInfo(value)
  const percentage = Math.min((value / 300) * 100, 100)
  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="space-y-6">
      {/* Gauge Visualization */}
      <div className="flex items-center justify-center py-8">
        <div className="relative h-64 w-64">
          {/* Background Circle */}
          <svg className="h-full w-full -rotate-90 transform">
            <circle
              cx="128"
              cy="128"
              r="90"
              stroke="currentColor"
              strokeWidth="16"
              fill="none"
              className="text-muted"
            />
            {/* Progress Circle */}
            <circle
              cx="128"
              cy="128"
              r="90"
              stroke="currentColor"
              strokeWidth="16"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`${aqiInfo.ringColor} transition-all duration-1000 ease-out`}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-6xl font-bold ${aqiInfo.color}`}>{value}</div>
              <div className="mt-2 text-sm font-medium text-muted-foreground">AQI</div>
            </div>
          </div>
        </div>
      </div>

      {/* AQI Info Card */}
      <Card className={`p-6 ${aqiInfo.bgColor}`}>
        <h3 className={`text-lg font-bold ${aqiInfo.color}`}>{aqiInfo.category}</h3>
        <p className="mt-2 text-sm text-foreground leading-relaxed">{aqiInfo.description}</p>
      </Card>
    </div>
  )
}
