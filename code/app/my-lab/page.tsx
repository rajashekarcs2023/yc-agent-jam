import { Navigation } from "@/components/navigation"
import { UserStats } from "@/components/user-stats"
import { ExperimentHistory } from "@/components/experiment-history"
import { SavedOptimizations } from "@/components/saved-optimizations"

export default function MyLabPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-balance text-4xl font-bold tracking-tight">My Lab</h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Track your experiments, view your optimization history, and manage your saved optimizations.
          </p>
        </div>

        <UserStats />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ExperimentHistory />
          <SavedOptimizations />
        </div>
      </main>
    </div>
  )
}
