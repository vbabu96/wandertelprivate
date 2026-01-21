"use client"

import { Star, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Destination } from "@/lib/destinations"

interface DestinationCardProps {
  destination: Destination
  onViewSafety: (destination: Destination) => void
  onBook: (destination: Destination) => void
}

export function DestinationCard({ destination, onViewSafety, onBook }: DestinationCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card">
      <div className="relative">
        <img
          src={destination.image || "/placeholder.svg"}
          alt={destination.title}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-card/90 text-card-foreground hover:bg-card/90">
          {destination.badge}
        </Badge>
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-card-foreground">{destination.title}</h3>
          <p className="text-sm text-muted-foreground">{destination.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(destination.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">{destination.rating}/5</span>
          </div>
          <p className="font-bold text-lg text-card-foreground">
            ${destination.price.toLocaleString()}
            <span className="text-xs font-normal text-muted-foreground"> /3 nights</span>
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="outline"
            className="w-full gap-2 border-safety text-safety hover:bg-safety/10 bg-transparent"
            onClick={() => onViewSafety(destination)}
          >
            <Shield className="w-4 h-4" />
            View Safety Features
          </Button>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => onBook(destination)}
          >
            Book Now - ${destination.price.toLocaleString()}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
