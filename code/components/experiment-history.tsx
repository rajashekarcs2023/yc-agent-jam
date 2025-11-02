import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, TrendingUp } from "lucide-react"

const experiments = [
  {
    id: 1,
    name: "Array Sorting Optimization",
    date: "2 hours ago",
    language: "JavaScript",
    performanceGain: 45,
    status: "completed",
  },
  {
    id: 2,
    name: "Database Query Refactor",
    date: "1 day ago",
    language: "TypeScript",
    performanceGain: 67,
    status: "completed",
  },
  {
    id: 3,
    name: "API Response Caching",
    date: "3 days ago",
    language: "Go",
    performanceGain: 82,
    status: "completed",
  },
  {
    id: 4,
    name: "Graph Traversal Algorithm",
    date: "5 days ago",
    language: "Python",
    performanceGain: 38,
    status: "completed",
  },
]

export function ExperimentHistory() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Experiments</h2>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {experiments.map((exp) => (
          <div key={exp.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
            <div className="flex-1">
              <h3 className="font-medium">{exp.name}</h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{exp.date}</span>
                <Badge variant="outline" className="ml-2">
                  {exp.language}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="h-3 w-3" />+{exp.performanceGain}%
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
