import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
  edad: number;
  grado: string;
  email?: string;
}

export interface Curso {
  id: string;
  nombre: string;
  codigo: string;
  creditos: number;
  profesor?: string;
  horario?: string;
}

export interface Calificacion {
  id: string;
  estudianteId: string;
  cursoId: string;
  nota: number;
  periodo: string;
  fecha: string;
}

export interface EstudianteConCalificaciones extends Estudiante {
  calificaciones: Calificacion[];
  promedio: number;
  cursosAprobados: number;
  cursosDesaprobados: number;
}

export interface ReporteAcademico {
  id: string;
  estudianteId: string;
  periodo: string;
  promedio: number;
  totalCursos: number;
  aprobados: number;
  desaprobados: number;
  estado: 'Excelente' | 'Bueno' | 'Regular' | 'Deficiente';
  generadoEn: string;
}

// En tu archivo de tipos o arriba del DataContext
export interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
  edad: number;
  grado: string;
  email?: string | null;
  user_id?: string;
}

export interface Curso {
  id: string;
  nombre: string;  // ← coincide con CSV: "curso"
  codigo: string;
  creditos: number;
  profesor?: string | null;
  horario?: string | null;
  user_id?: string;
}

export interface Calificacion {
  id: string;
  estudianteId: string;
  cursoId: string;
  nota: number;
  periodo: string;
  fecha: string;
  user_id?: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [reportes, setReportes] = useState<ReporteAcademico[]>([]);
  const [currentEstudiante, setCurrentEstudiante] = useState<Estudiante | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos desde Supabase
  const loadData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Cargar estudiantes
      const { data: estudiantesData, error: estudiantesError } = await supabase
        .from('estudiantes')
        .select('*')
        .order('created_at', { ascending: false });

      if (estudiantesError) throw estudiantesError;
      setEstudiantes(estudiantesData || []);

      // Cargar cursos
      const { data: cursosData, error: cursosError } = await supabase
        .from('cursos')
        .select('*')
        .order('created_at', { ascending: false });

      if (cursosError) throw cursosError;
      setCursos(cursosData || []);

      // Cargar calificaciones
      const { data: calificacionesData, error: calificacionesError } = await supabase
        .from('calificaciones')
        .select('*')
        .order('created_at', { ascending: false });

      if (calificacionesError) throw calificacionesError;

      // Mapear datos de Supabase al formato del contexto
      const calificacionesMapped = (calificacionesData || []).map(c => ({
        id: c.id,
        estudianteId: c.estudiante_id,
        cursoId: c.curso_id,
        nota: c.nota,
        periodo: c.periodo,
        fecha: c.fecha
      }));
      setCalificaciones(calificacionesMapped);

      // Cargar reportes
      const { data: reportesData, error: reportesError } = await supabase
        .from('reportes_academicos')
        .select('*')
        .order('generado_en', { ascending: false });

      if (reportesError) throw reportesError;

      const reportesMapped = (reportesData || []).map(r => ({
        id: r.id,
        estudianteId: r.estudiante_id,
        periodo: r.periodo,
        promedio: r.promedio,
        totalCursos: r.total_cursos,
        aprobados: r.aprobados,
        desaprobados: r.desaprobados,
        estado: r.estado,
        generadoEn: r.generado_en
      }));
      setReportes(reportesMapped);

    } catch (error: any) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // En tu DataContext, reemplaza estas funciones:

const addEstudiante = async (estudiante: Omit<Estudiante, 'id'>): Promise<Estudiante> => {
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) throw new Error('Usuario no autenticado');

    const insertData = {
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      edad: estudiante.edad,
      grado: estudiante.grado,
      email: estudiante.email || null,
      user_id: currentUser.id
    };

    const { data, error } = await supabase
      .from('estudiantes')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    const nuevoEstudiante: Estudiante = data;
    setEstudiantes(prev => [nuevoEstudiante, ...prev]);
    setCurrentEstudiante(nuevoEstudiante);

    return nuevoEstudiante;
  } catch (error) {
    console.error('Error al guardar estudiante:', error);
    toast.error('Error al guardar estudiante');
    throw error;
  }
};

const addCurso = async (curso: Omit<Curso, 'id'>): Promise<Curso> => {
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) throw new Error('Usuario no autenticado');

    const insertData = {
      nombre: curso.nombre,
      codigo: curso.codigo,
      creditos: curso.creditos,
      profesor: curso.profesor || null,
      horario: curso.horario || null,
      user_id: currentUser.id
    };

    const { data, error } = await supabase
      .from('cursos')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    const nuevoCurso: Curso = data;
    setCursos(prev => [nuevoCurso, ...prev]);

    return nuevoCurso;
  } catch (error) {
    console.error('Error al guardar curso:', error);
    toast.error('Error al guardar curso');
    throw error;
  }
};

const addCalificacion = async (calificacion: Omit<Calificacion, 'id'>): Promise<Calificacion> => {
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) throw new Error('Usuario no autenticado');

    const insertData = {
      estudiante_id: calificacion.estudianteId,
      curso_id: calificacion.cursoId,
      nota: calificacion.nota,
      periodo: calificacion.periodo,
      fecha: calificacion.fecha,
      user_id: currentUser.id
    };

    const { data, error } = await supabase
      .from('calificaciones')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    const nuevaCalificacion: Calificacion = {
      id: data.id,
      estudianteId: data.estudiante_id,
      cursoId: data.curso_id,
      nota: data.nota,
      periodo: data.periodo,
      fecha: data.fecha
    };

    setCalificaciones(prev => [nuevaCalificacion, ...prev]);

    return nuevaCalificacion;
  } catch (error) {
    console.error('Error al guardar calificación:', error);
    toast.error('Error al guardar calificación');
    throw error;
  }
};

  const deleteEstudiante = async (id: string) => {
    try {
      const { error } = await supabase
        .from('estudiantes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEstudiantes(prev => prev.filter(e => e.id !== id));
      setCalificaciones(prev => prev.filter(c => c.estudianteId !== id));
      setReportes(prev => prev.filter(r => r.estudianteId !== id));

      if (currentEstudiante?.id === id) {
        setCurrentEstudiante(null);
      }

      toast.success('Estudiante eliminado correctamente');
    } catch (error: any) {
      console.error('Error eliminando estudiante:', error);
      toast.error('Error al eliminar estudiante');
      throw error;
    }
  };

  const selectEstudiante = (id: string) => {
    const estudiante = estudiantes.find(e => e.id === id);
    if (estudiante) {
      setCurrentEstudiante(estudiante);
    }
  };

  const getEstudianteConCalificaciones = (id: string): EstudianteConCalificaciones | null => {
    const estudiante = estudiantes.find(e => e.id === id);
    if (!estudiante) return null;

    const califs = calificaciones.filter(c => c.estudianteId === id);
    const promedio = califs.length > 0
      ? califs.reduce((sum, c) => sum + c.nota, 0) / califs.length
      : 0;

    const aprobados = califs.filter(c => c.nota >= 11).length;
    const desaprobados = califs.filter(c => c.nota < 11).length;

    return {
      ...estudiante,
      calificaciones: califs,
      promedio: Math.round(promedio * 10) / 10,
      cursosAprobados: aprobados,
      cursosDesaprobados: desaprobados
    };
  };

  const generarReporte = async (estudianteId: string, periodo: string): Promise<ReporteAcademico> => {
    try {
      const estudianteData = getEstudianteConCalificaciones(estudianteId);
      if (!estudianteData) {
        throw new Error('Estudiante no encontrado');
      }

      const califs = calificaciones.filter(
        c => c.estudianteId === estudianteId && c.periodo === periodo
      );

      const promedio = califs.length > 0
        ? califs.reduce((sum, c) => sum + c.nota, 0) / califs.length
        : 0;

      const aprobados = califs.filter(c => c.nota >= 11).length;
      const desaprobados = califs.filter(c => c.nota < 11).length;

      let estado: 'Excelente' | 'Bueno' | 'Regular' | 'Deficiente';
      if (promedio >= 16) estado = 'Excelente';
      else if (promedio >= 14) estado = 'Bueno';
      else if (promedio >= 11) estado = 'Regular';
      else estado = 'Deficiente';

      const { data: { user: currentUser } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('reportes_academicos')
        .insert({
          estudiante_id: estudianteId,
          periodo,
          promedio: Math.round(promedio * 10) / 10,
          total_cursos: califs.length,
          aprobados,
          desaprobados,
          estado,
          user_id: currentUser?.id
        })
        .select()
        .single();

      if (error) throw error;

      const reporteMapped = {
        id: data.id,
        estudianteId: data.estudiante_id,
        periodo: data.periodo,
        promedio: data.promedio,
        totalCursos: data.total_cursos,
        aprobados: data.aprobados,
        desaprobados: data.desaprobados,
        estado: data.estado,
        generadoEn: data.generado_en
      };

      setReportes(prev => [reporteMapped, ...prev]);
      toast.success('Reporte generado correctamente');
      return reporteMapped;
    } catch (error: any) {
      console.error('Error generando reporte:', error);
      toast.error('Error al generar reporte');
      throw error;
    }
  };

  const getReporte = (estudianteId: string) => {
    return reportes.find(r => r.estudianteId === estudianteId);
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <DataContext.Provider value={{
      estudiantes,
      cursos,
      calificaciones,
      reportes,
      currentEstudiante,
      isLoading,
      addEstudiante,
      addCurso,
      addCalificacion,
      deleteEstudiante,
      selectEstudiante,
      getEstudianteConCalificaciones,
      generarReporte,
      getReporte,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData debe usarse dentro de DataProvider');
  }
  return context;
};