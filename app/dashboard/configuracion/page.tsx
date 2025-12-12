import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TiposMilitanteForm } from "@/components/configuracion/tipos-militante-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function ConfiguracionPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Configuración</h1>
                    <Settings className="h-6 w-6 text-muted-foreground" />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Tipos de Militante</CardTitle>
                        <CardDescription>
                            Añadir nuevos tipos de militante al sistema.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TiposMilitanteForm />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
