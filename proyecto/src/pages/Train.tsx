import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useData, Calificacion } from "@/contexts/DataContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Award, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const Train = () => {
  const navigate = useNavigate();
  const { estudiantes, cursos, addCalificacion, calificaciones } = useData();
  
  const [selectedEstudiante, setSelectedEstudiante] = useState("");
  const [selectedCurso, setSelectedCurso] = useState("");
  const [nota, setNota] = useState("");
  const [periodo, setPeriodo] = useState("");

  const handleAsignarCalificacion = () => {
    if (!selectedEstudiante || !selectedCurso || !nota || !periodo) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const notaNum = parseFloat(nota);
    if (notaNum < 0 || notaNum > 20) {
      toast.error("La nota debe estar entre 0 y 20");
      return;
    }

    const nuevaCalificacion: Calificacion = {
      id: Date.now().toString(),
      estudianteId: selectedEstudiante,
      cursoId: selectedCurso,
      nota: notaNum,
      periodo,
      fecha: new Date().toISOString()
    };

    addCalificacion(nuevaCalificacion);
    
    const estudiante = estudiantes.find(e => e.id === selectedEstudiante);
    const curso = cursos.find(c => c.id === selectedCurso);
    
    toast.success(
      `Nota ${notaNum} asignada a ${estudiante?.nombre} en ${curso?.nombre}`
    );

    setSelectedEstudiante("");
    setSelectedCurso("");
    setNota("");
  };

  if (estudiantes.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Asignar Calificaciones</h1>
          <p className="text-muted-foreground">
            Registra las notas de los estudiantes
          </p>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No hay estudiantes registrados. Por favor registra estudiantes primero.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/upload')}>
          Ir a Registrar Estudiantes
        </Button>
      </div>
    );
  }

  if (cursos.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Asignar Calificaciones</h1>
          <p className="text-muted-foreground">
            Registra las notas de los estudiantes
          </p>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No hay cursos registrados. Por favor crea cursos primero.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/clean')}>
          Ir a Gestión de Cursos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Asignar Calificaciones</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Registra las notas de los estudiantes por curso
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Nueva Calificación
            </CardTitle>
            <CardDescription>
              Selecciona estudiante, curso y asigna la nota
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Estudiante</Label>
              <Select value={selectedEstudiante} onValueChange={setSelectedEstudiante}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estudiante" />
                </SelectTrigger>
                <SelectContent>
                  {estudiantes.map((est) => (
                    <SelectItem key={est.id} value={est.id}>
                      {est.nombre} {est.apellido} - {est.grado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Curso</Label>
              <Select value={selectedCurso} onValueChange={setSelectedCurso}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map((curso) => (
                    <SelectItem key={curso.id} value={curso.id}>
                      {curso.nombre} ({curso.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Periodo</Label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar periodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-1">2024 - I Bimestre</SelectItem>
                  <SelectItem value="2024-2">2024 - II Bimestre</SelectItem>
                  <SelectItem value="2024-3">2024 - III Bimestre</SelectItem>
                  <SelectItem value="2024-4">2024 - IV Bimestre</SelectItem>
                  <SelectItem value="2025-1">2025 - I Bimestre</SelectItem>
                  <SelectItem value="2025-2">2025 - II Bimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nota">Nota (0-20)</Label>
              <Input
                id="nota"
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="15.5"
              />
              {nota && (
                <div className="mt-2">
                  <Badge variant={parseFloat(nota) >= 11 ? "default" : "destructive"}>
                    {parseFloat(nota) >= 11 ? "✓ Aprobado" : "✗ Desaprobado"}
                  </Badge>
                </div>
              )}
            </div>

            <Button 
              className="w-full bg-gradient-primary shadow-glow-primary hover:shadow-glow-accent transition-all duration-300"
              onClick={handleAsignarCalificacion}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Asignar Calificación
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Estadísticas
            </CardTitle>
            <CardDescription>
              Resumen de calificaciones registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold text-primary">{calificaciones.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Notas Totales</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold text-success">
                  {calificaciones.filter(c => c.nota >= 11).length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Aprobados</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold text-destructive">
                  {calificaciones.filter(c => c.nota < 11).length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Desaprobados</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold text-accent">
                  {calificaciones.length > 0
                    ? (calificaciones.reduce((sum, c) => sum + c.nota, 0) / calificaciones.length).toFixed(1)
                    : '0'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Promedio</p>
              </div>
            </div>

            <Button 
              className="w-full mt-6 bg-gradient-primary shadow-glow-primary"
              onClick={() => navigate('/results')}
            >
              Ver Reportes Completos
            </Button>
          </CardContent>
        </Card>
      </div>

      {calificaciones.length > 0 && (
        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Últimas Calificaciones
            </CardTitle>
            <CardDescription>
              Historial de notas registradas ({calificaciones.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {calificaciones.slice(0, 20).map((calif) => {
                  const estudiante = estudiantes.find(e => e.id === calif.estudianteId);
                  const curso = cursos.find(c => c.id === calif.cursoId);
                  
                  return (
                    <div
                      key={calif.id}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">
                            {estudiante?.nombre} {estudiante?.apellido}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {curso?.nombre} - {calif.periodo}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(calif.fecha).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-3xl font-bold ${calif.nota >= 11 ? 'text-success' : 'text-destructive'}`}>
                            {calif.nota}
                          </p>
                          <Badge variant={calif.nota >= 11 ? "default" : "destructive"} className="mt-1">
                            {calif.nota >= 11 ? "Aprobado" : "Desaprobado"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Train;
