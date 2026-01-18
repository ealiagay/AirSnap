# AirSnap — TEMPO + OpenAQ Air Quality Forecasting

**AirSnap** is a web application that fuses NASA TEMPO satellite data, OpenAQ, local ground sensors, weather APIs, and AI models to provide hyperlocal air quality forecasts, automated alerts, and image-based pollution analysis. The system includes a Next.js frontend, a NestJS backend, and Python microservices for data science and computer vision.

---

## Quick summary

A location-aware platform that ingests satellite and in-situ measurements, runs ML forecasts for AQI (PM2.5, PM10, NO₂, O₃, CO), analyzes satellite/ground images for smoke and dust with computer vision, and notifies users (including vulnerable populations with respiratory conditions) when air quality is poor.

---

## Features

* Real-time ingestion of NASA TEMPO and OpenAQ observations.

* Integration with local sensor feeds and public weather APIs.

* Computer-vision analysis of satellite and ground images to detect smoke, dust, and reduced visibility.

* Location-aware maps and dashboards (Next.js frontend).

* Push notifications and configurable alert thresholds.

* Modular architecture that can run on local devices or scale to the cloud.

---

## Why this matters

By fusing satellite observations with ground sensors and AI-driven analysis, AirSense reduces monitoring blind spots, issues targeted alerts for public-health officials and citizens, and helps people with respiratory conditions (e.g., asthma, COPD) make safer choices (adjust medication, avoid outdoor activities, seek shelter).

---

## Architecture overview

* **Frontend:** Next.js (React) — user interface, maps, and visualizations.
* **Backend / API:** NestJS — data orchestration, caching, authentication, and alertin.
* **Data science & CV:** Python microservices — ETL, feature engineering, model training, forecasting, and image analysis.
* **Storage:** PostgreSQL 
* **Deployment:** Containerized (Docker)

---

## Tech stack

* Frontend: Next.js, React, Leaflet/Mapbox (or similar)

* Backend: NestJS, Node.js

* Databases: PostgreSQL,

* Infrastructure: Docker, Docker Compose

---

## Getting started (local development)

> The following commands assume you have `git`, `node` (v16+), `npm`/`pnpm`/`yarn`, `python` (3.8+), and `docker` installed.

1. **Clone the repository**

```bash
git clone https://github.com/Eufanzky/AirSnap.git
cd airsnap
```

2. **Environment variables**

Create `.env` files for each service. Example variables (do **not** commit secrets):

```
# Backend (nest)
DB_HOST=localhost
DB_PORT=5434
DB_NAME=appdb
DB_USER=appuser
DB_PASSWORD=apppass
DATABASE_URL=postgres://appuser:apppass@localhost:5434/appdb



# Configuración del servicio de correo
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=USER
EMAIL_PASS=PASSWORD


GEMINI_API_KEY=AIzaSyBWxzeLfT1d15W_vNQxgJ8Zh1Q1aPc_BnY
GEMINI_MODEL=gemini-2.5-flash
PORT=3000

# Frontend (next)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Python services
EARTHDATA_USERNAME=USER
EARTHDATA_PASSWORD=PASSWORD
OPENAQ_API_KEY=APIKEY
```

3. **Start dependent services (Postgres, Redis, MinIO)**

You can use Docker Compose (example `docker-compose.yml` is provided in `/`backend):

```bash
# from repo root
docker compose up -d
```

4. **Run backend (NestJS)**

```bash
cd backend
npm install
npm run start:dev
```

5. **Run frontend (Next.js)**

```bash
cd frontend
pnpm install
pnpm run dev
```

6. **Run Python microservices**

Each Python microservice lives in `/services/python/*`. Create a virtual environment and install requirements:

```bash
cd services/python/forecast
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

Repeat for CV and ETL services.

---

## Running with Docker (recommended for testing)

Build and run all components using the provided `docker-compose.yml`:

```bash
docker compose -f deploy/docker-compose.yml up --build
```

This will spin up Postgres, Redis, backend, frontend, and Python services in containers.

---

## Data sources

* **NASA TEMPO:** satellite-level column and spectral retrievals for pollutants (used for spatially extensive observations).
* **OpenAQ:** ground-based pollutant measurements and historical records.
* **Local sensors:** optional integrations with city or community sensor networks.
* **Weather APIs:** meteorological inputs used as features in forecasting models.

> Configure API endpoints and keys in each service's `.env` file.

---

## AI / ML disclosure

We used AI tools in the project as follows:

* **Development assistance:** ChatGPT and Vercel AI (V0) were used to accelerate code prototyping and generate code snippets; all AI-assisted code is reviewed and adapted by the team.
* **CV models:** Pretrained models were fine-tuned for smoke/dust detection and image-based visibility estimation.
*

---

## Accessibility & privacy

* The app requests the user's location to provide hyperlocal forecasts; location data is only used transiently unless users explicitly opt in to share it (configurable in the UI).
* No personally identifiable information is stored unless explicitly permitted by the user.

---

## License

This project is released under the MIT License. See `LICENSE` for details.

---

## Acknowledgements

* NASA TEMPO mission and the OpenAQ community for open air-quality data.
* Third-party libraries and frameworks used by the project.

---

### 👨‍💻 Información del Desarrollador (Colaborador)

* **Desarrollador:** [Edwin Aliaga Yujra](https://www.linkedin.com/in/edwin-aliaga-yujra)
* **Institución:** Universidad Mayor de San Andrés (UMSA)
* **Materia:** Taller de Sistemas de Información
* **Contribución:** Desarrollo y optimización de módulos en el ecosistema Fullstack (NestJS/Next.js) e integración de datos ambientales.
