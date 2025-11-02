import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Flame } from "lucide-react"

const trending = [
  {
    id: 1,
    title: "Parallel Array Processing",
    author: "perf_ninja",
    language: "JavaScript",
    performanceGain: 200,
    trend: "hot",
  },
  {
    id: 2,
    title: "Database Query Optimizer",
    author: "dbmaster",
    language: "TypeScript",
    performanceGain: 80,
    trend: "hot",
  },
  {
    id: 3,
    title: "BST Balancing Algorithm",
    author: "sarah_dev",
    language: "Python",
    performanceGain: 67,
    trend: "rising",
  },
  {
    id: 4,
    title: "API Response Caching",
    author: "gopher_pro",
    language: "Go",
    performanceGain: 90,
    trend: "hot",
  },
  {
    id: 5,
    title: "Memory-Efficient Graph",
    author: "rustacean",
    language: "Rust",
    performanceGain: 55,
    trend: "rising",
  },
]

export function TrendingOptimizations() {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <Flame className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Trending This Week</h2>
      </div>

      <div className="space-y-4">
        {trending.map((opt) => (
          <div key={opt.id} className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="font-semibold leading-tight">{opt.title}</h3>
              {opt.trend === "hot" && <Flame className="h-4 w-4 text-primary" />}
            </div>

            <p className="mb-3 text-sm text-muted-foreground">by {opt.author}</p>

            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {opt.language}
              </Badge>
              <Badge variant="secondary" className="gap-1 text-xs">
                <TrendingUp className="h-3 w-3" />+{opt.performanceGain}%
              </Badge>
            </div>

            <Button size="sm" variant="outline" className="w-full bg-transparent">
              View Details
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}
