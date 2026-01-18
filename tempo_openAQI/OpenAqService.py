from openaq import OpenAQ
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAQ_API_KEY")

client = OpenAQ(api_key=api_key)

# Consultar ubicaciones cercanas a las coordenadas dadas
respuesta = client.locations.list(coordinates=[19.4326, -99.1332], radius=12000, limit=5)

# Mostrar información básica del resultado
print("Rate limit:", respuesta.headers.x_ratelimit_remaining, "/", respuesta.headers.x_ratelimit_limit)
print("Total encontrados:", respuesta.meta.found)
print("Resultados:")

# Recorrer y mostrar los resultados
for loc in respuesta.results:
    print(f"- Nombre: {loc.name}")
    #print(f"  Ciudad: {loc.city}")
    print(f"  Coordenadas: {loc.coordinates}")
    print("------")
    locations = client.measurements.list(sensors_id=loc.id,limit=1,page=1,datetime_from='2024-10-10')
    print(locations.results)



client.close()
