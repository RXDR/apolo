"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, X, UserPlus, Users, Shield, Handshake, UserCheck } from "lucide-react"
import { useMilitantes } from "@/lib/hooks/use-militantes"
import { usePersonas } from "@/lib/hooks/use-personas"
import { useCoordinadores } from "@/lib/hooks/use-coordinadores"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"

// Esquema de validación
const militanteSchema = z.object({
    usuario_id: z.string().min(1, "Debe seleccionar una persona"),
    tipo: z.string().min(1, "Debe seleccionar un tipo de militante"),
    coordinador_id: z.string().optional(),
    compromiso_marketing: z.string().optional(),
    compromiso_cautivo: z.string().optional(),
    compromiso_impacto: z.string().optional(),
    formulario: z.string().optional(),
    perfil_id: z.string().optional(),
})

type MilitanteFormValues = z.infer<typeof militanteSchema>

interface MilitanteFormProps {
    initialData?: any
    isEditing?: boolean
}

export function MilitanteForm({ initialData, isEditing = false }: MilitanteFormProps) {
    const router = useRouter()
    const { crear, actualizar, loading } = useMilitantes()
    const { buscarReferentes } = usePersonas()
    const { buscarCoordinadores } = useCoordinadores()
    const [submitting, setSubmitting] = useState(false)

    // Estados para los combobox
    const [openPersona, setOpenPersona] = useState(false)
    const [personasSearch, setPersonasSearch] = useState("")
    const [personas, setPersonas] = useState<any[]>([])
    const [loadingPersonas, setLoadingPersonas] = useState(false)

    const [openCoordinador, setOpenCoordinador] = useState(false)
    const [coordinadoresSearch, setCoordinadoresSearch] = useState("")
    const [coordinadores, setCoordinadores] = useState<any[]>([])
    const [loadingCoordinadores, setLoadingCoordinadores] = useState(false)

    const [perfiles, setPerfiles] = useState<any[]>([])

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<MilitanteFormValues>({
        resolver: zodResolver(militanteSchema),
        defaultValues: initialData || {
            usuario_id: "",
            tipo: "",
            coordinador_id: "",
            compromiso_marketing: "",
            compromiso_cautivo: "",
            compromiso_impacto: "",
            formulario: "",
            perfil_id: "",
        },
    })

    const usuario_id = watch("usuario_id")
    const coordinador_id = watch("coordinador_id")

    // Cargar perfiles
    useEffect(() => {
        async function cargarPerfiles() {
            const { data } = await supabase.from("perfiles").select("*").eq("activo", true).order("nombre")
            if (data) setPerfiles(data)
        }
        cargarPerfiles()
    }, [])

    // Buscar personas
    useEffect(() => {
        if (personasSearch.length < 3) {
            setPersonas([])
            return
        }

        const timer = setTimeout(async () => {
            setLoadingPersonas(true)
            const results = await buscarReferentes(personasSearch)
            setPersonas(results)
            setLoadingPersonas(false)
        }, 300)

        return () => clearTimeout(timer)
    }, [personasSearch, buscarReferentes])

    // Buscar coordinadores
    useEffect(() => {
        if (coordinadoresSearch.length < 3) {
            setCoordinadores([])
            return
        }

        const timer = setTimeout(async () => {
            setLoadingCoordinadores(true)
            try {
                const results = await buscarCoordinadores(coordinadoresSearch)
                setCoordinadores(results || [])
            } catch (error) {
                console.error("Error buscando coordinadores:", error)
                setCoordinadores([])
            } finally {
                setLoadingCoordinadores(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [coordinadoresSearch, buscarCoordinadores])

    async function onSubmit(data: MilitanteFormValues) {
        try {
            setSubmitting(true)

            if (isEditing && initialData?.id) {
                await actualizar(initialData.id, {
                    tipo: data.tipo,
                    coordinador_id: data.coordinador_id || undefined,
                    compromiso_marketing: data.compromiso_marketing || undefined,
                    compromiso_cautivo: data.compromiso_cautivo || undefined,
                    compromiso_impacto: data.compromiso_impacto || undefined,
                    formulario: data.formulario || undefined,
                    perfil_id: data.perfil_id || undefined,
                })
                toast.success("Militante actualizado exitosamente")
            } else {
                await crear(data)
                toast.success("Militante creado exitosamente")
            }

            router.push("/dashboard/militante")
        } catch (error) {
            console.error("Error guardando militante:", error)
            toast.error(error instanceof Error ? error.message : "Error al guardar militante")
        } finally {
            setSubmitting(false)
        }
    }

    const personaSeleccionada = personas.find(p => p.id === usuario_id)
    const coordinadorSeleccionado = coordinadores.find(c => c.coordinador_id === coordinador_id)

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="border-none shadow-none">
                <CardHeader className="px-0 pt-0">
                    <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-2xl text-primary">Información Militante</CardTitle>
                        <UserPlus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <CardDescription>
                        Seleccione la persona de la lista, si desea agregar un militante nuevo debe agregarlo primero a la base de datos de Personas
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* COLUMNA IZQUIERDA */}
                        <div className="space-y-6">
                            {/* Seleccione la Persona */}
                            <div className="space-y-2">
                                <Label className="text-muted-foreground font-normal">Seleccione la Persona</Label>
                                <Popover open={openPersona} onOpenChange={setOpenPersona}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openPersona}
                                            className="w-full justify-between border-x-0 border-t-0 border-b rounded-none px-0 hover:bg-transparent shadow-none"
                                        >
                                            <span className={cn("text-base", !usuario_id && "text-muted-foreground")}>
                                                {usuario_id
                                                    ? (personas.find(p => p.id === usuario_id)?.nombres + ' ' + personas.find(p => p.id === usuario_id)?.apellidos || "Persona seleccionada")
                                                    : "[-- Seleccione la Persona --]"}
                                            </span>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0" align="start">
                                        <Command shouldFilter={false}>
                                            <CommandInput
                                                placeholder="Buscar por nombre o cédula..."
                                                value={personasSearch}
                                                onValueChange={setPersonasSearch}
                                            />
                                            <CommandEmpty>
                                                {loadingPersonas ? "Buscando..." : "No se encontraron personas"}
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {personas.map((persona) => (
                                                    <CommandItem
                                                        key={persona.id}
                                                        value={`${persona.nombres} ${persona.apellidos} ${persona.numero_documento}`}
                                                        onSelect={() => {
                                                            setValue("usuario_id", persona.id)
                                                            setOpenPersona(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                usuario_id === persona.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {persona.nombres} {persona.apellidos}
                                                        <span className="ml-2 text-xs text-muted-foreground">
                                                            {persona.numero_documento}
                                                        </span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {errors.usuario_id && (
                                    <p className="text-sm text-destructive">{errors.usuario_id.message}</p>
                                )}
                            </div>

                            {/* Tipo Militante */}
                            <div className="space-y-2 pt-4">
                                <Label className="text-muted-foreground font-normal">Tipo Militante</Label>
                                <Select
                                    onValueChange={(value) => setValue("tipo", value)}
                                    defaultValue={initialData?.tipo || ""}
                                >
                                    <SelectTrigger className="w-full border-x-0 border-t-0 border-b rounded-none px-0 shadow-none focus:ring-0">
                                        <SelectValue placeholder="[---- Tipo Militante ]" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Militante Base">Militante Base</SelectItem>
                                        <SelectItem value="Militante Activo">Militante Activo</SelectItem>
                                        <SelectItem value="Militante Líder">Militante Líder</SelectItem>
                                        <SelectItem value="Militante Promotor">Militante Promotor</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.tipo && <p className="text-sm text-destructive">{errors.tipo.message}</p>}
                            </div>

                            {/* Seleccione el Coordinador */}
                            <div className="space-y-2 pt-4">
                                <Label className="text-muted-foreground font-normal">Seleccione el Coordinador</Label>
                                <Popover open={openCoordinador} onOpenChange={setOpenCoordinador}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openCoordinador}
                                            className="w-full justify-between border-x-0 border-t-0 border-b rounded-none px-0 hover:bg-transparent shadow-none"
                                        >
                                            <span className={cn("text-base", !coordinador_id && "text-muted-foreground")}>
                                                {coordinador_id
                                                    ? (coordinadores.find(c => c.coordinador_id === coordinador_id)?.nombres + ' ' + coordinadores.find(c => c.coordinador_id === coordinador_id)?.apellidos || "Coordinador seleccionado")
                                                    : "[-- Seleccione el Coordinador--]"}
                                            </span>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0" align="start">
                                        <Command shouldFilter={false}>
                                            <CommandInput
                                                placeholder="Buscar coordinador..."
                                                value={coordinadoresSearch}
                                                onValueChange={setCoordinadoresSearch}
                                            />
                                            <CommandEmpty>
                                                {loadingCoordinadores ? "Buscando..." : "No se encontraron coordinadores"}
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {coordinadores.map((coord) => (
                                                    <CommandItem
                                                        key={coord.coordinador_id}
                                                        value={`${coord.nombres} ${coord.apellidos}`}
                                                        onSelect={() => {
                                                            setValue("coordinador_id", coord.coordinador_id)
                                                            setOpenCoordinador(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                coordinador_id === coord.coordinador_id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {coord.nombres} {coord.apellidos}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Compromiso Marketing */}
                            <div className="space-y-2 pt-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    <Label htmlFor="compromiso_marketing" className="text-muted-foreground font-normal">Compromiso Marketing</Label>
                                </div>
                                <Input
                                    id="compromiso_marketing"
                                    {...register("compromiso_marketing")}
                                    className="border-x-0 border-t-0 border-b rounded-none px-0 focus-visible:ring-0 shadow-none"
                                />
                            </div>
                        </div>

                        {/* COLUMNA DERECHA */}
                        <div className="space-y-6">
                            {/* Formulario */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Handshake className="h-5 w-5" />
                                    <Label htmlFor="formulario" className="text-muted-foreground font-normal">Formulario</Label>
                                </div>
                                <Input
                                    id="formulario"
                                    {...register("formulario")}
                                    className="border-x-0 border-t-0 border-b rounded-none px-0 focus-visible:ring-0 shadow-none"
                                />
                            </div>

                            {/* Dirigente */}
                            <div className="space-y-2 pt-4">
                                <Label htmlFor="perfil_id" className="text-muted-foreground font-normal text-xs">Dirigente</Label>
                                <Select
                                    onValueChange={(value) => setValue("perfil_id", value === "none" ? "" : value)}
                                    defaultValue={initialData?.perfil_id || "none"}
                                >
                                    <SelectTrigger className="w-full border-none px-0 shadow-none focus:ring-0 font-medium">
                                        <SelectValue placeholder="[ - Dirigente -]" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Sin perfil asignado</SelectItem>
                                        {perfiles.map((perfil) => (
                                            <SelectItem key={perfil.id} value={perfil.id}>
                                                {perfil.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Compromiso Cautivo */}
                            <div className="space-y-2 pt-4">
                                <div className="flex items-center gap-2">
                                    <UserCheck className="h-5 w-5" />
                                    <Label htmlFor="compromiso_cautivo" className="text-muted-foreground font-normal">Compromiso Cautivo</Label>
                                </div>
                                <Input
                                    id="compromiso_cautivo"
                                    {...register("compromiso_cautivo")}
                                    className="border-x-0 border-t-0 border-b rounded-none px-0 focus-visible:ring-0 shadow-none"
                                />
                            </div>

                            {/* Compromiso Impacto */}
                            <div className="space-y-2 pt-4">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    <Label htmlFor="compromiso_impacto" className="text-muted-foreground font-normal">Compromiso Impacto</Label>
                                </div>
                                <Input
                                    id="compromiso_impacto"
                                    {...register("compromiso_impacto")}
                                    className="border-x-0 border-t-0 border-b rounded-none px-0 focus-visible:ring-0 shadow-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-3 pt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.push("/dashboard/militante")}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            CANCELAR <X className="w-4 h-4 ml-1" />
                        </Button>
                        <Button type="submit" disabled={submitting || loading} className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white">
                            {submitting || loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    GUARDANDO...
                                </>
                            ) : (
                                <>
                                    GUARDAR <Check className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}

