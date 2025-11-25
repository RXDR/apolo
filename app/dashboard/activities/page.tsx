import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ActivitiesList } from "@/components/activities/activities-list"
import { ActivitiesHeader } from "@/components/activities/activities-header"

export const metadata = {
  title: "Actividades - APOLO",
  description: "Gestiona actividades de campaña",
}

export default function ActivitiesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ActivitiesHeader />
        <ActivitiesList />
      </div>
    </DashboardLayout>
  )
}
