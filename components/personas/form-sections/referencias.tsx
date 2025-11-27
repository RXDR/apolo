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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { UseFormReturn } from "react-hook-form"
import { useCatalogos } from "@/lib/hooks/use-catalogos"
import { usePersonas } from "@/lib/hooks/use-personas"
import { useState, useEffect } from "react"

interface ReferenciasSectionProps {
    form: UseFormReturn<any>
}

export function ReferenciasSection({ form }: ReferenciasSectionProps) {
    const { tiposReferencia } = useCatalogos()
    const { buscarReferentes } = usePersonas()
    const [open, setOpen] = useState(false)
    const [referentes, setReferentes] = useState<any[]>([])
    const [loadingReferentes, setLoadingReferentes] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    // Simple debounce effect
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchTerm.length >= 3) {
                setLoadingReferentes(true)
                const results = await buscarReferentes(searchTerm)
                setReferentes(results)
                setLoadingReferentes(false)
            } else {
                setReferentes([])
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="referido_por"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Referido Por (Buscar Persona)</FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className={cn(
                                            "w-full justify-between",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value
                                            ? field.value
                                            : "Buscar por nombre o documento..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0">
                                <Command shouldFilter={false}>
                                    <CommandInput
                                        placeholder="Escriba nombre o documento..."
                                        onValueChange={setSearchTerm}
                                    />
                                    <CommandList>
                                        {loadingReferentes && (
                                            <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Buscando...
                                            </div>
                                        )}
                                        {!loadingReferentes && referentes.length === 0 && searchTerm.length >= 3 && (
                                            <CommandEmpty>No se encontraron personas.</CommandEmpty>
                                        )}
                                        {!loadingReferentes && searchTerm.length < 3 && (
                                            <div className="py-6 text-center text-sm text-muted-foreground">
                                                Escriba al menos 3 caracteres para buscar
                                            </div>
                                        )}
                                        <CommandGroup>
                                            {referentes.map((persona) => (
                                                <CommandItem
                                                    key={persona.id}
                                                    value={`${persona.nombres} ${persona.apellidos}`}
                                                    onSelect={(currentValue) => {
                                                        // Guardamos el nombre completo como string ya que el esquema espera string
                                                        // Idealmente deberíamos guardar el ID si cambiamos el esquema
                                                        form.setValue("referido_por", currentValue)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            field.value === `${persona.nombres} ${persona.apellidos}`
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span>{persona.nombres} {persona.apellidos}</span>
                                                        <span className="text-xs text-muted-foreground">CC: {persona.numero_documento}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="tipo_referencia_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipo de Referencia</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione tipo" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {tiposReferencia.map((tipo) => (
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
                name="lider_responsable"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Líder Responsable</FormLabel>
                        <FormControl>
                            <Input placeholder="Nombre del líder a cargo" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
