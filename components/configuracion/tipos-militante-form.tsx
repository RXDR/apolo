"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, Check } from "lucide-react"
import { useTiposMilitante } from "@/lib/hooks/use-tipos-militante"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Database } from "@/lib/supabase/database.types"

type TipoMilitante = Database['public']['Tables']['tipos_militante']['Row']

// Esquema de validación
const tipoMilitanteSchema = z.object({
    codigo: z.preprocess(
        (val) => parseInt(z.string().parse(val), 10),
        z.number().min(1, "El código debe ser un número positivo")
    ),
    descripcion: z.string().min(3, "La descripción debe tener al menos 3 caracteres"),
})

type TipoMilitanteFormValues = z.infer<typeof tipoMilitanteSchema>

export function TiposMilitanteForm() {
    const { crear, listar, loading } = useTiposMilitante()
    const [submitting, setSubmitting] = useState(false)
    const [tipos, setTipos] = useState<TipoMilitante[]>([])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TipoMilitanteFormValues>({
        resolver: zodResolver(tipoMilitanteSchema),
    })

    const cargarTipos = async () => {
        const data = await listar()
        setTipos(data)
    }

    useEffect(() => {
        cargarTipos()
    }, [])

    async function onSubmit(data: TipoMilitanteFormValues) {
        try {
            setSubmitting(true)
            await crear(data)
            toast.success("Tipo de militante creado exitosamente")
            reset()
            await cargarTipos() // Recargar la lista
        } catch (error) {
            console.error("Error guardando tipo de militante:", error)
            toast.error(error instanceof Error ? error.message : "Error al guardar el tipo de militante")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="codigo">Código</Label>
                        <Input
                            id="codigo"
                            type="number"
                            {...register("codigo")}
                        />
                        {errors.codigo && <p className="text-sm text-destructive">{errors.codigo.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Input
                            id="descripcion"
                            {...register("descripcion")}
                        />
                        {errors.descripcion && <p className="text-sm text-destructive">{errors.descripcion.message}</p>}
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={submitting || loading}>
                            {submitting || loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    GUARDANDO...
                                </>
                            ) : (
                                <>
                                    GUARDAR <Save className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
            <div>
                <h3 className="text-lg font-medium mb-4">Tipos Existentes</h3>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Descripción</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">
                                        <Loader2 className="w-6 h-6 animate-spin inline-block" />
                                    </TableCell>
                                </TableRow>
                            )}
                            {tipos.map(tipo => (
                                <TableRow key={tipo.id}>
                                    <TableCell>{tipo.codigo}</TableCell>
                                    <TableCell>{tipo.descripcion}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
