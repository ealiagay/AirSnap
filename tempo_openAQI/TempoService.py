import earthaccess  # needed to discover and download TEMPO data
import netCDF4 as nc  # needed to read TEMPO data
import numpy as np

import matplotlib.pyplot as plt  # needed to plot the resulting time series
import cartopy.crs as ccrs
import cartopy.feature as cfeature

from datetime import datetime, timedelta

from dotenv import load_dotenv
import os

load_dotenv()

# opcional: comprobar que las variables están cargadas
print("EARTHDATA_USERNAME:", os.getenv("EARTHDATA_USERNAME") is not None)

# fuerza el uso de la estrategia 'environment' para tomar las variables del entorno
auth = earthaccess.login(strategy="environment", persist=True)

# verificar autenticación
if not auth.authenticated:
    raise RuntimeError("Login falló: revisa EARTHDATA_USERNAME/EARTHDATA_PASSWORD o el token")

print("Autenticado:", auth.authenticated)

short_name = "TEMPO_NO2_L3"
version = "V03"
def procesar_coordenadas(lat, lon):

    POI_lat = lat
    POI_lon = lon

    hoy = datetime.now()
    ayer = hoy - timedelta(weeks=4)

    fecha_inicio = ayer.replace(hour=0, minute=0, second=0, microsecond=0)
    fecha_fin = ayer.replace(hour=23, minute=59, second=59, microsecond=0)

    date_start = fecha_inicio.strftime("%Y-%m-%d %H:%M:%S")
    date_end = fecha_fin.strftime("%Y-%m-%d %H:%M:%S")

    POI_results = earthaccess.search_data(
        short_name=short_name,
        version=version,
        temporal=(date_start, date_end),
        point=(POI_lon, POI_lat), 
    )

    files = earthaccess.download(POI_results, local_path=".")

    granule_name = POI_results[8].data_links()[0].split("/")[-1]

    lat, lon, strat_NO2_column, fv_strat_NO2, trop_NO2_column, fv_trop_NO2, NO2_unit, QF = (
        read_TEMPO_NO2_L3(granule_name)
    )

    # Define a region of interest.
    dlat = 5  # deg
    dlon = 6  # deg
    mask_lat = (lat > POI_lat - dlat) & (lat < POI_lat + dlat)
    mask_lon = (lon > POI_lon - dlon) & (lon < POI_lon + dlon)

    # Subset NO2 column arrays.
    trop_NO2_column_loc = trop_NO2_column[0, mask_lat, :][:, mask_lon]
    strat_NO2_column_loc = strat_NO2_column[0, mask_lat, :][:, mask_lon]
    QF_loc = QF[0, mask_lat, :][:, mask_lon]
    best_data_mask_loc = (QF_loc == 0) & (trop_NO2_column_loc > 0.0) & (strat_NO2_column_loc > 0.0)

    # Create 2D arrays of latitudes and longitudes, by repeating lon/lat along rows/columns.
    nlat, nlon = trop_NO2_column_loc.shape
    lon_loc_2D = np.vstack([lon[mask_lon]] * nlat)
    lat_loc_2D = np.column_stack([lat[mask_lat]] * nlon)

    # Supongamos que esta es tu columna troposférica en moléculas/cm²
    no2_column = trop_NO2_column_loc[best_data_mask_loc]  # masked_array

    # 1. Convertir de moléculas/cm² a µg/m³ (aproximado)
    ug_m3_est = no2_column / 1e16 * 20

    # 2. Convertir µg/m³ a ppb (asumiendo condiciones estándar)
    ppb_est = ug_m3_est / 1.88

    no2_aqi_array = compute_aqi(ppb_est)

    # 4. Calcular AQI promedio ignorando NaNs
    mean_aqi = np.nanmean(no2_aqi_array)

    # Obtener clasificación del AQI
    classification = classify_aqi(mean_aqi)

    # Resultado final: AQI promedio y su clasificación
    return(f"AQI promedio: {round(mean_aqi, 1)} - {classification}")


def classify_aqi(aqi_value):
    if aqi_value <= 50:
        return "Buena (Good)"
    elif aqi_value <= 100:
        return "Moderada (Moderate)"
    elif aqi_value <= 150:
        return "No saludable para grupos sensibles (Unhealthy for Sensitive Groups)"
    elif aqi_value <= 200:
        return "No saludable (Unhealthy)"
    elif aqi_value <= 300:
        return "Muy no saludable (Very Unhealthy)"
    else:
        return "Peligroso (Hazardous)"

def compute_aqi(concentration):
    breakpoints = [
        (0, 53, 0, 50),
        (54, 100, 51, 100),
        (101, 360, 101, 150),
        (361, 649, 151, 200),
        (650, 1249, 201, 300),
        (1250, 1649, 301, 400),
        (1650, 2049, 401, 500),
    ]
    aqi = np.full_like(concentration, fill_value=np.nan, dtype=float)
    for C_low, C_high, I_low, I_high in breakpoints:
        idx = (concentration >= C_low) & (concentration <= C_high)
        aqi[idx] = (I_high - I_low) / (C_high - C_low) * (concentration[idx] - C_low) + I_low
    return aqi

def read_TEMPO_NO2_L3(fn):
    with nc.Dataset(fn) as ds:  # open read access to file
        # Open the 'product' group.
        prod = ds.groups["product"]

        # Read variable vertical_column_stratosphere from the product group.
        var = prod.variables["vertical_column_stratosphere"]
        strat_NO2_column = var[:]  # retrieve the numpy array.
        fv_strat_NO2 = var.getncattr("_FillValue")

        # Read variable 'vertical_column_troposphere' from the product group.
        var = prod.variables["vertical_column_troposphere"]
        trop_NO2_column = var[:]
        fv_trop_NO2 = var.getncattr("_FillValue")
        NO2_unit = var.getncattr("units")

        # Read variable 'main_data_quality_flag' from the product group.
        QF = prod.variables["main_data_quality_flag"][:]

        # Read latitude and longitude variables, from the root (/) group, into a numpy array.
        lat = ds.variables["latitude"][:]
        lon = ds.variables["longitude"][:]

    return lat, lon, strat_NO2_column, fv_strat_NO2, trop_NO2_column, fv_trop_NO2, NO2_unit, QF