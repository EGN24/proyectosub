import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos de base de datos
export interface Database {
  public: {
    Tables: {
      estudiantes: {
        Row: {
          id: string;
          nombre: string;
          apellido: string;
          edad: number;
          grado: string;
          email: string | null;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          apellido: string;
          edad: number;
          grado: string;
          email?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          apellido?: string;
          edad?: number;
          grado?: string;
          email?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
      };
      cursos: {
        Row: {
          id: string;
          nombre: string;
          codigo: string;
          creditos: number;
          profesor: string | null;
          horario: string | null;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          codigo: string;
          creditos: number;
          profesor?: string | null;
          horario?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          codigo?: string;
          creditos?: number;
          profesor?: string | null;
          horario?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
      };
      calificaciones: {
        Row: {
          id: string;
          estudiante_id: string;
          curso_id: string;
          nota: number;
          periodo: string;
          fecha: string;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          estudiante_id: string;
          curso_id: string;
          nota: number;
          periodo: string;
          fecha?: string;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          estudiante_id?: string;
          curso_id?: string;
          nota?: number;
          periodo?: string;
          fecha?: string;
          user_id?: string | null;
          created_at?: string;
        };
      };
      reportes_academicos: {
        Row: {
          id: string;
          estudiante_id: string;
          periodo: string;
          promedio: number;
          total_cursos: number;
          aprobados: number;
          desaprobados: number;
          estado: 'Excelente' | 'Bueno' | 'Regular' | 'Deficiente';
          user_id: string | null;
          generado_en: string;
        };
        Insert: {
          id?: string;
          estudiante_id: string;
          periodo: string;
          promedio: number;
          total_cursos: number;
          aprobados: number;
          desaprobados: number;
          estado: 'Excelente' | 'Bueno' | 'Regular' | 'Deficiente';
          user_id?: string | null;
          generado_en?: string;
        };
        Update: {
          id?: string;
          estudiante_id?: string;
          periodo?: string;
          promedio?: number;
          total_cursos?: number;
          aprobados?: number;
          desaprobados?: number;
          estado?: 'Excelente' | 'Bueno' | 'Regular' | 'Deficiente';
          user_id?: string | null;
          generado_en?: string;
        };
      };
    };
  };
}