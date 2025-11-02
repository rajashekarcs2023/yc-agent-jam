"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

const languages = ["JavaScript", "Python", "Go", "Rust", "Java", "TypeScript"]
const categories = ["Sorting", "Search", "Data Structures", "Algorithms", "API Calls", "Database Queries"]
const priceRanges = ["Free", "Under $10", "$10-$50", "$50-$100", "$100+"]

export function MarketplaceFilters() {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [performanceGain, setPerformanceGain] = useState([0])

  const handleReset = () => {
    setSelectedLanguages([])
    setSelectedCategories([])
    setSelectedPrices([])
    setPerformanceGain([0])
  }

  const toggleSelection = (item: string, list: string[], setter: (list: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item))
    } else {
      setter([...list, item])
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="mb-3 block text-sm font-semibold">Language</Label>
          <div className="space-y-2">
            {languages.map((lang) => (
              <div key={lang} className="flex items-center gap-2">
                <Checkbox
                  id={`lang-${lang}`}
                  checked={selectedLanguages.includes(lang)}
                  onCheckedChange={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
                />
                <Label htmlFor={`lang-${lang}`} className="cursor-pointer text-sm font-normal">
                  {lang}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-3 block text-sm font-semibold">Category</Label>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${cat}`}
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() => toggleSelection(cat, selectedCategories, setSelectedCategories)}
                />
                <Label htmlFor={`cat-${cat}`} className="cursor-pointer text-sm font-normal">
                  {cat}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-3 block text-sm font-semibold">Min Performance Gain: {performanceGain[0]}%</Label>
          <Slider value={performanceGain} onValueChange={setPerformanceGain} min={0} max={100} step={5} />
        </div>

        <div>
          <Label className="mb-3 block text-sm font-semibold">Price Range</Label>
          <div className="space-y-2">
            {priceRanges.map((price) => (
              <div key={price} className="flex items-center gap-2">
                <Checkbox
                  id={`price-${price}`}
                  checked={selectedPrices.includes(price)}
                  onCheckedChange={() => toggleSelection(price, selectedPrices, setSelectedPrices)}
                />
                <Label htmlFor={`price-${price}`} className="cursor-pointer text-sm font-normal">
                  {price}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
