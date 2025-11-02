import { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { parseFile } from '@/utils/fileParser';
import { toast } from 'sonner';
import { useData, Estudiante, Curso, Calificacion } from '@/contexts/DataContext';

interface FileUploaderProps {
  onUploadComplete?: () => void;
}

export const FileUploader = ({ onUploadComplete }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [stats, setStats] = useState<{ estudiantes: number; cursos: number; calificaciones: number } | null>(null);
  
  const { addEstudiante, addCurso, addCalificacion } = useData();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (['csv', 'json', 'xlsx', 'xls'].includes(extension || '')) {
        setFile(selectedFile);
        setUploadStatus('idle');
        setErrorMessage('');
      } else {
        toast.error('Formato no válido. Use CSV, JSON o XLSX');
      }
    }
  };

  const processData = async () => {
    if (!file) return;

    setIsProcessing(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      const parsedData = await parseFile(file);
      
      let estudiantesCount = 0;
      let cursosCount = 0;
      let calificacionesCount = 0;

      // Procesar datos según el formato
      parsedData.data.forEach((row: any) => {
        // Detectar y procesar ESTUDIANTES
        if (row.nombre && row.apellido && (row.edad || row.grado)) {
          const estudiante: Estudiante = {
            id: row.id || `EST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            nombre: row.nombre,
            apellido: row.apellido,
            edad: row.edad ? parseInt(row.edad) : 15,
            grado: row.grado || '1° Secundaria',
            email: row.email || undefined
          };
          addEstudiante(estudiante);
          estudiantesCount++;
        }

        // Detectar y procesar CURSOS
        if (row.curso || row.nombreCurso || row.materia) {
          const curso: Curso = {
            id: row.cursoId || row.id || `CUR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            nombre: row.curso || row.nombreCurso || row.materia,
            codigo: row.codigo || row.codigoCurso || `COD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            creditos: row.creditos ? parseInt(row.creditos) : 3,
            profesor: row.profesor || row.maestro || row.docente || undefined,
            horario: row.horario || undefined
          };
          addCurso(curso);
          cursosCount++;
        }

        // Detectar y procesar CALIFICACIONES
        if ((row.nota !== undefined || row.calificacion !== undefined) && 
            (row.estudianteId || row.estudianteNombre) && 
            (row.cursoId || row.cursoNombre)) {
          const calificacion: Calificacion = {
            id: `CAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            estudianteId: row.estudianteId || `EST-${row.estudianteNombre}`,
            cursoId: row.cursoId || `CUR-${row.cursoNombre}`,
            nota: parseFloat(row.nota || row.calificacion || '0'),
            periodo: row.periodo || '2024-1',
            fecha: row.fecha || new Date().toISOString()
          };
          addCalificacion(calificacion);
          calificacionesCount++;
        }

        // Formato alternativo: fila con estudiante + curso + nota
        if (row.nombre && row.apellido && (row.curso || row.materia) && (row.nota !== undefined || row.calificacion !== undefined)) {
          // Crear estudiante
          const estudianteId = `EST-${row.nombre}-${row.apellido}-${Date.now()}`;
          const estudiante: Estudiante = {
            id: estudianteId,
            nombre: row.nombre,
            apellido: row.apellido,
            edad: row.edad ? parseInt(row.edad) : 15,
            grado: row.grado || '1° Secundaria',
            email: row.email || undefined
          };
          addEstudiante(estudiante);
          estudiantesCount++;

          // Crear curso si tiene
          const cursoNombre = row.curso || row.materia;
          const cursoId = `CUR-${cursoNombre}-${Date.now()}`;
          const curso: Curso = {
            id: cursoId,
            nombre: cursoNombre,
            codigo: row.codigoCurso || `COD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            creditos: row.creditos ? parseInt(row.creditos) : 3,
            profesor: row.profesor || row.maestro || undefined,
            horario: row.horario || undefined
          };
          addCurso(curso);
          cursosCount++;

          // Crear calificación
          const calificacion: Calificacion = {
            id: `CAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            estudianteId: estudianteId,
            cursoId: cursoId,
            nota: parseFloat(row.nota || row.calificacion || '0'),
            periodo: row.periodo || '2024-1',
            fecha: row.fecha || new Date().toISOString()
          };
          addCalificacion(calificacion);
          calificacionesCount++;
        }
      });

      setStats({
        estudiantes: estudiantesCount,
        cursos: cursosCount,
        calificaciones: calificacionesCount
      });

      setUploadStatus('success');
      toast.success(`¡Datos cargados exitosamente! ${estudiantesCount} estudiantes, ${cursosCount} cursos, ${calificacionesCount} calificaciones`);
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage(error.message || 'Error al procesar el archivo');
      toast.error('Error al procesar el archivo');
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm hover:shadow-glow-primary transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          Carga Masiva de Datos
        </CardTitle>
        <CardDescription>
          Sube un archivo CSV, JSON o XLSX con datos de estudiantes, cursos y calificaciones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            accept=".csv,.json,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-primary/10 rounded-full">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">Selecciona un archivo</p>
                <p className="text-sm text-muted-foreground mt-1">
                  CSV, JSON o XLSX (máx. 20MB)
                </p>
              </div>
            </div>
          </label>
        </div>

        {file && (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Archivo seleccionado: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
            </AlertDescription>
          </Alert>
        )}

        {uploadStatus === 'success' && stats && (
          <Alert className="border-success/50 bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription>
              <strong>¡Carga exitosa!</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>✓ {stats.estudiantes} estudiantes registrados</li>
                <li>✓ {stats.cursos} cursos agregados</li>
                <li>✓ {stats.calificaciones} calificaciones procesadas</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {uploadStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Button
            onClick={processData}
            disabled={!file || isProcessing}
            className="w-full bg-gradient-primary shadow-glow-primary hover:shadow-glow-accent transition-all duration-300"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Cargar y Procesar Datos
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground space-y-1 mt-4">
            <p className="font-medium">Formato esperado del archivo:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Estudiantes:</strong> nombre, apellido, edad, grado, email</li>
              <li><strong>Cursos:</strong> curso/materia, codigo, creditos, profesor/maestro</li>
              <li><strong>Calificaciones:</strong> estudianteId/estudianteNombre, cursoId/cursoNombre, nota/calificacion, periodo</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
