from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from pydantic import BaseModel
from settings import settings, validate_settings

# Validar configuración al iniciar
validate_settings()


# Crear la aplicación FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API REST para gestión escolar con Supabase",
    debug=settings.DEBUG
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

# Crear cliente de Supabase
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


# ------------------------------
# Modelos de datos
# ------------------------------
class Estudiante(BaseModel):
    nombre: str
    apellido: str
    edad: int
    grado: str
    email: str


class Curso(BaseModel):
    nombre: str
    codigo: str
    creditos: int
    profesor: str
    horario: str


class Calificacion(BaseModel):
    estudiante_id: str
    curso_id: str
    nota: float
    periodo: str


# ------------------------------
# Ruta principal
# ------------------------------
@app.get("/")
def root():
    return {
        "message": "✅ Backend conectado correctamente",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Endpoint para verificar el estado del servidor"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


# ------------------------------
# Rutas de Estudiantes
# ------------------------------
@app.get("/estudiantes")
def get_estudiantes():
    """Obtener todos los estudiantes"""
    try:
        data = supabase.table("estudiantes").select("*").execute()
        return {"success": True, "data": data.data, "count": len(data.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/estudiantes/{estudiante_id}")
def get_estudiante(estudiante_id: str):
    """Obtener un estudiante por ID"""
    try:
        data = supabase.table("estudiantes").select("*").eq("id", estudiante_id).execute()
        if not data.data:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado")
        return {"success": True, "data": data.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/estudiantes")
def crear_estudiante(est: Estudiante):
    """Crear un nuevo estudiante"""
    try:
        response = supabase.table("estudiantes").insert(est.dict()).execute()
        return {"success": True, "message": "✅ Estudiante creado correctamente", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.put("/estudiantes/{estudiante_id}")
def actualizar_estudiante(estudiante_id: str, est: Estudiante):
    """Actualizar un estudiante existente"""
    try:
        response = supabase.table("estudiantes").update(est.dict()).eq("id", estudiante_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado")
        return {"success": True, "message": "✅ Estudiante actualizado correctamente", "data": response.data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/estudiantes/{estudiante_id}")
def eliminar_estudiante(estudiante_id: str):
    """Eliminar un estudiante"""
    try:
        response = supabase.table("estudiantes").delete().eq("id", estudiante_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado")
        return {"success": True, "message": "✅ Estudiante eliminado correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ------------------------------
# Rutas de Cursos
# ------------------------------
@app.get("/cursos")
def get_cursos():
    """Obtener todos los cursos"""
    try:
        data = supabase.table("cursos").select("*").execute()
        return {"success": True, "data": data.data, "count": len(data.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/cursos/{curso_id}")
def get_curso(curso_id: str):
    """Obtener un curso por ID"""
    try:
        data = supabase.table("cursos").select("*").eq("id", curso_id).execute()
        if not data.data:
            raise HTTPException(status_code=404, detail="Curso no encontrado")
        return {"success": True, "data": data.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/cursos")
def crear_curso(curso: Curso):
    """Crear un nuevo curso"""
    try:
        response = supabase.table("cursos").insert(curso.dict()).execute()
        return {"success": True, "message": "✅ Curso creado correctamente", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.put("/cursos/{curso_id}")
def actualizar_curso(curso_id: str, curso: Curso):
    """Actualizar un curso existente"""
    try:
        response = supabase.table("cursos").update(curso.dict()).eq("id", curso_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Curso no encontrado")
        return {"success": True, "message": "✅ Curso actualizado correctamente", "data": response.data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/cursos/{curso_id}")
def eliminar_curso(curso_id: str):
    """Eliminar un curso"""
    try:
        response = supabase.table("cursos").delete().eq("id", curso_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Curso no encontrado")
        return {"success": True, "message": "✅ Curso eliminado correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ------------------------------
# Rutas de Calificaciones
# ------------------------------
@app.get("/calificaciones")
def get_calificaciones():
    """Obtener todas las calificaciones"""
    try:
        data = supabase.table("calificaciones").select("*").execute()
        return {"success": True, "data": data.data, "count": len(data.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/calificaciones/{calificacion_id}")
def get_calificacion(calificacion_id: str):
    """Obtener una calificación por ID"""
    try:
        data = supabase.table("calificaciones").select("*").eq("id", calificacion_id).execute()
        if not data.data:
            raise HTTPException(status_code=404, detail="Calificación no encontrada")
        return {"success": True, "data": data.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/calificaciones/estudiante/{estudiante_id}")
def get_calificaciones_estudiante(estudiante_id: str):
    """Obtener todas las calificaciones de un estudiante"""
    try:
        data = supabase.table("calificaciones").select("*").eq("estudiante_id", estudiante_id).execute()
        return {"success": True, "data": data.data, "count": len(data.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/calificaciones")
def crear_calificacion(calif: Calificacion):
    """Crear una nueva calificación"""
    try:
        response = supabase.table("calificaciones").insert(calif.dict()).execute()
        return {"success": True, "message": "✅ Calificación registrada correctamente", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.put("/calificaciones/{calificacion_id}")
def actualizar_calificacion(calificacion_id: str, calif: Calificacion):
    """Actualizar una calificación existente"""
    try:
        response = supabase.table("calificaciones").update(calif.dict()).eq("id", calificacion_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Calificación no encontrada")
        return {"success": True, "message": "✅ Calificación actualizada correctamente", "data": response.data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@app.delete("/calificaciones/{calificacion_id}")
def eliminar_calificacion(calificacion_id: str):
    """Eliminar una calificación"""
    try:
        response = supabase.table("calificaciones").delete().eq("id", calificacion_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Calificación no encontrada")
        return {"success": True, "message": "✅ Calificación eliminada correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))