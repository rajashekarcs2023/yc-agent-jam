import { Navigation } from "@/components/navigation"
import { ExperimentLab } from "@/components/experiment-lab"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ExperimentLab />
    </div>
  )
}
