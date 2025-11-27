"use client"

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"

interface CompromisosSectionProps {
    form: UseFormReturn<any>
}

export function CompromisosSection({ form }: CompromisosSectionProps) {
    return (
        <div className="space-y-6">
            {/* Fila 1: Campos numéricos de compromisos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="compromiso_cautivo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Compromiso Cautivo</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="compromiso_impacto"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Compromiso Impacto</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="compromiso_marketing"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Compromiso Marketing</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Fila 2: Gestión Privada (texto) */}
            <FormField
                control={form.control}
                name="compromiso_privado"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Compromisos </FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="Ingrese datos ejemplo: gestión privada..."
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Fila 3: Observaciones */}
            <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Observaciones Generales</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Ingrese cualquier observación relevante sobre la persona..."
                                className="min-h-[120px]"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
