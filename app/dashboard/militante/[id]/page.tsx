"use client"

import { MilitanteForm } from "@/components/militante/militante-form"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useMilitantes } from "@/lib/hooks/use-militantes"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function EditarMilitantePage({ params }: { params: { id: string } }) {
    const { obtenerPorId, loading } = useMilitantes()
    const [militante, setMilitante] = useState<any>(null)

    useEffect(() => {
        async function cargarMilitante() {
            try {
                const data = await obtenerPorId(params.id)
                // Mapear los datos de la vista al formato esperado por el formulario
                setMilitante({
                    id: data.militante_id,
                    usuario_id: data.usuario_id,
                    tipo: data.tipo,
                    coordinador_id: data.coordinador_id,
                    compromiso_marketing: data.compromiso_marketing,
                    compromiso_cautivo: data.compromiso_cautivo,
                    compromiso_impacto: data.compromiso_impacto,
                    formulario: data.formulario,
                    perfil_id: data.perfil_id,
                })
            } catch (error) {
                console.error("Error cargando militante:", error)
            }
        }
        if (params.id) {
            cargarMilitante()
        }
    }, [params.id, obtenerPorId])

    if (loading || !militante) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Editar Militante</h1>
                    <p className="text-muted-foreground">
                        Modifique la información del militante.
                    </p>
                </div>
                <MilitanteForm initialData={militante} isEditing={true} />
            </div>
        </DashboardLayout>
    )
}

