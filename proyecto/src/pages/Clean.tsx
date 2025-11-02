import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useData, Curso } from "@/contexts/DataContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, BookOpen, Plus, GraduationCap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const Clean = () => {
  const navigate = useNavigate();
  const { cursos, addCurso, estudiantes } = useData();
  
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    creditos: '',
    profesor: '',
    horario: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.codigo || !formData.creditos) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    const nuevoCurso: Curso = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      codigo: formData.codigo,
      creditos: parseInt(formData.creditos),
      profesor: formData.profesor || undefined,
      horario: formData.horario || undefined
    };

    addCurso(nuevoCurso);
    toast.success(`Curso ${formData.nombre} agregado correctamente`);
    
    setFormData({
      nombre: '',
      codigo: '',
      creditos: '',
      profesor: '',
      horario: ''
    });
  };

  if (estudiantes.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Cursos</h1>
          <p className="text-muted-foreground">
            Administra los cursos del sistema escolar
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Gestión de Cursos</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Administra los cursos y materias del sistema escolar
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Agregar Curso
            </CardTitle>
            <CardDescription>
              Registra un nuevo curso o materia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Curso *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Matemáticas"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    placeholder="MAT-101"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditos">Créditos *</Label>
                  <Input
                    id="creditos"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.creditos}
                    onChange={(e) => setFormData({ ...formData, creditos: e.target.value })}
                    placeholder="3"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profesor">Profesor (opcional)</Label>
                <Input
                  id="profesor"
                  value={formData.profesor}
                  onChange={(e) => setFormData({ ...formData, profesor: e.target.value })}
                  placeholder="Prof. María García"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horario">Horario (opcional)</Label>
                <Input
                  id="horario"
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  placeholder="Lun-Mie-Vie 8:00-10:00"
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-primary shadow-glow-primary hover:shadow-glow-accent transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Curso
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-accent" />
              Estadísticas
            </CardTitle>
            <CardDescription>
              Resumen del sistema educativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold text-primary">{cursos.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Cursos</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold text-accent">{estudiantes.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Estudiantes</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Total de créditos disponibles:</p>
              <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-4xl font-bold text-primary">
                  {cursos.reduce((sum, curso) => sum + curso.creditos, 0)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Créditos</p>
              </div>
            </div>

            <Button 
              className="w-full mt-6 bg-gradient-primary shadow-glow-primary"
              onClick={() => navigate('/train')}
            >
              Asignar Calificaciones
            </Button>
          </CardContent>
        </Card>
      </div>

      {cursos.length > 0 && (
        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Lista de Cursos
            </CardTitle>
            <CardDescription>
              Total: {cursos.length} cursos registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="grid gap-4 md:grid-cols-2">
                {cursos.map((curso) => (
                  <div
                    key={curso.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-bold text-lg">{curso.nombre}</p>
                          <p className="text-sm text-muted-foreground">{curso.codigo}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{curso.creditos} créditos</Badge>
                    </div>
                    
                    {curso.profesor && (
                      <p className="text-sm text-muted-foreground mt-2">
                        👨‍🏫 {curso.profesor}
                      </p>
                    )}
                    
                    {curso.horario && (
                      <p className="text-sm text-muted-foreground mt-1">
                        🕐 {curso.horario}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Clean;
