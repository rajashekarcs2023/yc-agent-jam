import { Card } from "@/components/ui/card"
import { Users, Code2, Star, TrendingUp } from "lucide-react"

const stats = [
  { label: "Followers", value: "1,234", icon: Users },
  { label: "Published", value: "47", icon: Code2 },
  { label: "Total Stars", value: "8,542", icon: Star },
  { label: "Avg Improvement", value: "52%", icon: TrendingUp },
]

export function ProfileStats() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-3 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
