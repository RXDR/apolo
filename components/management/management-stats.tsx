import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Activity, Target } from "lucide-react"

export function ManagementStats() {
  const stats = [
    {
      title: "Personas Registradas",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Actividades Completadas",
      value: "89",
      change: "+5%",
      icon: Activity,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Tasa de Compromiso",
      value: "68%",
      change: "+8%",
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Meta Alcanzada",
      value: "72%",
      change: "+15%",
      icon: Target,
      color: "text-orange-600 dark:text-orange-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.change}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-20`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
