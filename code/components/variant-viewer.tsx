"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, ChevronDown, Code, Zap, Clock, MemoryStick, Trophy, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Variant {
  id: number
  name: string
  code: string
  description: string
  performance: {
    execution_time_ms: number
    memory_usage_mb: number
    improvement_percent: number
    iterations: number
    real_execution: boolean
  }
  execution_details: any
  timestamp: string
}

interface VariantViewerProps {
  variants: Variant[]
  originalCode: string
  bestVariant?: Variant
}

export function VariantViewer({ variants, originalCode, bestVariant }: VariantViewerProps) {
  const { toast } = useToast()
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(bestVariant || variants[0] || null)
  const [expandedVariants, setExpandedVariants] = useState<Set<number>>(new Set())

  const handleCopy = (code: string, variantName: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code copied!",
      description: `${variantName} code copied to clipboard`,
    })
  }

  const handleCopyAllCodes = () => {
    const allCodes = variants.map((variant, index) => 
      `// ========== Variant ${index + 1}: ${variant.name} ==========\n// Performance: ${variant.performance?.improvement_percent?.toFixed(1) || '0'}% improvement\n// ${variant.description}\n\n${variant.code}\n\n`
    ).join('')
    
    navigator.clipboard.writeText(allCodes)
    toast({
      title: "All codes copied!",
      description: `${variants.length} variant codes copied to clipboard`,
    })
  }

  const toggleExpanded = (variantId: number) => {
    const newExpanded = new Set(expandedVariants)
    if (newExpanded.has(variantId)) {
      newExpanded.delete(variantId)
    } else {
      newExpanded.add(variantId)
    }
    setExpandedVariants(newExpanded)
  }

  const getPerformanceColor = (improvement: number) => {
    if (improvement >= 50) return "text-green-600"
    if (improvement >= 20) return "text-blue-600"
    if (improvement >= 0) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (improvement: number) => {
    if (improvement >= 50) return "🚀 Excellent"
    if (improvement >= 20) return "⚡ Good"
    if (improvement >= 0) return "📈 Improved"
    return "📉 Slower"
  }

  if (!variants || variants.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <Code className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Variants Generated</h3>
          <p>Start an experiment to see optimized code variants</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Variants Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Generated Variants</h2>
            <p className="text-muted-foreground">
              {variants.length} optimization variants generated
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyAllCodes}
              className="text-xs"
            >
              <Copy className="mr-1 h-3 w-3" />
              Copy All {variants.length} Codes
            </Button>
            <Badge variant="secondary">
              <Zap className="mr-1 h-3 w-3" />
              {variants.filter(v => v.performance?.real_execution).length} real executions
            </Badge>
            {bestVariant && (
              <Badge variant="default">
                <Trophy className="mr-1 h-3 w-3" />
                Best: {bestVariant.performance?.improvement_percent?.toFixed(1) || '0'}% faster
              </Badge>
            )}
          </div>
        </div>

        {/* All Generated Variants in Grid Layout */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {variants.map((variant, index) => (
            <Card key={variant.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h5 className="font-medium">{variant.name || `Variant ${index + 1}`}</h5>
                  {variant.id === bestVariant?.id && (
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Badge 
                    variant={variant.performance?.improvement_percent >= 50 ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {variant.performance?.improvement_percent?.toFixed(1) || '0'}% faster
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopy(variant.code, variant.name || `Variant ${index + 1}`)}
                  >
                    <Copy className="mr-1 h-3 w-3" />
                    Copy
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{variant.description}</p>
              
              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                <div className="text-center">
                  <div className="font-mono">{variant.performance?.execution_time_ms?.toFixed(3) || '0'}ms</div>
                  <div className="text-muted-foreground">Time</div>
                </div>
                <div className="text-center">
                  <div className="font-mono">{variant.performance?.memory_usage_mb?.toFixed(1) || '0'}MB</div>
                  <div className="text-muted-foreground">Memory</div>
                </div>
                <div className="text-center">
                  <div className="font-mono">{variant.performance?.iterations?.toLocaleString() || '0'}</div>
                  <div className="text-muted-foreground">Iterations</div>
                </div>
              </div>
              
              {/* Code Preview in Scrollable Box */}
              <ScrollArea className="h-[200px]">
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                  <code>{variant.code || '// Code not available'}</code>
                </pre>
              </ScrollArea>
              
              {/* Additional Details */}
              <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                <span>
                  {variant.performance?.real_execution ? '🚀 Real E2B' : '⚡ Simulated'}
                </span>
                <span>Variant #{variant.id}</span>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Detailed View */}
      {selectedVariant && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                {selectedVariant.name}
                {selectedVariant.id === bestVariant?.id && (
                  <Trophy className="h-5 w-5 text-yellow-500" />
                )}
              </h3>
              <p className="text-muted-foreground">{selectedVariant.description}</p>
            </div>
            <Button onClick={() => handleCopy(selectedVariant.code, selectedVariant.name)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </Button>
          </div>

          <Tabs defaultValue="code" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="mt-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Original Code</h4>
                  <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto max-h-96">
                    <code className="font-mono">{originalCode}</code>
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-green-600">Optimized Code</h4>
                  <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto max-h-96">
                    <code className="font-mono">{selectedVariant.code}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <h4 className="font-medium">Execution Time</h4>
                  </div>
                  <div className="text-2xl font-bold">{selectedVariant.performance?.execution_time_ms?.toFixed(3)}ms</div>
                  <div className={`text-sm ${getPerformanceColor(selectedVariant.performance?.improvement_percent || 0)}`}>
                    {selectedVariant.performance?.improvement_percent >= 0 ? '↓' : '↑'} 
                    {Math.abs(selectedVariant.performance?.improvement_percent || 0).toFixed(1)}% vs original
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MemoryStick className="h-4 w-4 text-purple-500" />
                    <h4 className="font-medium">Memory Usage</h4>
                  </div>
                  <div className="text-2xl font-bold">{selectedVariant.performance?.memory_usage_mb?.toFixed(1)}MB</div>
                  <div className="text-sm text-muted-foreground">Peak memory usage</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="h-4 w-4 text-green-500" />
                    <h4 className="font-medium">Iterations</h4>
                  </div>
                  <div className="text-2xl font-bold">{selectedVariant.performance?.iterations?.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Test iterations</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <h4 className="font-medium">Execution Type</h4>
                  </div>
                  <div className="text-lg font-bold">
                    {selectedVariant.performance?.real_execution ? '🚀 Real' : '⚡ Simulated'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedVariant.performance?.real_execution ? 'E2B Sandbox' : 'Fallback mode'}
                  </div>
                </Card>
              </div>

              {/* Execution Details */}
              {selectedVariant.execution_details && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Execution Details</h4>
                  <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                    <code>{JSON.stringify(selectedVariant.execution_details, null, 2)}</code>
                  </pre>
                </div>
              )}
            </TabsContent>

            <TabsContent value="comparison" className="mt-4">
              <div className="space-y-4">
                <h4 className="font-medium">Performance Comparison</h4>
                <div className="space-y-2">
                  {variants.map((variant) => (
                    <div key={variant.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{variant.id}</Badge>
                        <span className="font-medium">{variant.name}</span>
                        {variant.id === bestVariant?.id && (
                          <Trophy className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono">
                          {variant.performance?.execution_time_ms?.toFixed(3)}ms
                        </span>
                        <span className={`text-sm font-mono ${getPerformanceColor(variant.performance?.improvement_percent || 0)}`}>
                          {variant.performance?.improvement_percent >= 0 ? '+' : ''}
                          {variant.performance?.improvement_percent?.toFixed(1)}%
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(variant.code, variant.name)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  )
}