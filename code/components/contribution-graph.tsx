"use client"

import { Card } from "@/components/ui/card"

export function ContributionGraph() {
  // Generate mock contribution data for the past 12 weeks
  const weeks = 12
  const daysPerWeek = 7
  const contributions = Array.from({ length: weeks }, () =>
    Array.from({ length: daysPerWeek }, () => Math.floor(Math.random() * 5)),
  )

  const getColor = (level: number) => {
    if (level === 0) return "bg-muted"
    if (level === 1) return "bg-primary/20"
    if (level === 2) return "bg-primary/40"
    if (level === 3) return "bg-primary/60"
    return "bg-primary"
  }

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Contribution Activity</h2>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {contributions.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`h-3 w-3 rounded-sm ${getColor(day)}`}
                  title={`${day} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-sm bg-muted" />
          <div className="h-3 w-3 rounded-sm bg-primary/20" />
          <div className="h-3 w-3 rounded-sm bg-primary/40" />
          <div className="h-3 w-3 rounded-sm bg-primary/60" />
          <div className="h-3 w-3 rounded-sm bg-primary" />
        </div>
        <span>More</span>
      </div>
    </Card>
  )
}
