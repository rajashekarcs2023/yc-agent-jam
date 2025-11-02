"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExperimentResultsProps {
  originalCode: string
}

export function ExperimentResults({ originalCode }: ExperimentResultsProps) {
  const { toast } = useToast()

  const optimizedCode = `// Optimized hybrid sorting approach
function optimizedSort(arr) {
  if (arr.length <= 10) {
    return insertionSort(arr);
  }
  return radixSort(arr);
}

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSort(arr, exp);
  }
  return arr;
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
        <h2 className="text-2xl font-bold">Experiment Results</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Optimized Code
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
          <pre className="rounded-lg border border-border bg-muted p-4 text-sm">
            <code className="font-mono">{originalCode || "// No code provided"}</code>
          </pre>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-success">Optimized Code</h3>
          <pre className="rounded-lg border border-success/30 bg-muted p-4 text-sm">
            <code className="font-mono">{optimizedCode}</code>
          </pre>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold">Performance Metrics</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Execution Time</p>
            <p className="mt-1 text-2xl font-bold text-success">0.5ms</p>
            <p className="mt-1 text-xs text-success">↓ 80% improvement</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Memory Usage</p>
            <p className="mt-1 text-2xl font-bold text-processing">2.1 KB</p>
            <p className="mt-1 text-xs text-processing">↓ 45% improvement</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">CPU Utilization</p>
            <p className="mt-1 text-2xl font-bold">12%</p>
            <p className="mt-1 text-xs text-success">↓ 65% improvement</p>
          </Card>
        </div>
      </div>
    </Card>
  )
}
