"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Edit, Trash2, Loader2, ChevronLeft, ChevronRight, Shield } from "lucide-react"
import { usePersonas } from "@/lib/hooks/use-personas"
import { useCatalogos } from "@/lib/hooks/use-catalogos"
import { usePermisos } from "@/lib/hooks/use-permisos"
import { toast } from "sonner"
import type { Database } from "@/lib/supabase/database.types"
import { PermisosModal } from "./permisos-modal"

type Usuario = Database["public"]["Tables"]["usuarios"]["Row"]

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    activo: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    inactivo: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
    suspendido: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  }
  return colors[status] || colors.inactivo
}

export function PersonasTable() {
  const router = useRouter()
  const { listar, eliminar, loading: personasLoading } = usePersonas()
  const { ciudades, zonas, loading: catalogosLoading } = useCatalogos()
  const { permisos } = usePermisos("Módulo Personas")

  const [personas, setPersonas] = useState<Usuario[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Filtros
  const [search, setSearch] = useState("")
  const [estadoFilter, setEstadoFilter] = useState<string>("todos")
  const [ciudadFilter, setCiudadFilter] = useState<string>("todos")
  const [zonaFilter, setZonaFilter] = useState<string>("todos")

  // Estado para modal de permisos
  const [permisosModalOpen, setPermisosModalOpen] = useState(false)
  const [personaSeleccionada, setPersonaSeleccionada] = useState<Usuario | null>(null)

  // Estado para modal de imagen
  const [imagenModalOpen, setImagenModalOpen] = useState(false)
  const [imagenSeleccionadaUrl, setImagenSeleccionadaUrl] = useState<string | null>(null)

  const pageSize = 10

  useEffect(() => {
    cargarPersonas()
  }, [currentPage, search, estadoFilter, ciudadFilter, zonaFilter])

  async function cargarPersonas() {
    try {
      const filtros: any = {}

      if (search) filtros.busqueda = search
      if (estadoFilter !== "todos") filtros.estado = estadoFilter
      if (ciudadFilter !== "todos") filtros.ciudad_id = ciudadFilter
      if (zonaFilter !== "todos") filtros.zona_id = zonaFilter

      const result = await listar(filtros, currentPage, pageSize)

      setPersonas(result.data)
      setTotalCount(result.count)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error("Error cargando personas:", error)
      toast.error("Error al cargar personas")
    }
  }

  async function handleEliminar(id: string, nombre: string) {
    if (!confirm(`¿Estás seguro de eliminar a ${nombre}?`)) return

    try {
      await eliminar(id)
      toast.success("Persona eliminada exitosamente")
      cargarPersonas()
    } catch (error) {
      console.error("Error eliminando persona:", error)
      toast.error("Error al eliminar persona")
    }
  }

  function handleAbrirPermisos(persona: Usuario) {
    setPersonaSeleccionada(persona)
    setPermisosModalOpen(true)
  }
  
  function handleAbrirImagen(url: string) {
    setImagenSeleccionadaUrl(url)
    setImagenModalOpen(true)
  }

  const loading = personasLoading || catalogosLoading

  if (!permisos?.leer) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No tienes permisos para ver este módulo</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog>
      <div className="space-y-4">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, documento o email..."
              className="pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <Select
            value={estadoFilter}
            onValueChange={(value) => {
              setEstadoFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
              <SelectItem value="suspendido">Suspendido</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={ciudadFilter}
            onValueChange={(value) => {
              setCiudadFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ciudad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las ciudades</SelectItem>
              {ciudades.map((ciudad) => (
                <SelectItem key={ciudad.id} value={ciudad.id}>
                  {ciudad.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabla */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : personas.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                No se encontraron personas
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Foto
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Documento
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Nombre
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Contacto
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Ciudad
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Zona
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Estado
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {personas.map((persona) => (
                        <tr
                          key={persona.id}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            {persona.foto_perfil_url ? (
                              <DialogTrigger asChild>
                                <button onClick={() => handleAbrirImagen(persona.foto_perfil_url!)}>
                                  <Image
                                    src={persona.foto_perfil_url}
                                    alt={`Foto de ${persona.nombres}`}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover w-10 h-10 cursor-pointer"
                                  />
                                </button>
                              </DialogTrigger>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                Sin foto
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            <div>{persona.tipo_documento}</div>
                            <div className="text-xs text-muted-foreground">
                              {persona.numero_documento}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            {persona.nombres} {persona.apellidos}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            <div>{persona.celular || "-"}</div>
                            <div className="text-xs">{persona.email || "-"}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            {persona.ciudad_nombre || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            {persona.zona_nombre || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusColor(persona.estado)}>{persona.estado}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {permisos?.actualizar && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-8 h-8 text-muted-foreground hover:text-foreground"
                                  onClick={() => router.push(`/dashboard/personas/${persona.id}`)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                              {permisos?.administrar && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-8 h-8 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900"
                                  onClick={() => handleAbrirPermisos(persona)}
                                  title="Gestionar permisos"
                                >
                                  <Shield className="w-4 h-4" />
                                </Button>
                              )}
                              {permisos?.eliminar && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-8 h-8 text-destructive hover:bg-destructive/10"
                                  onClick={() =>
                                    handleEliminar(
                                      persona.id,
                                      `${persona.nombres} ${persona.apellidos}`
                                    )
                                  }
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {(currentPage - 1) * pageSize + 1} a{" "}
                    {Math.min(currentPage * pageSize, totalCount)} de {totalCount} personas
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Modal de permisos */}
        {personaSeleccionada && (
          <PermisosModal
            open={permisosModalOpen}
            onOpenChange={setPermisosModalOpen}
            persona={{
              id: personaSeleccionada.id,
              nombres: personaSeleccionada.nombres,
              apellidos: personaSeleccionada.apellidos,
            }}
          />
        )}
      </div>
      
      {/* Modal de Imagen */}
      <Dialog open={imagenModalOpen} onOpenChange={setImagenModalOpen}>
        <DialogContent className="max-w-xl">
          {imagenSeleccionadaUrl && (
            <Image
              src={imagenSeleccionadaUrl}
              alt="Foto de perfil ampliada"
              width={800}
              height={800}
              className="rounded-md object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
