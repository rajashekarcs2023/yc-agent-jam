import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Heart, Share2, TrendingUp } from "lucide-react"

const posts = [
  {
    id: 1,
    author: "Sarah Chen",
    username: "sarah_dev",
    avatar: "/placeholder.svg?key=1xx32",
    time: "2 hours ago",
    content:
      "Just published a new optimization for binary search trees! Achieved 67% performance improvement using AVL rotations. Check it out in the marketplace!",
    language: "Python",
    performanceGain: 67,
    likes: 234,
    comments: 45,
  },
  {
    id: 2,
    author: "Alex Rodriguez",
    username: "alexchen",
    avatar: "/placeholder.svg?key=1xx33",
    time: "5 hours ago",
    content:
      "Experimenting with parallel processing for large arrays. Early results show 3x speedup on multi-core systems. Will share the code once I optimize it further.",
    language: "JavaScript",
    performanceGain: 200,
    likes: 189,
    comments: 32,
  },
  {
    id: 3,
    author: "DB Master",
    username: "dbmaster",
    avatar: "/placeholder.svg?key=1xx34",
    time: "1 day ago",
    content:
      "Pro tip: Always batch your database queries when possible. My new query optimizer reduces DB calls by 80% using intelligent batching and caching.",
    language: "TypeScript",
    performanceGain: 80,
    likes: 456,
    comments: 78,
  },
]

export function CommunityFeed() {
  return (
    <Card className="p-6">
      <h2 className="mb-6 text-2xl font-bold">Community Feed</h2>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="border-b border-border pb-6 last:border-0">
            <div className="mb-3 flex items-start gap-3">
              <Avatar>
                <AvatarImage src={post.avatar || "/placeholder.svg"} />
                <AvatarFallback>{post.author.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{post.author}</h3>
                  <span className="text-sm text-muted-foreground">@{post.username}</span>
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">{post.time}</span>
                </div>
                <p className="mt-2 text-sm">{post.content}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline">{post.language}</Badge>
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3" />+{post.performanceGain}%
                  </Badge>
                </div>
              </div>
            </div>

            <div className="ml-12 flex items-center gap-6 text-sm text-muted-foreground">
              <Button variant="ghost" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                {post.likes}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                {post.comments}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
