"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/shared/form-field"
import { FormSelect } from "@/components/shared/form-select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function PersonaForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    zone: "",
    address: "",
    status: "activo",
    commitment: "medio",
    notes: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Persona form submitted:", formData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/personas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nueva Persona</h1>
          <p className="text-muted-foreground">Registra una nueva ficha técnica</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Nombre Completo"
                placeholder="Ej: Juan García López"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <FormField
                label="Correo Electrónico"
                type="email"
                placeholder="ejemplo@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <FormField
                label="Teléfono"
                placeholder="311-555-0000"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              <FormSelect
                label="Zona"
                options={[
                  { value: "Centro", label: "Centro" },
                  { value: "Norte", label: "Norte" },
                  { value: "Sur", label: "Sur" },
                  { value: "Oriente", label: "Oriente" },
                  { value: "Occidente", label: "Occidente" },
                ]}
                value={formData.zone}
                onChange={(e) => handleChange("zone", e.target.value)}
              />
              <FormField
                label="Dirección"
                placeholder="Calle y número"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
              <FormSelect
                label="Estado"
                options={[
                  { value: "activo", label: "Activo" },
                  { value: "inactivo", label: "Inactivo" },
                  { value: "neutral", label: "Neutral" },
                ]}
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                label="Nivel de Compromiso"
                options={[
                  { value: "alto", label: "Alto" },
                  { value: "medio", label: "Medio" },
                  { value: "bajo", label: "Bajo" },
                ]}
                value={formData.commitment}
                onChange={(e) => handleChange("commitment", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Notas</label>
              <textarea
                placeholder="Añade observaciones o notas adicionales..."
                rows={4}
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Guardar Persona
              </Button>
              <Link href="/dashboard/personas">
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
