from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    # Configuración de la aplicación
    APP_NAME: str = "Sistema de Gestión Escolar"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Configuración de Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # Configuración de CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",      # React
        "http://localhost:5173",      # Vite
        "http://localhost:8080",      # Vue
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Configuración del servidor
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Instancia global de configuración
settings = Settings()


# Validación de credenciales requeridas
def validate_settings():
    """Valida que las configuraciones críticas estén presentes"""
    if not settings.SUPABASE_URL:
        raise ValueError("⚠️ SUPABASE_URL no está configurado en el archivo .env")
    if not settings.SUPABASE_KEY:
        raise ValueError("⚠️ SUPABASE_KEY no está configurado en el archivo .env")
    
    print("✅ Configuración validada correctamente")
    print(f"📌 Aplicación: {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f"🌐 CORS habilitado para: {', '.join(settings.CORS_ORIGINS)}")