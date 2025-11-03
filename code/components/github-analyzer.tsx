"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Github, Search, FileCode, Zap, AlertTriangle, TrendingUp, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GitHubAnalyzerProps {
  className?: string
}

interface AnalysisResults {
  repository_name: string
  files_analyzed: number
  languages_detected: string[]
  algorithms_found: number
  optimization_opportunities: number
  performance_hotspots: number
  recommendations_count: number
  generated_optimizations: number
  estimated_improvement: {
    performance_gain: string
    memory_reduction: string
    code_quality: string
  }
}

interface Recommendation {
  type: string
  priority: "high" | "medium" | "low"
  title: string
  description: string
  impact: string
  files_affected: string[]
}

export function GitHubAnalyzer({ className }: GitHubAnalyzerProps) {
  const { toast } = useToast()
  const [githubUrl, setGithubUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("")
  const [analysisId, setAnalysisId] = useState<string | null>(null)
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [fullAnalysis, setFullAnalysis] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!githubUrl.trim()) {
      toast({
        title: "Please enter a GitHub URL",
        description: "Enter a valid GitHub repository URL to analyze",
        variant: "destructive"
      })
      return
    }

    setIsAnalyzing(true)
    setProgress(0)
    setStatus("Starting repository analysis...")
    setResults(null)
    setFullAnalysis(null)

    try {
      // Start GitHub analysis
      const response = await fetch('http://localhost:8000/api/github/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          github_url: githubUrl,
          analysis_depth: "comprehensive",
          focus_areas: ["performance", "algorithms", "complexity"]
        })
      })

      const result = await response.json()
      
      if (result.analysis_id) {
        setAnalysisId(result.analysis_id)
        // Start monitoring progress
        monitorAnalysis(result.analysis_id)
      } else {
        throw new Error('Failed to start GitHub analysis')
      }

    } catch (error) {
      console.error('Error starting GitHub analysis:', error)
      setIsAnalyzing(false)
      toast({
        title: "Analysis failed",
        description: "Could not start repository analysis. Please try again.",
        variant: "destructive"
      })
    }
  }

  const monitorAnalysis = async (id: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/experiment/${id}/results`)
        const data = await response.json()

        setProgress(data.progress || 0)
        setStatus(getStatusMessage(data.status))

        if (data.status === 'completed') {
          setIsAnalyzing(false)
          setResults(data.results)
          setFullAnalysis(data)
          clearInterval(pollInterval)
          
          toast({
            title: "Analysis complete!",
            description: `Found ${data.results?.algorithms_found || 0} algorithms and ${data.results?.optimization_opportunities || 0} optimization opportunities`,
          })
        } else if (data.status === 'failed') {
          setIsAnalyzing(false)
          clearInterval(pollInterval)
          toast({
            title: "Analysis failed",
            description: data.error || "Repository analysis failed",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('Error polling analysis:', error)
      }
    }, 2000)

    // Cleanup after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval)
      if (isAnalyzing) {
        setIsAnalyzing(false)
        toast({
          title: "Analysis timeout",
          description: "Analysis took too long. Please try again.",
          variant: "destructive"
        })
      }
    }, 300000)
  }

  const getStatusMessage = (status: string) => {
    const statusMessages = {
      'initializing': '🚀 Starting analysis...',
      'fetching_repository': '📁 Fetching repository files...',
      'analyzing_with_ai': '🧠 AI analyzing codebase...',
      'generating_recommendations': '⚡ Generating optimizations...',
      'completed': '✅ Analysis complete!',
      'failed': '❌ Analysis failed'
    }
    return statusMessages[status] || '🔍 Processing...'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(githubUrl)
    toast({
      title: "URL copied",
      description: "GitHub URL copied to clipboard"
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* GitHub URL Input */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Github className="h-6 w-6" />
            <h2 className="text-xl font-bold">GitHub Repository Analyzer</h2>
            <Badge variant="secondary">🧠 Captain + ⚡ Morph + 🔍 Metorial</Badge>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="github-url">GitHub Repository URL</Label>
            <div className="flex gap-2">
              <Input
                id="github-url"
                placeholder="https://github.com/username/repository"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                disabled={isAnalyzing}
                className="flex-1"
              />
              <Button variant="outline" size="icon" onClick={handleCopyUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !githubUrl.trim()}
            className="w-full"
            size="lg"
          >
            <Search className="mr-2 h-5 w-5" />
            {isAnalyzing ? "Analyzing Repository..." : "Analyze Repository"}
          </Button>

          {/* Progress Display */}
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{status}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </div>
      </Card>

      {/* Analysis Results */}
      {results && (
        <Card className="p-6">
          <div className="space-y-6">
            {/* Repository Overview */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Repository Analysis: {results.repository_name}
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{results.files_analyzed}</div>
                  <div className="text-sm text-muted-foreground">Files Analyzed</div>
                </Card>
                
                <Card className="p-4">
                  <div className="text-2xl font-bold text-purple-600">{results.languages_detected?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Languages Detected</div>
                  <div className="flex gap-1 mt-1">
                    {results.languages_detected?.slice(0, 3).map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                    ))}
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">{results.algorithms_found}</div>
                  <div className="text-sm text-muted-foreground">Algorithms Found</div>
                </Card>
                
                <Card className="p-4">
                  <div className="text-2xl font-bold text-orange-600">{results.optimization_opportunities}</div>
                  <div className="text-sm text-muted-foreground">Optimization Opportunities</div>
                </Card>
              </div>
            </div>

            {/* Estimated Improvements */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Estimated Improvements
              </h4>
              <div className="grid gap-2 sm:grid-cols-3 text-sm">
                <div>
                  <span className="font-medium text-green-600">Performance:</span> {results.estimated_improvement?.performance_gain}
                </div>
                <div>
                  <span className="font-medium text-blue-600">Memory:</span> {results.estimated_improvement?.memory_reduction}
                </div>
                <div>
                  <span className="font-medium text-purple-600">Code Quality:</span> {results.estimated_improvement?.code_quality}
                </div>
              </div>
            </div>

            {/* Detailed Analysis Tabs */}
            <Tabs defaultValue="recommendations" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
                <TabsTrigger value="hotspots">Hotspots</TabsTrigger>
                <TabsTrigger value="optimizations">Generated Code</TabsTrigger>
              </TabsList>

              <TabsContent value="recommendations" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Top Optimization Recommendations</h4>
                  {fullAnalysis?.optimization_report?.recommendations?.map((rec: Recommendation, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(rec.priority)}`}></div>
                          <h5 className="font-medium">{rec.title}</h5>
                          <Badge variant="outline">{rec.priority} priority</Badge>
                        </div>
                        <Badge variant="secondary">{rec.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="text-sm">
                        <span className="font-medium text-green-600">Impact:</span> {rec.impact}
                      </div>
                      <div className="text-sm mt-1">
                        <span className="font-medium">Files affected:</span> {rec.files_affected?.length || 0}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="algorithms" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Algorithms Detected</h4>
                  {fullAnalysis?.optimization_report?.top_algorithms?.map((algo: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{algo.algorithm?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</h5>
                        <Badge variant={algo.optimization_potential === 'high' ? 'destructive' : 'secondary'}>
                          {algo.optimization_potential} potential
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{algo.suggestion}</p>
                      <div className="text-xs text-muted-foreground">
                        File: {algo.file} | Language: {algo.language}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="hotspots" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Performance Hotspots</h4>
                  {fullAnalysis?.optimization_report?.performance_hotspots?.map((hotspot: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{hotspot.file}</h5>
                        <Badge variant={hotspot.priority === 'high' ? 'destructive' : 'secondary'}>
                          Complexity: {hotspot.complexity}/10
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Language: {hotspot.language} | Priority: {hotspot.priority}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="optimizations" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-medium">AI-Generated Optimizations</h4>
                  {fullAnalysis?.generated_optimizations?.map((opt: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{opt.recommendation?.title}</h5>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(opt.optimized_code?.code || '')
                            toast({ title: "Code copied!", description: "Optimized code copied to clipboard" })
                          }}
                        >
                          <Copy className="mr-2 h-3 w-3" />
                          Copy Code
                        </Button>
                      </div>
                      <div className="mb-3">
                        <Badge variant="outline">{opt.optimized_code?.name}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">{opt.optimized_code?.description}</p>
                      </div>
                      <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                        <code>{opt.optimized_code?.code || 'No code generated'}</code>
                      </pre>
                      <div className="text-xs text-muted-foreground mt-2">
                        Affects: {opt.files_affected?.join(', ') || 'Multiple files'}
                      </div>
                    </Card>
                  ))}
                  
                  {(!fullAnalysis?.generated_optimizations || fullAnalysis.generated_optimizations.length === 0) && (
                    <Card className="p-6 text-center">
                      <Zap className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No optimizations generated yet. Try analyzing a repository with algorithmic code.</p>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      )}

      {/* Example URLs */}
      {!results && !isAnalyzing && (
        <Card className="p-4">
          <h4 className="font-medium mb-2">Try these example repositories:</h4>
          <div className="space-y-2">
            {[
              "https://github.com/microsoft/vscode",
              "https://github.com/facebook/react", 
              "https://github.com/nodejs/node",
              "https://github.com/python/cpython"
            ].map((url) => (
              <Button
                key={url}
                variant="ghost"
                size="sm"
                className="justify-start h-auto p-2 text-left"
                onClick={() => setGithubUrl(url)}
              >
                <Github className="mr-2 h-3 w-3 flex-shrink-0" />
                <span className="text-xs truncate">{url}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}