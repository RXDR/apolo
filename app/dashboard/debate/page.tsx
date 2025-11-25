import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DebateHeader } from "@/components/debate/debate-header"
import { DebateList } from "@/components/debate/debate-list"

export const metadata = {
  title: "Alistamiento de Debate - APOLO",
  description: "Organiza eventos y preparación de debate",
}

export default function DebatePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DebateHeader />
        <DebateList />
      </div>
    </DashboardLayout>
  )
}
