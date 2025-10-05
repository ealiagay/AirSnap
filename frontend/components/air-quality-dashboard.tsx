'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wind, Clock, Thermometer, Eye, Droplets, Zap } from 'lucide-react';

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

interface AirQualityDashboardProps {
  data: AirQualityData | null;
  loading?: boolean;
}

export function AirQualityDashboard({ data, loading }: AirQualityDashboardProps) {
  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-500';
    if (aqi <= 300) return 'bg-purple-500';
    return 'bg-red-800';
  };

  const getAQITextColor = (aqi: number): string => {
    if (aqi <= 50) return 'text-green-600 dark:text-green-400';
    if (aqi <= 100) return 'text-yellow-600 dark:text-yellow-400';
    if (aqi <= 150) return 'text-orange-600 dark:text-orange-400';
    if (aqi <= 200) return 'text-red-600 dark:text-red-400';
    if (aqi <= 300) return 'text-purple-600 dark:text-purple-400';
    return 'text-red-800 dark:text-red-300';
  };

  const pollutants = [
    {
      name: 'PM2.5',
      value: data?.pm25 || 0,
      unit: 'µg/m³',
      icon: Droplets,
      description: 'Partículas finas',
      max: 50
    },
    {
      name: 'PM10',
      value: data?.pm10 || 0,
      unit: 'µg/m³',
      icon: Eye,
      description: 'Partículas gruesas',
      max: 100
    },
    {
      name: 'NO₂',
      value: data?.no2 || 0,
      unit: 'µg/m³',
      icon: Wind,
      description: 'Dióxido de nitrógeno',
      max: 40
    },
    {
      name: 'O₃',
      value: data?.o3 || 0,
      unit: 'µg/m³',
      icon: Zap,
      description: 'Ozono',
      max: 120
    },
    {
      name: 'SO₂',
      value: data?.so2 || 0,
      unit: 'µg/m³',
      icon: Thermometer,
      description: 'Dióxido de azufre',
      max: 20
    },
    {
      name: 'CO',
      value: data?.co || 0,
      unit: 'mg/m³',
      icon: Wind,
      description: 'Monóxido de carbono',
      max: 10
    }
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="p-8 text-center">
        <Wind className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Sin datos disponibles</h3>
        <p className="text-muted-foreground">
          Selecciona una ubicación en el mapa para obtener datos de calidad del aire
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main AQI Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Índice de Calidad del Aire</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{data.timestamp}</span>
          </div>
        </div>

        <div className="flex items-center justify-center py-8">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getAQITextColor(data.aqi)}`}>
                  {data.aqi}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  AQI
                </div>
              </div>
            </div>
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-2 rounded-full ${getAQIColor(data.aqi)}`}></div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-center">
            <Badge variant="secondary" className="text-sm">
              {data.quality}
            </Badge>
          </div>
          
          <Card className="p-4 bg-muted/50">
            <p className="text-sm font-medium text-center">
              {data.recommendation}
            </p>
          </Card>
        </div>
      </Card>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pollutants.map((pollutant) => {
          const Icon = pollutant.icon;
          const percentage = Math.min((pollutant.value / pollutant.max) * 100, 100);
          
          return (
            <Card key={pollutant.name} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{pollutant.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {pollutant.description}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">
                    {pollutant.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {pollutant.unit}
                  </span>
                </div>
                
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>{pollutant.max} {pollutant.unit}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Health Recommendations */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Recomendaciones de Salud</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h5 className="font-medium text-green-600 dark:text-green-400">
              ✓ Recomendado
            </h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              {data.aqi <= 50 ? (
                <>
                  <li>• Actividades al aire libre sin restricciones</li>
                  <li>• Ejercicio intenso permitido</li>
                  <li>• Ventanas abiertas recomendadas</li>
                </>
              ) : data.aqi <= 100 ? (
                <>
                  <li>• Actividades normales al aire libre</li>
                  <li>• Ejercicio moderado</li>
                  <li>• Ventilación normal</li>
                </>
              ) : (
                <>
                  <li>• Permanece en interiores cuando sea posible</li>
                  <li>• Usa purificadores de aire</li>
                  <li>• Mantén ventanas cerradas</li>
                </>
              )}
            </ul>
          </div>
          
          <div className="space-y-2">
            <h5 className="font-medium text-red-600 dark:text-red-400">
              ⚠ Evitar
            </h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              {data.aqi <= 50 ? (
                <>
                  <li>• Ninguna restricción especial</li>
                </>
              ) : data.aqi <= 100 ? (
                <>
                  <li>• Ejercicio muy intenso y prolongado</li>
                </>
              ) : (
                <>
                  <li>• Actividades intensas al aire libre</li>
                  <li>• Ejercicio prolongado</li>
                  <li>• Exposición innecesaria al exterior</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}