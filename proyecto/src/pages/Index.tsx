import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, ClipboardCheck, TrendingUp, Calendar } from "lucide-react";

const Index = () => {
  const stats = [
    { label: "Estudiantes", value: "856", icon: Users, trend: "+45 este mes" },
    { label: "Profesores", value: "48", icon: GraduationCap, trend: "+3 este mes" },
    { label: "Cursos Activos", value: "32", icon: BookOpen, trend: "8 materias" },
    { label: "Asistencia", value: "94%", icon: TrendingUp, trend: "+2% mejora" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Dashboard Escolar
        </h1>
        <p className="text-muted-foreground">
          Sistema de Gestión Educativa - Bienvenido
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border bg-card shadow-lg hover:shadow-glow-primary transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>{stat.label}</CardDescription>
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card shadow-lg">
          <CardHeader>
            <CardTitle>Acceso Rápido</CardTitle>
            <CardDescription>
              Gestiona tu institución educativa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="/upload" className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors group">
              <Users className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
              <div>
                <div className="font-medium">Estudiantes</div>
                <div className="text-sm text-muted-foreground">Gestionar alumnos matriculados</div>
              </div>
            </a>
            <a href="/clean" className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors group">
              <GraduationCap className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
              <div>
                <div className="font-medium">Profesores</div>
                <div className="text-sm text-muted-foreground">Administrar personal docente</div>
              </div>
            </a>
            <a href="/train" className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors group">
              <BookOpen className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
              <div>
                <div className="font-medium">Cursos y Materias</div>
                <div className="text-sm text-muted-foreground">Gestionar plan académico</div>
              </div>
            </a>
            <a href="/results" className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors group">
              <ClipboardCheck className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
              <div>
                <div className="font-medium">Calificaciones</div>
                <div className="text-sm text-muted-foreground">Registrar y consultar notas</div>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-lg">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas acciones en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { action: "María López - Nueva matrícula registrada", time: "Hace 30 minutos", status: "success" },
              { action: "Prof. García - Calificaciones cargadas 3°A", time: "Hace 2 horas", status: "success" },
              { action: "Asistencia del día - 94% presentes", time: "Hace 3 horas", status: "success" },
              { action: "Reunión padres programada - Viernes 15:00", time: "Hace 1 día", status: "progress" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-accent' : 'bg-primary'}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.action}</div>
                  <div className="text-xs text-muted-foreground">{item.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
