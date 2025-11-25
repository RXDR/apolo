"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AgendaItem {
  date: string
  events: {
    title: string
    time: string
    type: "actividad" | "evento" | "reunion"
  }[]
}

const MOCK_AGENDA: AgendaItem[] = [
  {
    date: "2024-12-15",
    events: [
      { title: "Visita Barrial - Centro", time: "09:00", type: "actividad" },
      { title: "Reunión de Coordinadores", time: "14:00", type: "reunion" },
    ],
  },
  {
    date: "2024-12-16",
    events: [{ title: "Evento de Lanzamiento", time: "18:00", type: "evento" }],
  },
  {
    date: "2024-12-17",
    events: [
      { title: "Capacitación de Voluntarios", time: "10:00", type: "actividad" },
      { title: "Reunión con Líderes", time: "15:30", type: "reunion" },
    ],
  },
]

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    actividad: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    evento: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    reunion: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  }
  return colors[type] || colors.actividad
}

export function AgendaCalendar() {
  return (
    <div className="grid gap-4">
      {MOCK_AGENDA.map((agendaItem) => (
        <Card key={agendaItem.date} className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {new Date(agendaItem.date).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agendaItem.events.map((event, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold text-foreground">{event.time}</div>
                    <div>
                      <p className="text-foreground font-medium">{event.title}</p>
                    </div>
                  </div>
                  <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
