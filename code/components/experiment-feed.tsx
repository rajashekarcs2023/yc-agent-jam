"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Zap, CheckCircle2 } from "lucide-react"

interface FeedEntry {
  id: number
  message: string
  type: "generating" | "testing" | "leader" | "completed"
  timestamp: string
}

export function ExperimentFeed({ isRunning }: { isRunning: boolean }) {
  const [entries, setEntries] = useState<FeedEntry[]>([])

  useEffect(() => {
    if (!isRunning) {
      setEntries([])
      return
    }

    const messages = [
      { message: "🚀 Starting Live Code Experiment...", type: "generating" as const },
      { message: "🧠 Captain: Analyzing code complexity...", type: "generating" as const },
      { message: "🧠 Captain: Detected O(n²) time complexity", type: "testing" as const },
      { message: "🧠 Captain: Found nested loop optimization opportunities", type: "testing" as const },
      { message: "🔍 Metorial: Researching optimization techniques...", type: "generating" as const },
      { message: "🔍 Metorial: Found 8 relevant optimization patterns", type: "testing" as const },
      { message: "🔍 Metorial: Neural search via Exa complete", type: "testing" as const },
      { message: "⚡ Morph: Generating optimized variants...", type: "generating" as const },
      { message: "⚡ Morph: Generated Quick Sort variant", type: "testing" as const },
      { message: "⚡ Morph: Generated Merge Sort variant", type: "testing" as const },
      { message: "⚡ Morph: Generated Radix Sort variant", type: "testing" as const },
      { message: "⚡ Morph: Generated Hybrid Sort variant", type: "testing" as const },
      { message: "⚡ Morph: Generated Vectorized variant", type: "testing" as const },
      { message: "🚀 E2B: Executing variants in sandboxes...", type: "generating" as const },
      { message: "🚀 E2B: Quick Sort - 1.2ms execution time", type: "testing" as const },
      { message: "🏆 New leader: Quick Sort - 65% improvement", type: "leader" as const },
      { message: "🚀 E2B: Merge Sort - 0.9ms execution time", type: "testing" as const },
      { message: "🏆 New leader: Merge Sort - 78% improvement", type: "leader" as const },
      { message: "🚀 E2B: Radix Sort - 0.8ms execution time", type: "testing" as const },
      { message: "🏆 New leader: Radix Sort - 82% improvement", type: "leader" as const },
      { message: "🚀 E2B: Hybrid Sort - 0.6ms execution time", type: "testing" as const },
      { message: "🏆 New leader: Hybrid Sort - 88% improvement", type: "leader" as const },
      { message: "🚀 E2B: Vectorized Sort - 0.5ms execution time", type: "testing" as const },
      { message: "🏆 New leader: Vectorized Sort - 91% improvement", type: "leader" as const },
      { message: "✅ All sponsor APIs integrated successfully", type: "completed" as const },
      { message: "🎉 Experiment completed - Best: 91% faster!", type: "completed" as const },
    ]

    let index = 0
    const interval = setInterval(() => {
      if (index < messages.length) {
        const newEntry: FeedEntry = {
          id: Date.now() + index,
          ...messages[index],
          timestamp: new Date().toLocaleTimeString(),
        }
        setEntries((prev) => [...prev, newEntry])
        index++
      } else {
        clearInterval(interval)
      }
    }, 300)

    return () => clearInterval(interval)
  }, [isRunning])

  const getEntryColor = (type: FeedEntry["type"]) => {
    switch (type) {
      case "leader":
        return "text-success"
      case "testing":
        return "text-processing"
      case "completed":
        return "text-success"
      default:
        return "text-muted-foreground"
    }
  }

  const getEntryIcon = (type: FeedEntry["type"]) => {
    switch (type) {
      case "leader":
        return <Zap className="h-4 w-4 text-success" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-success" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Real-time Experiment Feed</h3>
      <ScrollArea className="h-[500px]">
        <div className="space-y-3">
          {entries.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">Start an experiment to see live updates</p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                {getEntryIcon(entry.type)}
                <div className="flex-1">
                  <p className={`text-sm ${getEntryColor(entry.type)}`}>{entry.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{entry.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}
