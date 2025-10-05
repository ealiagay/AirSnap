"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

// Controla el recentrado sin remontear el contenedor
function MapController({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

// Listener de click
function MapClick({ onClick }: { onClick: (e: any) => void }) {
  useMapEvents({
    click: (e) => onClick(e),
  });
  return null;
}

export interface LeafletMapProps {
  lat: number;
  lng: number;
  aqi?: number | null;
  onMapClick: (e: any) => void;
  getAQIColor: (aqi: number) => string;
  popupContent?: React.ReactNode;
}

export default function LeafletMap({
  lat,
  lng,
  aqi = null,
  onMapClick,
  getAQIColor,
  popupContent,
}: LeafletMapProps) {
  // icono memoizado (solo cliente)
  const customIcon = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const L = require("leaflet");
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${
        typeof aqi === "number" ? getAQIColor(aqi) : "#3B82F6"
      }; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  }, [aqi, getAQIColor]);

  return (
    <MapContainer
      key="aq-map" // clave constante -> un solo mapa
      center={[lat, lng]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <MapClick onClick={onMapClick} />
      <MapController lat={lat} lng={lng} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[lat, lng]} icon={customIcon as any}>
        <Popup>{popupContent}</Popup>
      </Marker>
    </MapContainer>
  );
}
