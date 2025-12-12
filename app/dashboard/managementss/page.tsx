import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ManagementHeader } from "@/components/management/management-header"
import { ManagementStats } from "@/components/management/management-stats"
import { ManagementCharts } from "@/components/management/management-charts"

export const metadata = {
  title: "Gestión Gerencial - APOLO",
  description: "Reportes y métricas de campaña",
}

export default function ManagementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ManagementHeader />
        <ManagementStats />
        <ManagementCharts />
      </div>
    </DashboardLayout>
  )
}
