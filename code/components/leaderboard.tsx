"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, Award } from "lucide-react"

const weeklyLeaders = [
  {
    rank: 1,
    name: "Sarah Chen",
    username: "sarah_dev",
    avatar: "/placeholder.svg?key=1xx32",
    score: 12847,
    change: "+342",
    badge: "Performance Expert",
  },
  {
    rank: 2,
    name: "Alex Rodriguez",
    username: "alexchen",
    avatar: "/placeholder.svg?key=1xx33",
    score: 11523,
    change: "+298",
    badge: "Algorithm Master",
  },
  {
    rank: 3,
    name: "DB Master",
    username: "dbmaster",
    avatar: "/placeholder.svg?key=1xx34",
    score: 10891,
    change: "+276",
    badge: "Database Guru",
  },
  {
    rank: 4,
    name: "Perf Ninja",
    username: "perf_ninja",
    avatar: "/placeholder.svg?key=1xx35",
    score: 9654,
    change: "+234",
    badge: "Speed Demon",
  },
  {
    rank: 5,
    name: "Rustacean Pro",
    username: "rustacean",
    avatar: "/placeholder.svg?key=1xx36",
    score: 8932,
    change: "+198",
    badge: "Systems Expert",
  },
]

const allTimeLeaders = [
  {
    rank: 1,
    name: "DB Master",
    username: "dbmaster",
    avatar: "/placeholder.svg?key=1xx34",
    score: 156789,
    change: "—",
    badge: "Legend",
  },
  {
    rank: 2,
    name: "Sarah Chen",
    username: "sarah_dev",
    avatar: "/placeholder.svg?key=1xx32",
    score: 145234,
    change: "—",
    badge: "Performance Expert",
  },
  {
    rank: 3,
    name: "Perf Ninja",
    username: "perf_ninja",
    avatar: "/placeholder.svg?key=1xx35",
    score: 132456,
    change: "—",
    badge: "Speed Demon",
  },
  {
    rank: 4,
    name: "Alex Rodriguez",
    username: "alexchen",
    avatar: "/placeholder.svg?key=1xx33",
    score: 128901,
    change: "—",
    badge: "Algorithm Master",
  },
  {
    rank: 5,
    name: "Gopher Pro",
    username: "gopher_pro",
    avatar: "/placeholder.svg?key=1xx37",
    score: 119876,
    change: "—",
    badge: "Concurrency King",
  },
]

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState("weekly")

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-[#FFD700]" />
    if (rank === 2) return <Trophy className="h-5 w-5 text-[#C0C0C0]" />
    if (rank === 3) return <Trophy className="h-5 w-5 text-[#CD7F32]" />
    return <span className="text-muted-foreground">#{rank}</span>
  }

  const leaders = activeTab === "weekly" ? weeklyLeaders : allTimeLeaders

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <Award className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Leaderboard</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="alltime">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-6">
          <div className="space-y-4">
            {leaders.map((leader) => (
              <div
                key={leader.username}
                className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex w-8 items-center justify-center">{getRankIcon(leader.rank)}</div>

                <Avatar className="h-12 w-12">
                  <AvatarImage src={leader.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{leader.name.slice(0, 2)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{leader.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {leader.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">@{leader.username}</p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">{leader.score.toLocaleString()}</p>
                  {leader.change !== "—" && (
                    <p className="flex items-center gap-1 text-sm text-success">
                      <TrendingUp className="h-3 w-3" />
                      {leader.change}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alltime" className="mt-6">
          <div className="space-y-4">
            {leaders.map((leader) => (
              <div
                key={leader.username}
                className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex w-8 items-center justify-center">{getRankIcon(leader.rank)}</div>

                <Avatar className="h-12 w-12">
                  <AvatarImage src={leader.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{leader.name.slice(0, 2)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{leader.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {leader.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">@{leader.username}</p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">{leader.score.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
