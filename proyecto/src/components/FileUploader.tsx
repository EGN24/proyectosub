import { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { parseFile } from '@/utils/fileParser';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';

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

      // Mapas: clave → id de Supabase
      const estudianteMap = new Map<string, string>(); // email o nombre+apellido → id
      const cursoMap = new Map<string, string>();      // codigo → id

      for (const row of parsedData.data) {
        try {
          // === ESTUDIANTE ===
          const nombre = row.nombre?.trim();
          const apellido = row.apellido?.trim();
          const email = row.email?.trim();

          if (nombre && apellido) {
            const estudianteKey = email || `${nombre}-${apellido}`;
            
            if (!estudianteMap.has(estudianteKey)) {
              const estudiante = await addEstudiante({
                nombre,
                apellido,
                edad: row.edad ? parseInt(row.edad) : 15,
                grado: row.grado || '1° Secundaria',
                email: email || undefined
              });

              estudianteMap.set(estudianteKey, estudiante.id);
              estudiantesCount++;
            }
          }

          // === CURSO ===
          const cursoNombre = (row.curso || row.materia || row.nombreCurso)?.trim();
          const cursoCodigo = (row.codigo || row.codigoCurso)?.trim() || `COD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

          if (cursoNombre && !cursoMap.has(cursoCodigo)) {
            const curso = await addCurso({
              nombre: cursoNombre,
              codigo: cursoCodigo,
              creditos: row.creditos ? parseInt(row.creditos) : 3,
              profesor: row.profesor || row.maestro || undefined
            });

            cursoMap.set(cursoCodigo, curso.id);
            cursosCount++;
          }

          // === CALIFICACIÓN ===
          const notaStr = row.nota || row.calificacion;
          if (notaStr !== undefined && !isNaN(parseFloat(notaStr))) {
            const nota = parseFloat(notaStr);
            const periodo = row.periodo || '2024-1';

            // Buscar estudiante
            let estudianteId: string | undefined;
            if (email && estudianteMap.has(email)) {
              estudianteId = estudianteMap.get(email);
            } else if (nombre && apellido) {
              estudianteId = estudianteMap.get(`${nombre}-${apellido}`);
            }

            // Buscar curso
            let cursoId: string | undefined;
            if (row.codigo && cursoMap.has(row.codigo)) {
              cursoId = cursoMap.get(row.codigo);
            } else if (cursoCodigo && cursoMap.has(cursoCodigo)) {
              cursoId = cursoMap.get(cursoCodigo);
            }

            if (estudianteId && cursoId) {
              await addCalificacion({
                estudianteId,
                cursoId,
                nota,
                periodo,
                fecha: new Date().toISOString().split('T')[0]
              });
              calificacionesCount++;
            }
          }
        } catch (rowError) {
          console.warn('Fila ignorada:', row, rowError);
        }
      }

      setStats({ estudiantes: estudiantesCount, cursos: cursosCount, calificaciones: calificacionesCount });
      setUploadStatus('success');
      toast.success(`¡Éxito! ${estudiantesCount} estudiantes, ${cursosCount} cursos, ${calificacionesCount} calificaciones`);
      onUploadComplete?.();
    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage(error.message || 'Error desconocido');
      toast.error('Error: ' + error.message);
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
          Sube un archivo CSV con estudiantes, cursos y calificaciones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            accept=".csv"
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
                <p className="font-medium">Selecciona un archivo CSV</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Máx. 20MB
                </p>
              </div>
            </div>
          </label>
        </div>

        {file && (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Archivo: <strong>{file.name}</strong>
            </AlertDescription>
          </Alert>
        )}

        {uploadStatus === 'success' && stats && (
          <Alert className="border-success/50 bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription>
              <strong>¡Listo!</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>Estudiantes: {stats.estudiantes}</li>
                <li>Cursos: {stats.cursos}</li>
                <li>Calificaciones: {stats.calificaciones}</li>
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

        <Button
          onClick={processData}
          disabled={!file || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Cargar Datos
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Formato CSV esperado:</p>
          <code className="text-xs block bg-muted p-2 rounded">
            nombre,apellido,edad,grado,email,curso,codigo,creditos,profesor,nota,periodo
          </code>
        </div>
      </CardContent>
    </Card>
  );
};