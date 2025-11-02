"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Download, DollarSign, Zap } from "lucide-react"

const optimizations = [
  {
    id: 1,
    title: "QuickSort Optimization",
    description: "Hybrid quicksort with insertion sort for small arrays. 45% faster on average datasets.",
    language: "JavaScript",
    category: "Sorting",
    performanceGain: 45,
    price: 0,
    rating: 4.8,
    downloads: 1243,
    author: "alexchen",
  },
  {
    id: 2,
    title: "Binary Search Tree Balancing",
    description: "Self-balancing BST implementation with AVL rotations. Maintains O(log n) operations.",
    language: "Python",
    category: "Data Structures",
    performanceGain: 67,
    price: 15,
    rating: 4.9,
    downloads: 892,
    author: "sarah_dev",
  },
  {
    id: 3,
    title: "Database Query Optimizer",
    description: "Intelligent query batching and caching layer. Reduces database calls by 80%.",
    language: "TypeScript",
    category: "Database Queries",
    performanceGain: 80,
    price: 49,
    rating: 5.0,
    downloads: 2156,
    author: "dbmaster",
  },
  {
    id: 4,
    title: "Parallel Array Processing",
    description: "Web Worker-based parallel processing for large arrays. 3x faster on multi-core systems.",
    language: "JavaScript",
    category: "Algorithms",
    performanceGain: 200,
    price: 25,
    rating: 4.7,
    downloads: 1567,
    author: "perf_ninja",
  },
  {
    id: 5,
    title: "Memory-Efficient Graph Traversal",
    description: "Optimized BFS/DFS with minimal memory footprint. Perfect for large graphs.",
    language: "Rust",
    category: "Algorithms",
    performanceGain: 55,
    price: 0,
    rating: 4.6,
    downloads: 734,
    author: "rustacean",
  },
  {
    id: 6,
    title: "API Response Caching",
    description: "Smart caching layer with automatic invalidation. Reduces API latency by 90%.",
    language: "Go",
    category: "API Calls",
    performanceGain: 90,
    price: 35,
    rating: 4.9,
    downloads: 1891,
    author: "gopher_pro",
  },
]

export function MarketplaceGrid() {
  const [sortBy, setSortBy] = useState("popular")

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{optimizations.length} optimizations found</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="performance">Performance Gain</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {optimizations.map((opt) => (
          <Card key={opt.id} className="p-6 transition-all hover:border-primary">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{opt.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">by {opt.author}</p>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Zap className="h-3 w-3" />+{opt.performanceGain}%
              </Badge>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">{opt.description}</p>

            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="outline">{opt.language}</Badge>
              <Badge variant="outline">{opt.category}</Badge>
            </div>

            <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>{opt.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{opt.downloads.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>{opt.price === 0 ? "Free" : `$${opt.price}`}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                {opt.price === 0 ? "Download" : `Purchase $${opt.price}`}
              </Button>
              <Button variant="outline">Preview</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
