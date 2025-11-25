import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ManagementCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Actividades por Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
            Gráfico de actividades (integración con Recharts)
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Personas por Zona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
            Gráfico de distribución (integración con Recharts)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
