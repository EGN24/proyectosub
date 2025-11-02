import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface DataContextType {
  estudiantes: Estudiante[];
  cursos: Curso[];
  calificaciones: Calificacion[];
  reportes: ReporteAcademico[];
  currentEstudiante: Estudiante | null;
  addEstudiante: (estudiante: Estudiante) => void;
  addCurso: (curso: Curso) => void;
  addCalificacion: (calificacion: Calificacion) => void;
  deleteEstudiante: (id: string) => void;
  selectEstudiante: (id: string) => void;
  getEstudianteConCalificaciones: (id: string) => EstudianteConCalificaciones | null;
  generarReporte: (estudianteId: string, periodo: string) => ReporteAcademico;
  getReporte: (estudianteId: string) => ReporteAcademico | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>(() => {
    const saved = localStorage.getItem('school-estudiantes');
    return saved ? JSON.parse(saved) : [];
  });

  const [cursos, setCursos] = useState<Curso[]>(() => {
    const saved = localStorage.getItem('school-cursos');
    return saved ? JSON.parse(saved) : [];
  });

  const [calificaciones, setCalificaciones] = useState<Calificacion[]>(() => {
    const saved = localStorage.getItem('school-calificaciones');
    return saved ? JSON.parse(saved) : [];
  });

  const [reportes, setReportes] = useState<ReporteAcademico[]>(() => {
    const saved = localStorage.getItem('school-reportes');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentEstudiante, setCurrentEstudiante] = useState<Estudiante | null>(() => {
    const saved = localStorage.getItem('school-current-estudiante');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('school-estudiantes', JSON.stringify(estudiantes));
  }, [estudiantes]);

  useEffect(() => {
    localStorage.setItem('school-cursos', JSON.stringify(cursos));
  }, [cursos]);

  useEffect(() => {
    localStorage.setItem('school-calificaciones', JSON.stringify(calificaciones));
  }, [calificaciones]);

  useEffect(() => {
    localStorage.setItem('school-reportes', JSON.stringify(reportes));
  }, [reportes]);

  useEffect(() => {
    if (currentEstudiante) {
      localStorage.setItem('school-current-estudiante', JSON.stringify(currentEstudiante));
    }
  }, [currentEstudiante]);

  const addEstudiante = (estudiante: Estudiante) => {
    setEstudiantes(prev => [estudiante, ...prev]);
    setCurrentEstudiante(estudiante);
  };

  const addCurso = (curso: Curso) => {
    setCursos(prev => [curso, ...prev]);
  };

  const addCalificacion = (calificacion: Calificacion) => {
    setCalificaciones(prev => [calificacion, ...prev]);
  };

  const deleteEstudiante = (id: string) => {
    setEstudiantes(prev => prev.filter(e => e.id !== id));
    setCalificaciones(prev => prev.filter(c => c.estudianteId !== id));
    setReportes(prev => prev.filter(r => r.estudianteId !== id));
    if (currentEstudiante?.id === id) {
      setCurrentEstudiante(null);
      localStorage.removeItem('school-current-estudiante');
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

  const generarReporte = (estudianteId: string, periodo: string): ReporteAcademico => {
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

    const reporte: ReporteAcademico = {
      id: Date.now().toString(),
      estudianteId,
      periodo,
      promedio: Math.round(promedio * 10) / 10,
      totalCursos: califs.length,
      aprobados,
      desaprobados,
      estado,
      generadoEn: new Date().toISOString()
    };

    setReportes(prev => [reporte, ...prev]);
    return reporte;
  };

  const getReporte = (estudianteId: string) => {
    return reportes.find(r => r.estudianteId === estudianteId);
  };

  return (
    <DataContext.Provider value={{
      estudiantes,
      cursos,
      calificaciones,
      reportes,
      currentEstudiante,
      addEstudiante,
      addCurso,
      addCalificacion,
      deleteEstudiante,
      selectEstudiante,
      getEstudianteConCalificaciones,
      generarReporte,
      getReporte
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
