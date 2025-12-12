'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { createCasaEstrategica, updateCasaEstrategica, type CasaEstrategica } from '@/lib/actions/debate'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const formSchema = z.object({
    coordinador_id: z.string().uuid({ message: 'Selecciona un coordinador válido' }),
    direccion: z.string().min(1, 'La dirección es requerida'),
    ciudad_id: z.string().uuid({ message: 'Selecciona una ciudad válida' }),
    barrio_id: z.string().uuid({ message: 'Selecciona un barrio válido' }),
    medidas: z.string().optional(),
    tipo_publicidad: z.string().optional(),
    fecha_instalacion: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Fecha inválida',
    }),
    fecha_desinstalacion: z.string().optional(),
})

interface CasaEstrategicaFormProps {
    casa?: CasaEstrategica
    trigger?: React.ReactNode
}

export function CasaEstrategicaForm({ casa, trigger }: CasaEstrategicaFormProps) {
    const [open, setOpen] = useState(false)
    const isEditing = !!casa
    const [coordinadores, setCoordinadores] = useState<any[]>([])
    const [ciudades, setCiudades] = useState<any[]>([])
    const [barrios, setBarrios] = useState<any[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            coordinador_id: casa?.coordinador_id || '',
            direccion: casa?.direccion || '',
            ciudad_id: casa?.ciudad_id || '',
            barrio_id: casa?.barrio_id || '',
            medidas: casa?.medidas || '',
            tipo_publicidad: casa?.tipo_publicidad || '',
            fecha_instalacion: casa?.fecha_instalacion || new Date().toISOString().split('T')[0],
            fecha_desinstalacion: casa?.fecha_desinstalacion || '',
        },
    })

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                const supabase = createClient()
                const { data: coords } = await supabase
                    .from('coordinadores')
                    .select('id, usuario:usuarios(nombres, apellidos)')
                if (coords) setCoordinadores(coords)

                const { data: cities } = await supabase
                    .from('ciudades')
                    .select('id, nombre')
                if (cities) setCiudades(cities)
            }
            fetchData()
        }
    }, [open])

    const selectedCiudad = form.watch('ciudad_id')
    useEffect(() => {
        if (selectedCiudad) {
            const fetchBarrios = async () => {
                const supabase = createClient()
                const { data } = await supabase
                    .from('barrios')
                    .select('id, nombre')
                    .eq('ciudad_id', selectedCiudad)
                if (data) setBarrios(data)
            }
            fetchBarrios()
        } else {
            setBarrios([])
        }
    }, [selectedCiudad])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const formData = new FormData()
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, String(value))
                }
            })

            if (isEditing && casa) {
                await updateCasaEstrategica(casa.id, formData)
                toast.success('Casa estratégica actualizada correctamente')
            } else {
                await createCasaEstrategica(formData)
                toast.success('Casa estratégica creada correctamente')
            }
            setOpen(false)
            form.reset()
        } catch (error: any) {
            toast.error(error.message || 'Error al guardar la casa estratégica')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Nueva Casa
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Casa Estratégica' : 'Nueva Casa Estratégica'}</DialogTitle>
                    <DialogDescription>
                        Registra los datos de la casa estratégica.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="coordinador_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Coordinador</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un coordinador" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {coordinadores.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.usuario.nombres} {c.usuario.apellidos}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="direccion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="ciudad_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ciudad</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona una ciudad" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {ciudades.map((c) => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="barrio_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Barrio</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCiudad}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un barrio" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {barrios.map((b) => (
                                                    <SelectItem key={b.id} value={b.id}>
                                                        {b.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="tipo_publicidad"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo Publicidad</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="valla">Valla</SelectItem>
                                                <SelectItem value="pendon">Pendón</SelectItem>
                                                <SelectItem value="microperforado">Microperforado</SelectItem>
                                                <SelectItem value="otro">Otro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="medidas"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Medidas</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Ej: 2x1m" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="fecha_instalacion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha Instalación</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fecha_desinstalacion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha Desinstalación</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit">Guardar</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
