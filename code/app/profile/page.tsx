import { Navigation } from "@/components/navigation"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileStats } from "@/components/profile-stats"
import { ContributionGraph } from "@/components/contribution-graph"
import { PublishedOptimizations } from "@/components/published-optimizations"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProfileHeader />
        <ProfileStats />
        <div className="mt-8">
          <ContributionGraph />
        </div>
        <div className="mt-8">
          <PublishedOptimizations />
        </div>
      </main>
    </div>
  )
}
