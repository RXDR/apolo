"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Loader2, Save, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { usePersonas } from "@/lib/hooks/use-personas"
import { useUsuario } from "@/lib/hooks/use-usuario"

import { DatosPersonalesSection } from "./form-sections/datos-personales"
import { UbicacionSection } from "./form-sections/ubicacion"
import { ContactoSection } from "./form-sections/contacto"
import { DatosDemograficosSection } from "./form-sections/datos-demograficos"
import { RedesSocialesSection } from "./form-sections/redes-sociales"
import { ReferenciasSection } from "./form-sections/referencias"
import { CompromisosSection } from "./form-sections/compromisos"

// Esquema de validación completo
const personaSchema = z.object({
  // Datos Personales
  nombres: z.string().min(2, "El nombre es requerido"),
  apellidos: z.string().min(2, "El apellido es requerido"),
  tipo_documento: z.string().min(1, "Tipo de documento requerido"),
  numero_documento: z.string().min(5, "Número de documento requerido"),
  fecha_nacimiento: z.string().optional(),
  genero: z.string().optional(),
  estado_civil: z.string().optional(),

  // Ubicación
  direccion: z.string().optional(),
  ciudad_id: z.string().optional(),
  localidad_id: z.string().optional(),
  barrio_id: z.string().optional(),
  zona_id: z.string().optional(),
  puesto_votacion_id: z.string().optional(),
  mesa_votacion: z.string().optional(),

  // Contacto
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  celular: z.string().optional(),
  telefono_fijo: z.string().optional(),
  whatsapp: z.string().optional(),

  // Datos Demográficos
  nivel_escolaridad: z.string().optional(),
  perfil_ocupacion: z.string().optional(),
  tipo_vivienda: z.string().optional(),
  estrato: z.string().optional(),
  ingresos_rango: z.string().optional(),
  tiene_hijos: z.boolean().default(false),
  numero_hijos: z.coerce.number().optional(),

  // Redes Sociales
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  tiktok: z.string().optional(),

  // Referencias
  referido_por: z.string().optional(),
  tipo_referencia_id: z.string().optional(),
  lider_responsable: z.string().optional(),

  // Compromisos
  compromiso_cautivo: z.coerce.number().min(0).default(0),
  compromiso_impacto: z.coerce.number().min(0).default(0),
  compromiso_marketing: z.coerce.number().min(0).default(0),
  compromiso_privado: z.string().optional(),
  observaciones: z.string().optional(),
})

type PersonaFormValues = z.infer<typeof personaSchema>

interface PersonaFormProps {
  initialData?: any // Tipo Usuario de Supabase
  isEditing?: boolean
}

const SECTIONS = [
  { id: "datos-personales", label: "Datos Personales" },
  { id: "ubicacion", label: "Ubicación" },
  { id: "contacto", label: "Contacto" },
  { id: "demograficos", label: "Datos Demográficos" },
  { id: "redes", label: "Redes Sociales" },
  { id: "referencias", label: "Referencias" },
  { id: "compromisos", label: "Compromisos" },
]

export function PersonaForm({ initialData, isEditing = false }: PersonaFormProps) {
  const router = useRouter()
  const { crear, actualizar } = usePersonas()
  const { usuario: usuarioActual } = useUsuario()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const activeTab = SECTIONS[activeTabIndex].id

  const form = useForm<PersonaFormValues>({
    resolver: zodResolver(personaSchema),
    defaultValues: initialData || {
      nombres: "",
      apellidos: "",
      tipo_documento: "Cédula",
      numero_documento: "",
      compromiso_cautivo: 0,
      compromiso_impacto: 0,
      compromiso_marketing: 0,
    },
  })

  const handleNext = () => {
    if (activeTabIndex < SECTIONS.length - 1) {
      setActiveTabIndex(activeTabIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (activeTabIndex > 0) {
      setActiveTabIndex(activeTabIndex - 1)
    }
  }

  async function onSubmit(data: PersonaFormValues) {
    try {
      setIsSubmitting(true)

      // Preparar datos para enviar
      const personaData = {
        ...data,
        // Campos de auditoría
        actualizado_por: usuarioActual?.id,
      }

      if (isEditing && initialData?.id) {
        await actualizar(initialData.id, personaData)
        toast.success("Persona actualizada correctamente")
      } else {
        await crear({
          ...personaData,
          creado_por: usuarioActual?.id,
          estado: "activo",
        })
        toast.success("Persona creada correctamente")
      }

      router.push("/dashboard/personas")
      router.refresh()
    } catch (error) {
      console.error("Error al guardar persona:", error)
      toast.error("Error al guardar la persona")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? "Editar Persona" : "Nueva Persona"}
          </h2>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Navegación lateral de secciones */}
          <div className="md:col-span-3 space-y-2">
            <Card>
              <CardContent className="p-2">
                <nav className="flex flex-col space-y-1">
                  {SECTIONS.map((item, index) => (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "secondary" : "ghost"}
                      className="justify-start w-full"
                      onClick={() => setActiveTabIndex(index)}
                      type="button"
                    >
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenido del formulario */}
          <div className="md:col-span-9 space-y-6">
            <Card>
              <CardContent className="p-6">
                {/* Aquí irán los componentes de cada sección */}
                <div className={activeTab === "datos-personales" ? "block" : "hidden"}>
                  <h3 className="text-lg font-medium mb-4">Datos Personales</h3>
                  <DatosPersonalesSection form={form} />
                </div>

                <div className={activeTab === "ubicacion" ? "block" : "hidden"}>
                  <h3 className="text-lg font-medium mb-4">Ubicación</h3>
                  <UbicacionSection form={form} />
                </div>

                <div className={activeTab === "contacto" ? "block" : "hidden"}>
                  <h3 className="text-lg font-medium mb-4">Información de Contacto</h3>
                  <ContactoSection form={form} />
                </div>

                <div className={activeTab === "demograficos" ? "block" : "hidden"}>
                  <h3 className="text-lg font-medium mb-4">Datos Demográficos</h3>
                  <DatosDemograficosSection form={form} />
                </div>

                <div className={activeTab === "redes" ? "block" : "hidden"}>
                  <h3 className="text-lg font-medium mb-4">Redes Sociales</h3>
                  <RedesSocialesSection form={form} />
                </div>

                <div className={activeTab === "referencias" ? "block" : "hidden"}>
                  <h3 className="text-lg font-medium mb-4">Referencias</h3>
                  <ReferenciasSection form={form} />
                </div>

                <div className={activeTab === "compromisos" ? "block" : "hidden"}>
                  <h3 className="text-lg font-medium mb-4">Compromisos y Observaciones</h3>
                  <CompromisosSection form={form} />
                </div>

                {/* Botones de navegación */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={activeTabIndex === 0}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    {activeTabIndex + 1} de {SECTIONS.length}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleNext}
                    disabled={activeTabIndex === SECTIONS.length - 1}
                  >
                    Siguiente
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}
