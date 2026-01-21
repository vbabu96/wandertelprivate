"use client"

import { useEffect, useRef } from "react"
import { X, Star, Home, Hospital, FerrisWheel, Syringe, Sun, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Destination } from "@/lib/destinations"
import { trackEvent, updateJourney, getOrCreateJourney } from "@/lib/analytics"

interface SafetyModalProps {
  destination: Destination | null
  isOpen: boolean
  onClose: () => void
  onBook: (destination: Destination) => void
}

export function SafetyModal({ destination, isOpen, onClose, onBook }: SafetyModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const openTimeRef = useRef<number>(0)

  useEffect(() => {
    if (isOpen && destination) {
      openTimeRef.current = Date.now()

      // Track modal open
      trackEvent({
        eventName: "safety_modal_opened",
        destination: destination.id,
        metadata: { destinationTitle: destination.title },
      })

      // Update journey
      const journey = getOrCreateJourney()
      if (!journey.safetyViewedFor.includes(destination.id)) {
        updateJourney({
          safetyViewedFor: [...journey.safetyViewedFor, destination.id],
          safetyViewStartTime: Date.now(),
        })
      }
    }

    return () => {
      if (openTimeRef.current && destination) {
        const timeSpent = Math.round((Date.now() - openTimeRef.current) / 1000)
        const journey = getOrCreateJourney()
        updateJourney({
          totalSafetyViewTime: journey.totalSafetyViewTime + timeSpent,
        })

        trackEvent({
          eventName: "safety_modal_closed",
          destination: destination.id,
          timeViewingSafety: timeSpent,
        })
      }
    }
  }, [isOpen, destination])

  if (!destination) return null

  const sections = [
    { icon: Home, title: "Neighborhood Safety", items: destination.safetyData.neighborhood },
    { icon: Hospital, title: "Medical Access", items: destination.safetyData.medical },
    { icon: FerrisWheel, title: "Family Essentials Nearby", items: destination.safetyData.essentials },
    { icon: Syringe, title: "Health & Travel Requirements", items: destination.safetyData.health },
    { icon: Sun, title: "Weather & Seasonal Info", items: destination.safetyData.weather },
    { icon: Lightbulb, title: "Local Tips", items: destination.safetyData.tips },
  ]

  const handleBook = () => {
    trackEvent({
      eventName: "book_from_safety_modal",
      destination: destination.id,
      viewedSafety: true,
      safetyViewedAt: "before_booking",
    })
    onBook(destination)
  }

  const handleBackToDestinations = () => {
    trackEvent({
      eventName: "back_to_destinations",
      destination: destination.id,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col bg-card">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-card-foreground">
              {destination.location} Family Safety Overview 🛡️
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">Everything you need to know for a safe, stress-free trip</p>
        </DialogHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 space-y-6 py-4">
          {/* Overall Safety Score */}
          <div className="text-center p-6 bg-safety/10 rounded-xl">
            <div className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(destination.safetyScore)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <p className="text-2xl font-bold text-card-foreground">{destination.safetyScore}/5</p>
            <p className="text-muted-foreground">Rated very safe for families with children</p>
          </div>

          {/* Safety Sections */}
          {sections.map((section, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground">{section.title}</h3>
              </div>
              <ul className="ml-10 space-y-1">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-safety mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex-shrink-0 border-t border-border pt-4 space-y-3">
          <p className="text-center font-semibold text-card-foreground">Feeling confident about this trip?</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleBook}>
              Book Now - ${destination.price.toLocaleString()}
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleBackToDestinations}>
              Back to Destinations
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
