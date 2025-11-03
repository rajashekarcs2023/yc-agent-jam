"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Settings, ChevronDown, Github, Code } from "lucide-react"
import { ExperimentFeed } from "@/components/experiment-feed"
import { PerformanceVisualization } from "@/components/performance-visualization"
import { ExperimentResults } from "@/components/experiment-results"
import { GitHubAnalyzer } from "@/components/github-analyzer"
import { DocumentationGenerator } from "@/components/documentation-generator"

export function ExperimentLab() {
  const [code, setCode] = useState("")
  const [target, setTarget] = useState("performance")
  const [language, setLanguage] = useState("javascript")
  const [variants, setVariants] = useState(50)
  const [iterations, setIterations] = useState(1000)
  const [isRunning, setIsRunning] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [memoryProfiling, setMemoryProfiling] = useState(false)
  const [mutationLevel, setMutationLevel] = useState([5])
  const [experimentalAlgorithms, setExperimentalAlgorithms] = useState(false)
  const [contributeToLibrary, setContributeToLibrary] = useState(true)
  const [privacyLevel, setPrivacyLevel] = useState("public")

  const [experimentId, setExperimentId] = useState<string | null>(null)
  const [experimentData, setExperimentData] = useState<any>(null)

  const handleStartExperiment = async () => {
    if (!code.trim()) return
    
    setIsRunning(true)
    setShowResults(false)
    setExperimentData(null)
    
    try {
      // Start experiment via backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/experiment/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          target,
          variants: Math.min(variants, 10), // Limit for real execution
          iterations,
          settings: {
            memory_profiling: memoryProfiling,
            mutation_level: mutationLevel[0],
            experimental_algorithms: experimentalAlgorithms,
            privacy_level: privacyLevel
          }
        })
      })
      
      const result = await response.json()
      
      if (result.experiment_id) {
        setExperimentId(result.experiment_id)
        // Start WebSocket connection for real-time updates
        connectWebSocket(result.experiment_id)
      } else {
        throw new Error('Failed to start experiment')
      }
      
    } catch (error) {
      console.error('Error starting experiment:', error)
      setIsRunning(false)
      // Fallback to simulation
      setTimeout(() => {
        setIsRunning(false)
        setShowResults(true)
      }, 5000)
    }
  }

  const connectWebSocket = (expId: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const wsUrl = apiUrl.replace('http://', 'ws://').replace('https://', 'wss://')
    const ws = new WebSocket(`${wsUrl}/api/experiment/stream/${expId}`)
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'progress') {
        // Update progress in real-time
        console.log(`Experiment progress: ${data.progress}%`)
      } else if (data.type === 'complete') {
        setIsRunning(false)
        setShowResults(true)
        console.log('WebSocket complete data:', data) // Debug log
        // Use full experiment data if available, otherwise use results
        setExperimentData(data.full_experiment || data)
        ws.close()
      }
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsRunning(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-balance text-4xl font-bold tracking-tight">CodeLab AI - Live Code Experiment Agent</h1>
        <p className="mt-2 text-pretty text-muted-foreground">
          Generate, test, and optimize code with AI. Analyze GitHub repos, generate from documentation, or optimize your code with live experiments.
        </p>
      </div>

      <Tabs defaultValue="code-experiment" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="code-experiment" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Code Optimization
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Documentation to Code
          </TabsTrigger>
          <TabsTrigger value="github-analysis" className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            GitHub Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code-experiment" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Input Section */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="code-input" className="text-base font-semibold">
                  Code to Optimize
                </Label>
                <Textarea
                  id="code-input"
                  placeholder="// Paste your code here&#10;function example(arr) {&#10;  return arr.sort((a, b) => a - b);&#10;}"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-2 min-h-[300px] font-mono text-sm"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="language">Programming Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="target">Optimization Target</Label>
                  <Select value={target} onValueChange={setTarget}>
                    <SelectTrigger id="target" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="memory">Memory Usage</SelectItem>
                      <SelectItem value="readability">Code Readability</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="variants">Variants to Generate</Label>
                  <Input
                    id="variants"
                    type="number"
                    min="1"
                    max="100"
                    value={variants}
                    onChange={(e) => setVariants(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="iterations">Test Iterations</Label>
                  <Input
                    id="iterations"
                    type="number"
                    min="100"
                    max="10000"
                    value={iterations}
                    onChange={(e) => setIterations(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Advanced Settings
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="memory-profiling">Enable Memory Profiling</Label>
                    <Switch id="memory-profiling" checked={memoryProfiling} onCheckedChange={setMemoryProfiling} />
                  </div>

                  <div>
                    <Label>Mutation Aggressiveness: {mutationLevel[0]}</Label>
                    <Slider
                      value={mutationLevel}
                      onValueChange={setMutationLevel}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="experimental"
                      checked={experimentalAlgorithms}
                      onCheckedChange={(checked) => setExperimentalAlgorithms(checked as boolean)}
                    />
                    <Label htmlFor="experimental" className="cursor-pointer">
                      Include Experimental Algorithms
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="custom-data">Custom Test Data (JSON)</Label>
                    <Textarea
                      id="custom-data"
                      placeholder='{"input": [1, 2, 3], "expected": [1, 2, 3]}'
                      className="mt-2 font-mono text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="contribute">Contribute to Community Library</Label>
                    <Switch id="contribute" checked={contributeToLibrary} onCheckedChange={setContributeToLibrary} />
                  </div>

                  <div>
                    <Label htmlFor="privacy">Privacy Level</Label>
                    <Select value={privacyLevel} onValueChange={setPrivacyLevel}>
                      <SelectTrigger id="privacy" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="organization">Organization Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Button
                onClick={handleStartExperiment}
                disabled={!code || isRunning}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                <Play className="mr-2 h-5 w-5" />
                {isRunning ? "Experiment Running..." : "Start Experiment"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Live Feed Section */}
        <div className="lg:col-span-1">
          <ExperimentFeed isRunning={isRunning} />
        </div>
      </div>

      {/* Performance Visualization */}
      {isRunning && (
        <div className="mt-6">
          <PerformanceVisualization />
        </div>
      )}

          {/* Results Section */}
          {showResults && (
            <div className="mt-6">
              <ExperimentResults 
                originalCode={code} 
                experimentData={experimentData}
                experimentId={experimentId}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="documentation" className="mt-6">
          <DocumentationGenerator />
        </TabsContent>

        <TabsContent value="github-analysis" className="mt-6">
          <GitHubAnalyzer />
        </TabsContent>
      </Tabs>
    </main>
  )
}
