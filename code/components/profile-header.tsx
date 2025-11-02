"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Share2 } from "lucide-react"

export function ProfileHeader() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/developer-avatar.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">John Developer</h1>
          <p className="mt-1 text-muted-foreground">@johndev</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">Top Contributor</Badge>
            <Badge variant="secondary">Performance Expert</Badge>
            <Badge variant="secondary">Early Adopter</Badge>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            Full-stack developer passionate about code optimization and performance. Specializing in JavaScript, Python,
            and Go. 5+ years of experience in building scalable applications.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>
    </div>
  )
}
