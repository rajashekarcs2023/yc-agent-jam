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
import { Play, Settings, ChevronDown } from "lucide-react"
import { ExperimentFeed } from "@/components/experiment-feed"
import { PerformanceVisualization } from "@/components/performance-visualization"
import { ExperimentResults } from "@/components/experiment-results"

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

  const handleStartExperiment = () => {
    setIsRunning(true)
    setShowResults(false)
    // Simulate experiment completion after 5 seconds
    setTimeout(() => {
      setIsRunning(false)
      setShowResults(true)
    }, 5000)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-balance text-4xl font-bold tracking-tight">AI Code Optimization Lab</h1>
        <p className="mt-2 text-pretty text-muted-foreground">
          Experiment with AI-powered code optimization. Generate and test multiple variants to find the best performance
          improvements.
        </p>
      </div>

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
          <ExperimentResults originalCode={code} />
        </div>
      )}
    </main>
  )
}
