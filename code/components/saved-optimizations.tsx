import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Download } from "lucide-react"

const saved = [
  {
    id: 1,
    title: "QuickSort Hybrid",
    author: "alexchen",
    language: "JavaScript",
    rating: 4.8,
    downloads: 1243,
  },
  {
    id: 2,
    title: "BST Balancing",
    author: "sarah_dev",
    language: "Python",
    rating: 4.9,
    downloads: 892,
  },
  {
    id: 3,
    title: "Query Optimizer",
    author: "dbmaster",
    language: "TypeScript",
    rating: 5.0,
    downloads: 2156,
  },
]

export function SavedOptimizations() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Saved Optimizations</h2>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {saved.map((opt) => (
          <div key={opt.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
            <div className="flex-1">
              <h3 className="font-medium">{opt.title}</h3>
              <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                <span>by {opt.author}</span>
                <Badge variant="outline">{opt.language}</Badge>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span>{opt.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  <span>{opt.downloads.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <Button size="sm">Apply</Button>
          </div>
        ))}
      </div>
    </Card>
  )
}
