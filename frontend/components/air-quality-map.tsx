"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Cargar TODO el mapa sin SSR (evita doble init del contenedor)
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

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

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface AirQualityMapProps {
  onDataReceived?: (data: AirQualityData) => void;
}

export function AirQualityMap({ onDataReceived }: AirQualityMapProps) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false); // asegura render SOLO en cliente
  const { toast } = useToast();

  const DEFAULT_CENTER: [number, number] = [19.4326, -99.1332]; // CDMX

  useEffect(() => {
    setMounted(true);
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestLocation = () => {
    setLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocalización no soportada por este navegador");
      setLocation({ lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(newLoc);
        setLoading(false);
        fetchAirQualityData(newLoc.lat, newLoc.lng);
        toast({
          title: "Ubicación obtenida",
          description: "Se ha obtenido tu ubicación actual",
        });
      },
      (err) => {
        let msg = "Error al obtener ubicación";
        if (err.code === err.PERMISSION_DENIED)
          msg = "Permisos de ubicación denegados";
        else if (err.code === err.POSITION_UNAVAILABLE)
          msg = "Ubicación no disponible";
        else if (err.code === err.TIMEOUT) msg = "Tiempo de espera agotado";

        setLocationError(msg);
        setLoading(false);
        setLocation({ lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] });
        toast({
          title: "Sin permisos de ubicación",
          description: "Puedes seleccionar un punto en el mapa manualmente",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const fetchAirQualityData = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      // MOCK — reemplaza por tu API real
      await new Promise((r) => setTimeout(r, 700));
      const rand = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min + 1)) + min;
      const aqi = rand(1, 150);
      const mock: AirQualityData = {
        aqi,
        pm25: rand(5, 55),
        pm10: rand(10, 90),
        no2: rand(5, 45),
        o3: rand(20, 110),
        so2: rand(1, 22),
        co: Math.round((Math.random() * 10 + 0.1) * 10) / 10,
        quality: getAirQualityLevel(aqi),
        recommendation: getRecommendation(aqi),
        timestamp: new Date().toLocaleString("es-ES"),
      };
      setAirQualityData(mock);
      onDataReceived?.(mock);
      toast({
        title: "Datos actualizados",
        description: "Se han obtenido los datos de calidad del aire",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron obtener los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAirQualityLevel = (aqi: number) => {
    if (aqi <= 50) return "Buena";
    if (aqi <= 100) return "Moderada";
    if (aqi <= 150) return "Dañina para grupos sensibles";
    if (aqi <= 200) return "Dañina";
    if (aqi <= 300) return "Muy dañina";
    return "Peligrosa";
  };

  const getRecommendation = (aqi: number) => {
    if (aqi <= 50) return "Ideal para actividades al aire libre";
    if (aqi <= 100) return "Actividades normales al aire libre";
    if (aqi <= 150) return "Limitar actividades intensas al aire libre";
    if (aqi <= 200) return "Evitar actividades al aire libre";
    if (aqi <= 300) return "Permanecer en interiores";
    return "Evitar cualquier actividad al aire libre";
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#00E400";
    if (aqi <= 100) return "#FFFF00";
    if (aqi <= 150) return "#FF7E00";
    if (aqi <= 200) return "#FF0000";
    if (aqi <= 300) return "#8F3F97";
    return "#7E0023";
  };

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    const newLoc = { lat, lng };
    setLocation(newLoc);
    fetchAirQualityData(lat, lng);
  };

  if (!mounted) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Cargando mapa...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Mapa de Calidad del Aire</h3>
          <p className="text-sm text-muted-foreground">
            {locationError
              ? "Selecciona un punto en el mapa para obtener datos"
              : "Tu ubicación actual o selecciona un punto en el mapa"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={requestLocation}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <MapPin className="h-4 w-4 mr-2" />
            )}
            Mi Ubicación
          </Button>

          {location && (
            <Button
              onClick={() => fetchAirQualityData(location.lat, location.lng)}
              disabled={loading}
              size="sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Consultar Datos
            </Button>
          )}
        </div>
      </div>

      {locationError && (
        <Card className="p-4 border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{locationError}</p>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="h-96 relative">
          {location && (
            <LeafletMap
              lat={location.lat}
              lng={location.lng}
              aqi={airQualityData?.aqi ?? null}
              onMapClick={handleMapClick}
              getAQIColor={getAQIColor}
              popupContent={
                <div className="text-center">
                  <p className="font-semibold">Ubicación seleccionada</p>
                  <p className="text-xs text-gray-600">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                  {airQualityData && (
                    <div className="mt-2">
                      <p
                        className="font-bold text-lg"
                        style={{ color: getAQIColor(airQualityData.aqi) }}
                      >
                        AQI: {airQualityData.aqi}
                      </p>
                      <p className="text-sm">{airQualityData.quality}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {airQualityData.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              }
            />
          )}
        </div>
      </Card>

      {location && (
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">
            <p>
              Coordenadas: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
            {airQualityData && (
              <p className="mt-1">
                Última actualización: {airQualityData.timestamp}
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
