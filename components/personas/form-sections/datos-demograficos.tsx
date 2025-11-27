"use client"

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { UseFormReturn } from "react-hook-form"
import { useCatalogos } from "@/lib/hooks/use-catalogos"

interface DatosDemograficosSectionProps {
    form: UseFormReturn<any>
}

export function DatosDemograficosSection({ form }: DatosDemograficosSectionProps) {
    const { nivelesEscolaridad, tiposVivienda } = useCatalogos()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="nivel_educativo_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nivel Educativo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione nivel" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {nivelesEscolaridad.map((nivel) => (
                                    <SelectItem key={nivel.id} value={nivel.id}>
                                        {nivel.nombre}
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
                name="ocupacion"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ocupación</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: Ingeniero, Estudiante..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="tipo_vivienda_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipo de Vivienda</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione tipo" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {tiposVivienda.map((tipo) => (
                                    <SelectItem key={tipo.id} value={tipo.id}>
                                        {tipo.nombre}
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
                name="estrato"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Estrato</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione estrato" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {[1, 2, 3, 4, 5, 6].map((estrato) => (
                                    <SelectItem key={estrato} value={estrato.toString()}>
                                        Estrato {estrato}
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
                name="ingresos_rango"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Rango de Ingresos</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione rango" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Menos de 1 SMMLV">Menos de 1 SMMLV</SelectItem>
                                <SelectItem value="1 - 2 SMMLV">1 - 2 SMMLV</SelectItem>
                                <SelectItem value="2 - 4 SMMLV">2 - 4 SMMLV</SelectItem>
                                <SelectItem value="Más de 4 SMMLV">Más de 4 SMMLV</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="tiene_hijos"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>¿Tiene hijos?</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                {form.watch("tiene_hijos") && (
                    <FormField
                        control={form.control}
                        name="numero_hijos"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de Hijos</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
            </div>
        </div>
    )
}
