"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

interface Persona {
  id: string
  name: string
  phone: string
  email: string
  zone: string
  status: "activo" | "inactivo" | "neutral"
  commitment: "alto" | "medio" | "bajo"
}

const MOCK_PERSONAS: Persona[] = [
  {
    id: "1",
    name: "Juan García López",
    phone: "311-555-0001",
    email: "juan@email.com",
    zone: "Centro",
    status: "activo",
    commitment: "alto",
  },
  {
    id: "2",
    name: "María Rodríguez Martínez",
    phone: "311-555-0002",
    email: "maria@email.com",
    zone: "Norte",
    status: "activo",
    commitment: "medio",
  },
  {
    id: "3",
    name: "Carlos Pérez González",
    phone: "311-555-0003",
    email: "carlos@email.com",
    zone: "Sur",
    status: "inactivo",
    commitment: "bajo",
  },
  {
    id: "4",
    name: "Ana Martínez Silva",
    phone: "311-555-0004",
    email: "ana@email.com",
    zone: "Oriente",
    status: "activo",
    commitment: "alto",
  },
]

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    activo: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    inactivo: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
    neutral: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  }
  return colors[status] || colors.neutral
}

const getCommitmentColor = (commitment: string) => {
  const colors: Record<string, string> = {
    alto: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    medio: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    bajo: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  }
  return colors[commitment] || colors.medio
}

export function PersonasTable() {
  const [search, setSearch] = useState("")

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, teléfono o email..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contacto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Zona</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Compromiso</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PERSONAS.map((persona) => (
                  <tr key={persona.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">{persona.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <div>{persona.phone}</div>
                      <div className="text-xs">{persona.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{persona.zone}</td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(persona.status)}>{persona.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getCommitmentColor(persona.commitment)}>{persona.commitment}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
