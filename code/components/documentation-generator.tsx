"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Plus, X, Search, Code, Copy, Clock, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DocumentationGeneratorProps {
  className?: string
}

interface GenerationResults {
  generation_id: string
  total_implementations: number
  documentation_sources: number
  api_patterns_found: number
  best_implementation: any
  implementations: any[]
}

export function DocumentationGenerator({ className }: DocumentationGeneratorProps) {
  const { toast } = useToast()
  const [documentationUrls, setDocumentationUrls] = useState<string[]>([""])
  const [requirements, setRequirements] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("javascript")
  const [implementationStyle, setImplementationStyle] = useState("production")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("")
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [results, setResults] = useState<GenerationResults | null>(null)
  const [fullGeneration, setFullGeneration] = useState<any>(null)

  const addUrlField = () => {
    setDocumentationUrls([...documentationUrls, ""])
  }

  const removeUrlField = (index: number) => {
    setDocumentationUrls(documentationUrls.filter((_, i) => i !== index))
  }

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...documentationUrls]
    newUrls[index] = value
    setDocumentationUrls(newUrls)
  }

  const handleGenerate = async () => {
    const validUrls = documentationUrls.filter(url => url.trim())
    
    if (validUrls.length === 0) {
      toast({
        title: "Please add documentation URLs",
        description: "Add at least one documentation URL to generate code from",
        variant: "destructive"
      })
      return
    }

    if (!requirements.trim()) {
      toast({
        title: "Please describe requirements",
        description: "Describe what you want to implement based on the documentation",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setStatus("Starting documentation analysis...")
    setResults(null)
    setFullGeneration(null)

    try {
      // Start documentation generation
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/documentation/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentation_urls: validUrls,
          requirements,
          target_language: targetLanguage,
          implementation_style: implementationStyle
        })
      })

      const result = await response.json()
      
      if (result.generation_id) {
        setGenerationId(result.generation_id)
        // Start monitoring progress
        monitorGeneration(result.generation_id)
      } else {
        throw new Error('Failed to start documentation generation')
      }

    } catch (error) {
      console.error('Error starting documentation generation:', error)
      setIsGenerating(false)
      toast({
        title: "Generation failed",
        description: "Could not start code generation. Please try again.",
        variant: "destructive"
      })
    }
  }

  const monitorGeneration = async (id: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/experiment/${id}/results`)
        const data = await response.json()

        setProgress(data.progress || 0)
        setStatus(getStatusMessage(data.status))

        if (data.status === 'completed') {
          setIsGenerating(false)
          setResults(data.results)
          setFullGeneration(data)
          clearInterval(pollInterval)
          
          toast({
            title: "Generation complete!",
            description: `Generated ${data.results?.total_implementations || 0} implementations from ${data.results?.documentation_sources || 0} sources`,
          })
        } else if (data.status === 'failed') {
          setIsGenerating(false)
          clearInterval(pollInterval)
          toast({
            title: "Generation failed",
            description: data.error || "Code generation failed",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('Error polling generation:', error)
      }
    }, 2000)

    // Cleanup after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval)
      if (isGenerating) {
        setIsGenerating(false)
        toast({
          title: "Generation timeout",
          description: "Generation took too long. Please try again.",
          variant: "destructive"
        })
      }
    }, 300000)
  }

  const getStatusMessage = (status: string) => {
    const statusMessages = {
      'initializing': '🚀 Starting generation...',
      'scraping': '📚 Scraping documentation...',
      'extracting': '🔍 Extracting API patterns...',
      'generating': '⚡ Generating implementations...',
      'analyzing': '🧠 Analyzing with Captain...',
      'completed': '✅ Generation complete!',
      'failed': '❌ Generation failed'
    }
    return statusMessages[status] || '🔍 Processing...'
  }

  const handleCopyCode = (code: string, name: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code copied!",
      description: `${name} implementation copied to clipboard`
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Documentation Input */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-6 w-6" />
            <h2 className="text-xl font-bold">Documentation to Code Generator</h2>
            <Badge variant="secondary">🧠 Captain + 🔍 Metorial + 🔥 Firecrawl</Badge>
          </div>
          
          {/* Documentation URLs */}
          <div className="space-y-2">
            <Label>Documentation URLs</Label>
            {documentationUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="https://docs.example.com/api"
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  disabled={isGenerating}
                  className="flex-1"
                />
                {documentationUrls.length > 1 && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => removeUrlField(index)}
                    disabled={isGenerating}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              variant="outline" 
              onClick={addUrlField}
              disabled={isGenerating}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Documentation URL
            </Button>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Implementation Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="Describe what you want to implement based on the documentation. For example: 'Create a React component that uses the API to fetch and display user data with error handling and loading states.'"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              disabled={isGenerating}
              className="min-h-[100px]"
            />
          </div>

          {/* Settings */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Target Language</Label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage} disabled={isGenerating}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Implementation Style</Label>
              <Select value={implementationStyle} onValueChange={setImplementationStyle} disabled={isGenerating}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="production">Production Ready</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            <Search className="mr-2 h-5 w-5" />
            {isGenerating ? "Generating Code..." : "Generate Implementation"}
          </Button>

          {/* Progress Display */}
          {isGenerating && (
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

      {/* Generation Results */}
      {results && fullGeneration && (
        <Card className="p-6">
          <div className="space-y-6">
            {/* Generation Overview */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code className="h-5 w-5" />
                Generated Implementations
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{results.total_implementations}</div>
                  <div className="text-sm text-muted-foreground">Implementations Generated</div>
                </Card>
                
                <Card className="p-4">
                  <div className="text-2xl font-bold text-purple-600">{results.documentation_sources}</div>
                  <div className="text-sm text-muted-foreground">Documentation Sources</div>
                </Card>
                
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">{results.api_patterns_found}</div>
                  <div className="text-sm text-muted-foreground">API Patterns Found</div>
                </Card>
              </div>
            </div>

            {/* All Implementations */}
            <div>
              <h4 className="font-medium mb-4">All Generated Implementations</h4>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {fullGeneration.implementations?.map((impl: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">{impl.name || `Implementation ${index + 1}`}</h5>
                      <div className="flex gap-2">
                        <Badge variant={impl.optimization_potential === 'high' ? 'destructive' : 'secondary'}>
                          {impl.complexity_score || 0} complexity
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCopyCode(impl.code, impl.name || `Implementation ${index + 1}`)}
                        >
                          <Copy className="mr-1 h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{impl.description}</p>
                    <ScrollArea className="h-[200px]">
                      <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                        <code>{impl.code}</code>
                      </pre>
                    </ScrollArea>
                    {impl.analysis && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Complexity: {impl.analysis.complexity} | Patterns: {impl.analysis.patterns?.length || 0}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Best Implementation Highlight */}
            {results.best_implementation && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Recommended Implementation
                </h4>
                <div className="text-sm text-muted-foreground mb-2">
                  {results.best_implementation.description}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline">Lowest Complexity</Badge>
                  <Badge variant="outline">{results.best_implementation.optimization_potential} optimization potential</Badge>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Example Documentation URLs */}
      {!results && !isGenerating && (
        <Card className="p-4">
          <h4 className="font-medium mb-2">Try these example documentation sources:</h4>
          <div className="space-y-2">
            {[
              "https://docs.github.com/en/rest",
              "https://stripe.com/docs/api", 
              "https://docs.aws.amazon.com/lambda/",
              "https://reactjs.org/docs/getting-started.html"
            ].map((url) => (
              <Button
                key={url}
                variant="ghost"
                size="sm"
                className="justify-start h-auto p-2 text-left"
                onClick={() => setDocumentationUrls([url])}
              >
                <FileText className="mr-2 h-3 w-3 flex-shrink-0" />
                <span className="text-xs truncate">{url}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}