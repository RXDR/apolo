"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { CoordinadorForm } from "@/components/coordinador/coordinador-form"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useCoordinadores } from "@/lib/hooks/use-coordinadores"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function EditarCoordinadorPage() {
    const params = useParams()
    const id = params.id as string
    const { obtenerPorId, loading } = useCoordinadores()
    const [coordinador, setCoordinador] = useState<any>(null)

    useEffect(() => {
        async function cargarCoordinador() {
            if (id) {
                const data = await obtenerPorId(id)
                setCoordinador(data)
            }
        }
        cargarCoordinador()
    }, [id])

    if (loading || !coordinador) {
        return (
            <DashboardLayout>
                <Card>
                    <CardContent className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </CardContent>
                </Card>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Editar Coordinador</h1>
                    <p className="text-muted-foreground">
                        Actualice la información del coordinador {coordinador.nombres} {coordinador.apellidos}.
                    </p>
                </div>
                <CoordinadorForm initialData={coordinador} isEditing={true} />
            </div>
        </DashboardLayout>
    )
}
