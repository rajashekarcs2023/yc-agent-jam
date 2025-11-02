import { Card } from "@/components/ui/card"
import { TrendingUp, Zap, DollarSign, Award } from "lucide-react"

const stats = [
  {
    label: "Total Experiments",
    value: "127",
    change: "+12 this week",
    icon: Zap,
    color: "text-primary",
  },
  {
    label: "Avg Performance Gain",
    value: "43%",
    change: "+5% from last month",
    icon: TrendingUp,
    color: "text-success",
  },
  {
    label: "Earnings",
    value: "$1,247",
    change: "+$180 this month",
    icon: DollarSign,
    color: "text-accent",
  },
  {
    label: "Reputation Score",
    value: "8,542",
    change: "Top 5% globally",
    icon: Award,
    color: "text-primary",
  },
]

export function UserStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
