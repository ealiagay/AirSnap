# AirSnap - Monitor de Calidad del Aire

Una aplicación web moderna para monitorear la calidad del aire en tiempo real utilizando mapas interactivos y datos precisos.

## Características

- 🗺️ **Mapa Interactivo**: Utiliza Leaflet para mostrar ubicaciones y datos de calidad del aire
- 📍 **Geolocalización**: Solicita automáticamente la ubicación del usuario
- 🎯 **Selección Manual**: Permite seleccionar cualquier punto en el mapa
- 📊 **Dashboard Detallado**: Muestra métricas completas de calidad del aire (AQI, PM2.5, PM10, NO₂, O₃, SO₂, CO)
- 💡 **Recomendaciones**: Consejos de salud basados en los niveles de contaminación
- 🌙 **Modo Oscuro**: Soporte completo para tema claro y oscuro
- 📱 **Responsive**: Optimizado para dispositivos móviles y desktop

## Instalación

1. **Instalar dependencias**:
   ```bash
   npm install
   # o
   pnpm install
   ```

2. **Instalar dependencias de Leaflet** (si no se instalaron automáticamente):
   ```bash
   npm install leaflet react-leaflet @types/leaflet
   # o
   pnpm add leaflet react-leaflet @types/leaflet
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

4. **Abrir en el navegador**: http://localhost:3000

## Uso

### Funcionalidades Principales

1. **Al cargar la página**: 
   - Se solicita automáticamente acceso a la ubicación del usuario
   - Si se conceden permisos, se muestra la ubicación actual en el mapa
   - Se consultan automáticamente los datos de calidad del aire

2. **Si no se conceden permisos**:
   - Se muestra una ubicación por defecto (Ciudad de México)
   - El usuario puede hacer clic en cualquier punto del mapa para seleccionar una nueva ubicación

3. **Consultar datos**:
   - Botón "Mi Ubicación" para solicitar permisos nuevamente
   - Botón "Consultar Datos" para obtener información del punto seleccionado
   - Los datos se actualizan automáticamente al seleccionar nuevos puntos

### Datos Mostrados

- **AQI (Índice de Calidad del Aire)**: Valor principal con código de colores
- **Contaminantes**: PM2.5, PM10, NO₂, O₃, SO₂, CO con valores y barras de progreso
- **Recomendaciones**: Consejos específicos basados en los niveles actuales
- **Timestamp**: Hora de la última actualización

## Estructura del Proyecto

```
├── app/
│   ├── page.tsx                 # Página principal con mapa y dashboard
│   ├── layout.tsx               # Layout principal con Toaster
│   └── globals.css              # Estilos globales + Leaflet CSS
├── components/
│   ├── air-quality-map.tsx      # Componente del mapa interactivo
│   ├── air-quality-dashboard.tsx # Dashboard de datos de calidad del aire
│   └── ui/                      # Componentes UI base
└── lib/
    └── utils.ts                 # Utilidades
```

## Tecnologías Utilizadas

- **Next.js 15** - Framework React
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Leaflet** - Mapas interactivos
- **React Leaflet** - Integración React + Leaflet
- **Radix UI** - Componentes primitivos
- **Lucide React** - Iconos

## Configuración del Backend

Actualmente la aplicación utiliza datos simulados. Para conectar con un backend real:

1. Buscar comentarios `TODO(stagewise):` en el código
2. Reemplazar las llamadas mock con llamadas reales a la API
3. La función `fetchAirQualityData` en `components/air-quality-map.tsx` es donde se debe implementar la llamada real

### Formato de Datos Esperado

```typescript
interface AirQualityData {
  aqi: number;          // Índice de calidad del aire (1-500)
  pm25: number;         // PM2.5 en µg/m³
  pm10: number;         // PM10 en µg/m³
  no2: number;          // NO₂ en µg/m³
  o3: number;           // O₃ en µg/m³
  so2: number;          // SO₂ en µg/m³
  co: number;           // CO en mg/m³
  quality: string;      // Descripción de calidad
  recommendation: string; // Recomendación de salud
  timestamp: string;    // Timestamp de los datos
}
```

## Personalización

### Colores de AQI

Los colores siguen el estándar internacional:
- 0-50: Verde (Buena)
- 51-100: Amarillo (Moderada)
- 101-150: Naranja (Dañina para grupos sensibles)
- 151-200: Rojo (Dañina)
- 201-300: Morado (Muy dañina)
- 301+: Granate (Peligrosa)

### Temas

La aplicación soporta modo claro y oscuro automáticamente usando las variables CSS definidas en `globals.css`.

## Licencia

Este proyecto utiliza datos de fuentes públicas como NASA TEMPO y OpenAQ.