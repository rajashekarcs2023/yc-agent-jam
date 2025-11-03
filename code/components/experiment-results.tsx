"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, RotateCcw, Zap, Clock, MemoryStick } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExperimentResultsProps {
  originalCode: string
  experimentData?: any
  experimentId?: string | null
}

export function ExperimentResults({ originalCode, experimentData, experimentId }: ExperimentResultsProps) {
  const { toast } = useToast()
  const [fullResults, setFullResults] = useState<any>(null)

  useEffect(() => {
    if (experimentId && !experimentData) {
      // Fetch full results from backend
      fetchExperimentResults(experimentId)
    } else if (experimentData) {
      setFullResults(experimentData)
    }
  }, [experimentId, experimentData])

  const fetchExperimentResults = async (expId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/experiment/${expId}/results`)
      const data = await response.json()
      setFullResults(data.results)
    } catch (error) {
      console.error('Error fetching experiment results:', error)
    }
  }

  const bestVariant = fullResults?.best_variant
  const optimizedCode = bestVariant?.code || `// Optimized code will appear here after experiment completes
// Live Code Experiment Agent generated this optimization
function optimizedFunction() {
  // Your optimized implementation
  return "Experiment in progress...";
}`

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedCode)
    toast({
      title: "Copied to clipboard",
      description: "Optimized code has been copied to your clipboard",
    })
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Experiment Results</h2>
          {fullResults && (
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">
                <Zap className="mr-1 h-3 w-3" />
                {fullResults.total_variants} variants tested
              </Badge>
              {fullResults.real_execution_count > 0 && (
                <Badge variant="default">
                  🚀 {fullResults.real_execution_count} real executions (E2B)
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Best Code
          </Button>
          <Button variant="outline" size="sm">
            <RotateCcw className="mr-2 h-4 w-4" />
            Run New Experiment
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-lg font-semibold">Original Code</h3>
          <pre className="rounded-lg border border-border bg-muted p-4 text-sm max-h-96 overflow-auto">
            <code className="font-mono">{originalCode || "// No code provided"}</code>
          </pre>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-semibold text-success">Best Optimized Code</h3>
            {bestVariant && (
              <Badge variant="outline">{bestVariant.name}</Badge>
            )}
          </div>
          <pre className="rounded-lg border border-success/30 bg-muted p-4 text-sm max-h-96 overflow-auto">
            <code className="font-mono">{optimizedCode}</code>
          </pre>
          {bestVariant && (
            <p className="mt-2 text-sm text-muted-foreground">
              {bestVariant.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold">Performance Metrics</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Execution Time</p>
            </div>
            <p className="text-2xl font-bold text-success">
              {bestVariant?.performance?.execution_time_ms?.toFixed(3) || "0.5"}ms
            </p>
            <p className="mt-1 text-xs text-success">
              ↓ {bestVariant?.performance?.improvement_percent?.toFixed(1) || "80"}% improvement
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Memory Usage</p>
            </div>
            <p className="text-2xl font-bold text-processing">
              {bestVariant?.performance?.memory_usage_mb?.toFixed(1) || "2.1"} MB
            </p>
            <p className="mt-1 text-xs text-processing">
              Memory efficient
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Iterations</p>
            </div>
            <p className="text-2xl font-bold">
              {bestVariant?.performance?.iterations?.toLocaleString() || "1,000"}
            </p>
            <p className="mt-1 text-xs">
              {bestVariant?.performance?.real_execution ? "Real execution" : "Simulated"}
            </p>
          </Card>
        </div>
      </div>

      {fullResults && (
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-semibold">Experiment Summary</h3>
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Improvement:</span>
                <span className="font-mono">{fullResults.avg_improvement?.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Variants Generated:</span>
                <span className="font-mono">{fullResults.total_variants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Real Executions (E2B):</span>
                <span className="font-mono">{fullResults.real_execution_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed:</span>
                <span className="font-mono">{new Date(fullResults.completed_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
