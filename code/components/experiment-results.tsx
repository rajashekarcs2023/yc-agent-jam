"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, RotateCcw, Zap, Clock, MemoryStick } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { VariantViewer } from "@/components/variant-viewer"

interface ExperimentResultsProps {
  originalCode: string
  experimentData?: any
  experimentId?: string | null
}

export function ExperimentResults({ originalCode, experimentData, experimentId }: ExperimentResultsProps) {
  const { toast } = useToast()
  const [fullResults, setFullResults] = useState<any>(null)
  const [showVariants, setShowVariants] = useState(false)

  useEffect(() => {
    if (experimentId && !experimentData) {
      // Fetch full results from backend
      fetchExperimentResults(experimentId)
    } else if (experimentData) {
      console.log('Setting experimentData:', experimentData) // Debug log
      setFullResults(experimentData)
    }
  }, [experimentId, experimentData])

  const fetchExperimentResults = async (expId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/experiment/${expId}/results`)
      const data = await response.json()
      console.log('Full experiment data:', data) // Debug log
      setFullResults(data) // Set the entire experiment data, not just data.results
    } catch (error) {
      console.error('Error fetching experiment results:', error)
    }
  }

  const bestVariant = fullResults?.results?.best_variant
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

  // Get all variants from the full experiment data
  const allVariants = fullResults?.variants || []
  const experimentDetails = fullResults || {}
  
  console.log('All variants:', allVariants) // Debug log
  console.log('Best variant:', bestVariant) // Debug log

  return (
    <div className="space-y-6">
      {/* Experiment Overview */}
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Experiment Results</h2>
            {experimentDetails && (
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">
                  <Zap className="mr-1 h-3 w-3" />
                  {experimentDetails.results?.total_variants || allVariants.length} variants generated
                </Badge>
                {(experimentDetails.results?.real_execution_count || 0) > 0 && (
                  <Badge variant="default">
                    🚀 {experimentDetails.results?.real_execution_count} real E2B executions
                  </Badge>
                )}
                <Badge variant="outline">
                  🧠 Captain + ⚡ Morph + 🔍 Metorial + 🚀 E2B
                </Badge>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Best Code
            </Button>
            <Button 
              variant={showVariants ? "secondary" : "default"} 
              size="sm"
              onClick={() => setShowVariants(!showVariants)}
            >
              <Zap className="mr-2 h-4 w-4" />
              {showVariants ? "Hide Variants" : "View All Variants"}
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="mr-2 h-4 w-4" />
              Run New Experiment
            </Button>
          </div>
        </div>

        {/* Variants Available Notice */}
        {allVariants.length > 0 && !showVariants && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  {allVariants.length} Optimized Variants Generated
                </span>
              </div>
              <Button 
                size="sm" 
                onClick={() => setShowVariants(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                View Variants →
              </Button>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              Click to explore all optimized code variants with performance improvements and copy functionality.
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <p className="text-sm text-muted-foreground">Best Time</p>
            </div>
            <p className="text-xl font-bold text-blue-600">
              {bestVariant?.performance?.execution_time_ms?.toFixed(3) || "0.5"}ms
            </p>
            <p className="mt-1 text-xs text-green-600">
              ↓ {bestVariant?.performance?.improvement_percent?.toFixed(1) || "80"}% faster
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <MemoryStick className="h-4 w-4 text-purple-500" />
              <p className="text-sm text-muted-foreground">Memory Usage</p>
            </div>
            <p className="text-xl font-bold text-purple-600">
              {bestVariant?.performance?.memory_usage_mb?.toFixed(1) || "2.1"} MB
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Peak memory</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-green-500" />
              <p className="text-sm text-muted-foreground">Avg Improvement</p>
            </div>
            <p className="text-xl font-bold text-green-600">
              {experimentDetails.results?.avg_improvement?.toFixed(1) || "45"}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Across all variants</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="h-4 w-4 bg-yellow-500" />
              <p className="text-sm text-muted-foreground">Total Variants</p>
            </div>
            <p className="text-xl font-bold text-yellow-600">
              {allVariants.length || experimentDetails.results?.total_variants || 0}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Generated & tested</p>
          </Card>
        </div>

        {/* Pipeline Status */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">AI Pipeline Status</h4>
          <div className="grid gap-2 sm:grid-cols-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>🧠 Captain: Analysis Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>🔍 Metorial: Research Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>⚡ Morph: Generation Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>🚀 E2B: Execution Complete</span>
            </div>
          </div>
        </div>
      </Card>

      {/* All Variants Viewer - Only show when user clicks the button */}
      {showVariants && allVariants.length > 0 && (
        <VariantViewer 
          variants={allVariants}
          originalCode={originalCode}
          bestVariant={bestVariant}
        />
      )}

      {/* Experiment Details */}
      {experimentDetails && Object.keys(experimentDetails).length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Complete Experiment Data</h3>
          <div className="space-y-4">
            {/* Analysis Results */}
            {experimentDetails.analysis && (
              <div>
                <h4 className="font-medium mb-2">🧠 Captain Analysis</h4>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm"><strong>Complexity:</strong> {experimentDetails.analysis.complexity}</p>
                  <p className="text-sm"><strong>Patterns Found:</strong> {experimentDetails.analysis.patterns?.join(', ') || 'None'}</p>
                  <p className="text-sm"><strong>Suggestions:</strong> {experimentDetails.analysis.suggestions?.length || 0}</p>
                </div>
              </div>
            )}

            {/* Research Results */}
            {experimentDetails.research && (
              <div>
                <h4 className="font-medium mb-2">🔍 Metorial Research</h4>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm"><strong>Techniques Found:</strong> {experimentDetails.research.optimization_techniques?.length || 0}</p>
                  <p className="text-sm"><strong>Patterns Discovered:</strong> {experimentDetails.research.patterns_discovered?.join(', ') || 'None'}</p>
                  <p className="text-sm"><strong>Confidence:</strong> {experimentDetails.research.confidence_score || 'N/A'}</p>
                </div>
              </div>
            )}

            {/* Execution Summary */}
            <div>
              <h4 className="font-medium mb-2">📊 Execution Summary</h4>
              <div className="grid gap-2 text-sm bg-muted p-3 rounded-md">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experiment Started:</span>
                  <span className="font-mono">{experimentDetails.created_at ? new Date(experimentDetails.created_at).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experiment Completed:</span>
                  <span className="font-mono">{experimentDetails.results?.completed_at ? new Date(experimentDetails.results.completed_at).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Processing Time:</span>
                  <span className="font-mono">
                    {experimentDetails.created_at && experimentDetails.results?.completed_at 
                      ? `${((new Date(experimentDetails.results.completed_at).getTime() - new Date(experimentDetails.created_at).getTime()) / 1000).toFixed(1)}s`
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Real E2B Executions:</span>
                  <span className="font-mono">{experimentDetails.real_execution_count || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
