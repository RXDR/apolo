import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"

export function PersonasHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Módulo Personas</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Administra fichas técnicas y perfiles de votantes</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button variant="outline" className="gap-2 bg-transparent w-full sm:w-auto">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar</span>
          <span className="sm:hidden">Exp.</span>
        </Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          Nueva Persona
        </Button>
      </div>
    </div>
  )
}
