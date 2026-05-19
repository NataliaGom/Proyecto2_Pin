import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()

#Con esta fución se cargan las variables de entorno y se almacenan en caché para evitar recargar 
# las variables cada vez que se llama a la función. 
@lru_cache
def get_settings():
    return {
        "database_url": os.getenv("DATABASE_URL", ""),
        "unsplash_access_key": os.getenv("UNSPLASH_ACCESS_KEY", ""),
        "frontend_origin": os.getenv("FRONTEND_ORIGIN", "https://proyecto2-pin-1.onrender.com"),
    }
