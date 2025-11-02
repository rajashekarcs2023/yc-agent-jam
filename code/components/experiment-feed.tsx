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
      { message: "Generating variant 1/50...", type: "generating" as const },
      { message: "Testing quicksort variant... 1.2ms average", type: "testing" as const },
      { message: "Generating variant 5/50...", type: "generating" as const },
      { message: "Testing merge sort variant... 0.9ms average", type: "testing" as const },
      { message: "New leader: Merge sort approach - 0.9ms", type: "leader" as const },
      { message: "Generating variant 12/50...", type: "generating" as const },
      { message: "Testing radix sort variant... 0.8ms average", type: "testing" as const },
      { message: "New leader: Radix sort - 0.8ms", type: "leader" as const },
      { message: "Generating variant 23/50...", type: "generating" as const },
      { message: "Testing hybrid approach... 0.6ms average", type: "testing" as const },
      { message: "New leader: Hybrid approach - 0.6ms", type: "leader" as const },
      { message: "Generating variant 35/50...", type: "generating" as const },
      { message: "Testing optimized hybrid... 0.5ms average", type: "testing" as const },
      { message: "New leader: Optimized hybrid - 0.5ms", type: "leader" as const },
      { message: "Experiment completed successfully", type: "completed" as const },
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
