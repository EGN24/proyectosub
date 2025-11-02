import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Download, TrendingUp, Award, Users, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Results = () => {
  const navigate = useNavigate();
  const { estudiantes, cursos, calificaciones, generarReporte } = useData();
  const [selectedEstudiante, setSelectedEstudiante] = useState("");
  const [selectedPeriodo, setSelectedPeriodo] = useState("2024-1");
  
  if (estudiantes.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Reportes Académicos</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Visualiza notas, estadísticas y rendimiento académico
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No hay estudiantes registrados. Por favor registra estudiantes primero.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/upload')} className="bg-gradient-primary shadow-glow-primary">
          Ir a Registrar Estudiantes
        </Button>
      </div>
    );
  }

  // Calcular estadísticas generales
  const totalAprobados = calificaciones.filter(c => c.nota >= 11).length;
  const totalDesaprobados = calificaciones.filter(c => c.nota < 11).length;
  const promedioGeneral = calificaciones.length > 0
    ? calificaciones.reduce((sum, c) => sum + c.nota, 0) / calificaciones.length
    : 0;

  // Datos para gráfico de distribución de notas
  const distribucionNotas = [
    { rango: '0-5', cantidad: calificaciones.filter(c => c.nota >= 0 && c.nota < 5).length },
    { rango: '5-10', cantidad: calificaciones.filter(c => c.nota >= 5 && c.nota < 10).length },
    { rango: '10-11', cantidad: calificaciones.filter(c => c.nota >= 10 && c.nota < 11).length },
    { rango: '11-14', cantidad: calificaciones.filter(c => c.nota >= 11 && c.nota < 14).length },
    { rango: '14-17', cantidad: calificaciones.filter(c => c.nota >= 14 && c.nota < 17).length },
    { rango: '17-20', cantidad: calificaciones.filter(c => c.nota >= 17 && c.nota <= 20).length },
  ];

  // Datos para gráfico circular
  const pieData = [
    { name: 'Aprobados', value: totalAprobados, color: 'hsl(var(--success))' },
    { name: 'Desaprobados', value: totalDesaprobados, color: 'hsl(var(--destructive))' }
  ];

  // Rendimiento por estudiante
  const rendimientoPorEstudiante = estudiantes.map(est => {
    const notasEst = calificaciones.filter(c => c.estudianteId === est.id);
    const promedio = notasEst.length > 0
      ? notasEst.reduce((sum, c) => sum + c.nota, 0) / notasEst.length
      : 0;
    return {
      nombre: `${est.nombre} ${est.apellido}`,
      promedio: Math.round(promedio * 10) / 10,
      aprobados: notasEst.filter(c => c.nota >= 11).length,
      desaprobados: notasEst.filter(c => c.nota < 11).length
    };
  }).slice(0, 10);

  // Rendimiento por curso
  const rendimientoPorCurso = cursos.map(curso => {
    const notasCurso = calificaciones.filter(c => c.cursoId === curso.id);
    const promedio = notasCurso.length > 0
      ? notasCurso.reduce((sum, c) => sum + c.nota, 0) / notasCurso.length
      : 0;
    return {
      nombre: curso.nombre,
      promedio: Math.round(promedio * 10) / 10,
      estudiantes: notasCurso.length
    };
  });

  const CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  const handleGenerarReporte = () => {
    if (!selectedEstudiante) {
      return;
    }
    const reporte = generarReporte(selectedEstudiante, selectedPeriodo);
    const estudiante = estudiantes.find(e => e.id === selectedEstudiante);
    
    const dataStr = JSON.stringify(reporte, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-${estudiante?.nombre}-${selectedPeriodo}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Reportes Académicos</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Análisis completo del rendimiento académico y estadísticas
        </p>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm hover:shadow-glow-primary transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Estudiantes
              <Users className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gradient">{estudiantes.length}</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm hover:shadow-glow-primary transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Cursos
              <BookOpen className="h-4 w-4 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gradient">{cursos.length}</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm hover:shadow-glow-primary transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Promedio General
              <TrendingUp className="h-4 w-4 text-success" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gradient">{promedioGeneral.toFixed(1)}</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm hover:shadow-glow-primary transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Calificaciones
              <Award className="h-4 w-4 text-warning" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gradient">{calificaciones.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Distribución de Notas */}
        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Distribución de Notas
            </CardTitle>
            <CardDescription>
              Cantidad de estudiantes por rango de calificación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribucionNotas}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="rango" 
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="cantidad" name="Estudiantes" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Aprobados vs Desaprobados */}
        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Aprobados vs Desaprobados
            </CardTitle>
            <CardDescription>
              Porcentaje de aprobación general
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => 
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Rendimiento por Estudiante */}
      {rendimientoPorEstudiante.length > 0 && (
        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-success" />
              Rendimiento por Estudiante (Top 10)
            </CardTitle>
            <CardDescription>
              Promedio de calificaciones por estudiante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={rendimientoPorEstudiante} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 20]} stroke="hsl(var(--muted-foreground))" />
                <YAxis 
                  type="category" 
                  dataKey="nombre" 
                  stroke="hsl(var(--muted-foreground))"
                  width={150}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="promedio" name="Promedio" fill="hsl(var(--chart-2))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Rendimiento por Curso */}
      {rendimientoPorCurso.length > 0 && (
        <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-warning" />
              Rendimiento por Curso
            </CardTitle>
            <CardDescription>
              Promedio de calificaciones por materia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rendimientoPorCurso}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="nombre" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 11 }}
                />
                <YAxis domain={[0, 20]} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="promedio" 
                  name="Promedio"
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-3))', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Estudiantes Aprobados y Desaprobados */}
      <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Estudiantes por Estado Académico
          </CardTitle>
          <CardDescription>
            Visualiza estudiantes aprobados y desaprobados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todos ({estudiantes.length})</TabsTrigger>
              <TabsTrigger value="aprobados">
                Aprobados ({estudiantes.filter(est => {
                  const notasEst = calificaciones.filter(c => c.estudianteId === est.id);
                  const aprobados = notasEst.filter(c => c.nota >= 11).length;
                  const desaprobados = notasEst.filter(c => c.nota < 11).length;
                  return aprobados > desaprobados;
                }).length})
              </TabsTrigger>
              <TabsTrigger value="desaprobados">
                Desaprobados ({estudiantes.filter(est => {
                  const notasEst = calificaciones.filter(c => c.estudianteId === est.id);
                  const aprobados = notasEst.filter(c => c.nota >= 11).length;
                  const desaprobados = notasEst.filter(c => c.nota < 11).length;
                  return desaprobados >= aprobados;
                }).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {estudiantes.map((estudiante) => {
                    const notasEst = calificaciones.filter(c => c.estudianteId === estudiante.id);
                    const promedio = notasEst.length > 0
                      ? notasEst.reduce((sum, c) => sum + c.nota, 0) / notasEst.length
                      : 0;
                    const aprobados = notasEst.filter(c => c.nota >= 11).length;
                    const desaprobados = notasEst.filter(c => c.nota < 11).length;

                    return (
                      <div
                        key={estudiante.id}
                        className="p-4 border border-border rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-lg">
                              {estudiante.nombre} {estudiante.apellido}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {estudiante.grado} • {estudiante.edad} años
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-primary">
                              {promedio.toFixed(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">Promedio</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-muted/50 rounded">
                            <p className="text-xl font-bold">{notasEst.length}</p>
                            <p className="text-xs text-muted-foreground">Cursos</p>
                          </div>
                          <div className="text-center p-3 bg-success/10 rounded border border-success/20">
                            <p className="text-xl font-bold text-success">{aprobados}</p>
                            <p className="text-xs text-muted-foreground">Aprobados</p>
                          </div>
                          <div className="text-center p-3 bg-destructive/10 rounded border border-destructive/20">
                            <p className="text-xl font-bold text-destructive">{desaprobados}</p>
                            <p className="text-xs text-muted-foreground">Desaprobados</p>
                          </div>
                        </div>

                        {notasEst.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {notasEst.slice(0, 5).map((nota) => {
                              const curso = cursos.find(c => c.id === nota.cursoId);
                              return (
                                <Badge
                                  key={nota.id}
                                  variant={nota.nota >= 11 ? "default" : "destructive"}
                                >
                                  {curso?.nombre}: {nota.nota}
                                </Badge>
                              );
                            })}
                            {notasEst.length > 5 && (
                              <Badge variant="outline">+{notasEst.length - 5} más</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="aprobados" className="mt-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {estudiantes.filter(est => {
                    const notasEst = calificaciones.filter(c => c.estudianteId === est.id);
                    const aprobados = notasEst.filter(c => c.nota >= 11).length;
                    const desaprobados = notasEst.filter(c => c.nota < 11).length;
                    return aprobados > desaprobados;
                  }).map((estudiante) => {
                    const notasEst = calificaciones.filter(c => c.estudianteId === estudiante.id);
                    const promedio = notasEst.length > 0
                      ? notasEst.reduce((sum, c) => sum + c.nota, 0) / notasEst.length
                      : 0;
                    const aprobados = notasEst.filter(c => c.nota >= 11).length;
                    const desaprobados = notasEst.filter(c => c.nota < 11).length;

                    return (
                      <div
                        key={estudiante.id}
                        className="p-4 border border-success/50 bg-success/5 rounded-lg hover:bg-success/10 hover:border-success transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-lg">
                              {estudiante.nombre} {estudiante.apellido}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {estudiante.grado} • {estudiante.edad} años
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-success">
                              {promedio.toFixed(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">Promedio</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-muted/50 rounded">
                            <p className="text-xl font-bold">{notasEst.length}</p>
                            <p className="text-xs text-muted-foreground">Cursos</p>
                          </div>
                          <div className="text-center p-3 bg-success/20 rounded border border-success">
                            <p className="text-xl font-bold text-success">{aprobados}</p>
                            <p className="text-xs text-muted-foreground">Aprobados</p>
                          </div>
                          <div className="text-center p-3 bg-destructive/10 rounded border border-destructive/20">
                            <p className="text-xl font-bold text-destructive">{desaprobados}</p>
                            <p className="text-xs text-muted-foreground">Desaprobados</p>
                          </div>
                        </div>

                        {notasEst.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {notasEst.slice(0, 5).map((nota) => {
                              const curso = cursos.find(c => c.id === nota.cursoId);
                              return (
                                <Badge
                                  key={nota.id}
                                  variant={nota.nota >= 11 ? "default" : "destructive"}
                                >
                                  {curso?.nombre}: {nota.nota}
                                </Badge>
                              );
                            })}
                            {notasEst.length > 5 && (
                              <Badge variant="outline">+{notasEst.length - 5} más</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {estudiantes.filter(est => {
                    const notasEst = calificaciones.filter(c => c.estudianteId === est.id);
                    const aprobados = notasEst.filter(c => c.nota >= 11).length;
                    const desaprobados = notasEst.filter(c => c.nota < 11).length;
                    return aprobados > desaprobados;
                  }).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay estudiantes aprobados
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="desaprobados" className="mt-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {estudiantes.filter(est => {
                    const notasEst = calificaciones.filter(c => c.estudianteId === est.id);
                    const aprobados = notasEst.filter(c => c.nota >= 11).length;
                    const desaprobados = notasEst.filter(c => c.nota < 11).length;
                    return desaprobados >= aprobados;
                  }).map((estudiante) => {
                    const notasEst = calificaciones.filter(c => c.estudianteId === estudiante.id);
                    const promedio = notasEst.length > 0
                      ? notasEst.reduce((sum, c) => sum + c.nota, 0) / notasEst.length
                      : 0;
                    const aprobados = notasEst.filter(c => c.nota >= 11).length;
                    const desaprobados = notasEst.filter(c => c.nota < 11).length;

                    return (
                      <div
                        key={estudiante.id}
                        className="p-4 border border-destructive/50 bg-destructive/5 rounded-lg hover:bg-destructive/10 hover:border-destructive transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-lg">
                              {estudiante.nombre} {estudiante.apellido}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {estudiante.grado} • {estudiante.edad} años
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-destructive">
                              {promedio.toFixed(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">Promedio</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-muted/50 rounded">
                            <p className="text-xl font-bold">{notasEst.length}</p>
                            <p className="text-xs text-muted-foreground">Cursos</p>
                          </div>
                          <div className="text-center p-3 bg-success/10 rounded border border-success/20">
                            <p className="text-xl font-bold text-success">{aprobados}</p>
                            <p className="text-xs text-muted-foreground">Aprobados</p>
                          </div>
                          <div className="text-center p-3 bg-destructive/20 rounded border border-destructive">
                            <p className="text-xl font-bold text-destructive">{desaprobados}</p>
                            <p className="text-xs text-muted-foreground">Desaprobados</p>
                          </div>
                        </div>

                        {notasEst.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {notasEst.slice(0, 5).map((nota) => {
                              const curso = cursos.find(c => c.id === nota.cursoId);
                              return (
                                <Badge
                                  key={nota.id}
                                  variant={nota.nota >= 11 ? "default" : "destructive"}
                                >
                                  {curso?.nombre}: {nota.nota}
                                </Badge>
                              );
                            })}
                            {notasEst.length > 5 && (
                              <Badge variant="outline">+{notasEst.length - 5} más</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {estudiantes.filter(est => {
                    const notasEst = calificaciones.filter(c => c.estudianteId === est.id);
                    const aprobados = notasEst.filter(c => c.nota >= 11).length;
                    const desaprobados = notasEst.filter(c => c.nota < 11).length;
                    return desaprobados >= aprobados;
                  }).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay estudiantes desaprobados
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Generar Reporte Individual */}
      <Card className="border-border bg-gradient-card shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Generar Reporte Individual
          </CardTitle>
          <CardDescription>
            Descarga el reporte académico de un estudiante específico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estudiante</Label>
              <Select value={selectedEstudiante} onValueChange={setSelectedEstudiante}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estudiante" />
                </SelectTrigger>
                <SelectContent>
                  {estudiantes.map((est) => (
                    <SelectItem key={est.id} value={est.id}>
                      {est.nombre} {est.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Periodo</Label>
              <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-1">2024 - I Bimestre</SelectItem>
                  <SelectItem value="2024-2">2024 - II Bimestre</SelectItem>
                  <SelectItem value="2024-3">2024 - III Bimestre</SelectItem>
                  <SelectItem value="2024-4">2024 - IV Bimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            className="w-full bg-gradient-primary shadow-glow-primary hover:shadow-glow-accent transition-all duration-300"
            onClick={handleGenerarReporte}
            disabled={!selectedEstudiante}
          >
            <Download className="mr-2 h-4 w-4" />
            Generar y Descargar Reporte
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
