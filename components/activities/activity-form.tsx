"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/shared/form-field"
import { FormSelect } from "@/components/shared/form-select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function ActivityForm() {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    time: "",
    location: "",
    description: "",
    attendees: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Activity form submitted:", formData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/activities">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nueva Actividad</h1>
          <p className="text-muted-foreground">Registra una nueva actividad de campaña</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Detalles de la Actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Título de la Actividad"
                placeholder="Ej: Visita Barrial"
                required
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <FormSelect
                label="Tipo de Actividad"
                options={[
                  { value: "visita", label: "Visita" },
                  { value: "reunion", label: "Reunión" },
                  { value: "evento", label: "Evento" },
                  { value: "capacitacion", label: "Capacitación" },
                ]}
                required
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
              />
              <FormField
                label="Fecha"
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
              <FormField
                label="Hora"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
              />
              <FormField
                label="Ubicación"
                placeholder="Ej: Centro, Ciudad"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
              <FormField
                label="Asistentes Esperados"
                type="number"
                placeholder="0"
                value={formData.attendees}
                onChange={(e) => handleChange("attendees", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Descripción</label>
              <textarea
                placeholder="Describe los detalles de la actividad..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Guardar Actividad
              </Button>
              <Link href="/dashboard/activities">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
