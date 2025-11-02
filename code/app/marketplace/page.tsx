import { Navigation } from "@/components/navigation"
import { MarketplaceGrid } from "@/components/marketplace-grid"
import { MarketplaceFilters } from "@/components/marketplace-filters"

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-balance text-4xl font-bold tracking-tight">Optimization Marketplace</h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Discover and purchase proven code optimizations from the community. Browse by language, performance gains,
            and use case.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <MarketplaceFilters />
          </aside>
          <div className="lg:col-span-3">
            <MarketplaceGrid />
          </div>
        </div>
      </main>
    </div>
  )
}
