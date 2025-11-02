import { Navigation } from "@/components/navigation"
import { Leaderboard } from "@/components/leaderboard"
import { CommunityFeed } from "@/components/community-feed"
import { TrendingOptimizations } from "@/components/trending-optimizations"

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-balance text-4xl font-bold tracking-tight">Community & Leaderboards</h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Connect with top developers, compete on leaderboards, and discover trending optimizations from the
            community.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Leaderboard />
            <div className="mt-6">
              <CommunityFeed />
            </div>
          </div>
          <div className="lg:col-span-1">
            <TrendingOptimizations />
          </div>
        </div>
      </main>
    </div>
  )
}
