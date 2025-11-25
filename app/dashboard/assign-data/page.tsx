import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AssignDataHeader } from "@/components/assign-data/assign-data-header"
import { AssignmentList } from "@/components/assign-data/assignment-list"

export const metadata = {
  title: "Asignar Datos - APOLO",
  description: "Asigna recursos y datos a coordinadores",
}

export default function AssignDataPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AssignDataHeader />
        <AssignmentList />
      </div>
    </DashboardLayout>
  )
}
