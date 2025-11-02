import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Download, TrendingUp } from "lucide-react"

const published = [
  {
    id: 1,
    title: "Parallel Array Processing",
    description: "Web Worker-based parallel processing for large arrays",
    language: "JavaScript",
    performanceGain: 200,
    rating: 4.7,
    downloads: 1567,
    price: 25,
  },
  {
    id: 2,
    title: "Smart Cache Layer",
    description: "Intelligent caching with automatic invalidation",
    language: "TypeScript",
    performanceGain: 85,
    rating: 4.9,
    downloads: 2341,
    price: 35,
  },
  {
    id: 3,
    title: "Graph Algorithm Suite",
    description: "Optimized BFS, DFS, and shortest path algorithms",
    language: "Python",
    performanceGain: 62,
    rating: 4.8,
    downloads: 1123,
    price: 0,
  },
]

export function PublishedOptimizations() {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Published Optimizations</h2>
        <Button variant="outline" size="sm">
          Publish New
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {published.map((opt) => (
          <Card key={opt.id} className="p-4">
            <div className="mb-3 flex items-start justify-between">
              <h3 className="font-semibold">{opt.title}</h3>
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="h-3 w-3" />+{opt.performanceGain}%
              </Badge>
            </div>

            <p className="mb-3 text-sm text-muted-foreground">{opt.description}</p>

            <Badge variant="outline" className="mb-3">
              {opt.language}
            </Badge>

            <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>{opt.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{opt.downloads.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Stats
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  )
}
