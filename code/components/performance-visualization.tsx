"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const barData = [
  { name: "Optimized Hybrid", time: 0.5 },
  { name: "Hybrid Approach", time: 0.6 },
  { name: "Radix Sort", time: 0.8 },
  { name: "Merge Sort", time: 0.9 },
  { name: "Quick Sort", time: 1.2 },
  { name: "Bubble Sort", time: 2.1 },
  { name: "Selection Sort", time: 2.3 },
  { name: "Insertion Sort", time: 2.5 },
]

const lineData = [
  { iteration: 0, time: 2.5 },
  { iteration: 10, time: 2.1 },
  { iteration: 20, time: 1.2 },
  { iteration: 30, time: 0.9 },
  { iteration: 40, time: 0.6 },
  { iteration: 50, time: 0.5 },
]

export function PerformanceVisualization() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="p-6 lg:col-span-2">
        <h3 className="mb-4 text-lg font-semibold">Top 10 Variants Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
            <XAxis dataKey="name" stroke="oklch(0.65 0 0)" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="oklch(0.65 0 0)" label={{ value: "Time (ms)", angle: -90, position: "insideLeft" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0 0)",
                border: "1px solid oklch(0.25 0 0)",
                borderRadius: "0.5rem",
              }}
            />
            <Bar dataKey="time" fill="oklch(0.75 0.20 145)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Statistics</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Best Time</p>
            <p className="text-2xl font-bold text-success">0.5ms</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Worst Time</p>
            <p className="text-2xl font-bold text-destructive">2.5ms</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Improvement</p>
            <p className="text-2xl font-bold text-processing">80%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Variants Tested</p>
            <p className="text-2xl font-bold">50/50</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 lg:col-span-3">
        <h3 className="mb-4 text-lg font-semibold">Performance Improvement Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
            <XAxis
              dataKey="iteration"
              stroke="oklch(0.65 0 0)"
              label={{ value: "Iteration", position: "insideBottom", offset: -5 }}
            />
            <YAxis stroke="oklch(0.65 0 0)" label={{ value: "Time (ms)", angle: -90, position: "insideLeft" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0 0)",
                border: "1px solid oklch(0.25 0 0)",
                borderRadius: "0.5rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="time"
              stroke="oklch(0.65 0.18 220)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.65 0.18 220)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
