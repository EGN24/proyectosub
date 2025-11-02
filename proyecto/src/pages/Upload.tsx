import { useState } from "react";
import { UserPlus, Users, Check, Loader2, History, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useData, Estudiante } from "@/contexts/DataContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileUploader } from "@/components/FileUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Upload = () => {
  const navigate = useNavigate();
  const { addEstudiante, deleteEstudiante, estudiantes } = useData();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    grado: '',
    email: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.apellido || !formData.edad || !formData.grado) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsProcessing(true);

    const nuevoEstudiante: Estudiante = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      apellido: formData.apellido,
      edad: parseInt(formData.edad),
      grado: formData.grado,
      email: formData.email || undefined
    };

    addEstudiante(nuevoEstudiante);
    toast.success(`Estudiante ${formData.nombre} ${formData.apellido} registrado correctamente`);
    
    setFormData({
      nombre: '',
      apellido: '',
      edad: '',
      grado: '',
      email: ''
    });
    
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Gestión de Estudiantes</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Registra estudiantes manualmente o mediante carga masiva de archivos
        </p>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="manual">Registro Manual</TabsTrigger>
          <TabsTrigger value="file">Carga Masiva</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm hover:shadow-glow-primary transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Registrar Estudiante
            </CardTitle>
            <CardDescription>
              Ingresa los datos del nuevo estudiante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Juan"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  placeholder="Pérez"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edad">Edad *</Label>
                  <Input
                    id="edad"
                    type="number"
                    min="5"
                    max="25"
                    value={formData.edad}
                    onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                    placeholder="15"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grado">Grado *</Label>
                  <Select value={formData.grado} onValueChange={(value) => setFormData({ ...formData, grado: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1° Primaria">1° Primaria</SelectItem>
                      <SelectItem value="2° Primaria">2° Primaria</SelectItem>
                      <SelectItem value="3° Primaria">3° Primaria</SelectItem>
                      <SelectItem value="4° Primaria">4° Primaria</SelectItem>
                      <SelectItem value="5° Primaria">5° Primaria</SelectItem>
                      <SelectItem value="6° Primaria">6° Primaria</SelectItem>
                      <SelectItem value="1° Secundaria">1° Secundaria</SelectItem>
                      <SelectItem value="2° Secundaria">2° Secundaria</SelectItem>
                      <SelectItem value="3° Secundaria">3° Secundaria</SelectItem>
                      <SelectItem value="4° Secundaria">4° Secundaria</SelectItem>
                      <SelectItem value="5° Secundaria">5° Secundaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="estudiante@email.com"
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-primary shadow-glow-primary hover:shadow-glow-accent transition-all duration-300"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Registrar Estudiante
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Resumen
            </CardTitle>
            <CardDescription>
              Estadísticas del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold text-primary">{estudiantes.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Estudiantes</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold text-accent">
                  {new Set(estudiantes.map(e => e.grado)).size}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Grados</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Distribución por grado:</p>
              <ScrollArea className="h-[200px]">
                {Array.from(new Set(estudiantes.map(e => e.grado))).map((grado) => (
                  <div key={grado} className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                    <span className="text-sm">{grado}</span>
                    <Badge variant="secondary">
                      {estudiantes.filter(e => e.grado === grado).length} estudiantes
                    </Badge>
                  </div>
                ))}
              </ScrollArea>
            </div>

            <Button 
              className="w-full bg-gradient-primary shadow-glow-primary"
              onClick={() => navigate('/clean')}
            >
              Gestionar Cursos
            </Button>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="file" className="space-y-6">
          <FileUploader onUploadComplete={() => {
            toast.success('Datos cargados. Revisa los reportes para ver gráficos actualizados.');
          }} />
        </TabsContent>
      </Tabs>

      {estudiantes.length > 0 && (
        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <CardTitle>Lista de Estudiantes</CardTitle>
            </div>
            <CardDescription>
              Total: {estudiantes.length} estudiantes registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {estudiantes.map((estudiante) => (
                  <div
                    key={estudiante.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Users className="w-5 h-5 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-lg">
                            {estudiante.nombre} {estudiante.apellido}
                          </p>
                          <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                            <span>Edad: {estudiante.edad}</span>
                            <span>•</span>
                            <span>{estudiante.grado}</span>
                          </div>
                          {estudiante.email && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {estudiante.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigate('/train');
                          }}
                        >
                          Ver Notas
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEstudiante(estudiante.id);
                            toast.success('Estudiante eliminado');
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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

export default Upload;
