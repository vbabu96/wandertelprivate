"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Destination } from "@/lib/destinations"
import { trackEvent, updateJourney, getOrCreateJourney } from "@/lib/analytics"

interface CheckoutFormProps {
  destination: Destination
  viewedSafety: boolean
  onBack: () => void
  onViewSafety: () => void
  onComplete: (formData: FormData) => void
}

export interface FormData {
  email: string
}

export function CheckoutForm({ destination, viewedSafety, onBack, onViewSafety, onComplete }: CheckoutFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
  })
  const [showSafetyAlert, setShowSafetyAlert] = useState(!viewedSafety)

  useEffect(() => {
    trackEvent({
      eventName: "checkout_page_viewed",
      destination: destination.id,
      viewedSafety,
      metadata: { showingSafetyAlert: !viewedSafety },
    })

    if (!viewedSafety) {
      updateJourney({ safetyPromptShown: true })
    }
  }, [destination.id, viewedSafety])

  const handleSafetyAlertClick = () => {
    trackEvent({
      eventName: "safety_alert_clicked",
      destination: destination.id,
    })
    updateJourney({ safetyPromptClicked: true })
    onViewSafety()
  }

  const taxRate = 0.12
  const taxes = Math.round(destination.price * taxRate)
  const total = destination.price + taxes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const journey = getOrCreateJourney()
    let safetyViewedAt: "before_booking" | "at_checkout" | "never" = "never"

    if (journey.safetyViewedFor.includes(destination.id)) {
      safetyViewedAt = journey.safetyPromptClicked ? "at_checkout" : "before_booking"
    }

    trackEvent({
      eventName: "booking_completed",
      destination: destination.id,
      viewedSafety: journey.safetyViewedFor.includes(destination.id),
      safetyViewedAt,
      timeViewingSafety: journey.totalSafetyViewTime,
      completedBooking: true,
      emailCaptured: !!formData.email,
    })

    updateJourney({ bookingCompleted: true })
    onComplete(formData)
  }

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Destinations
        </Button>

        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold text-foreground">Complete Your Booking</h1>
          <span className="text-sm text-muted-foreground">Step 1 of 2</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <Card className="md:col-span-1 h-fit bg-card">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src={destination.image || "/placeholder.svg"}
                alt={destination.title}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-card-foreground">{destination.title}</h3>
                <p className="text-sm text-muted-foreground">{destination.location}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>3 nights • 2 adults, 2 kids</p>
                <p>May 15-18, 2025</p>
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Package</span>
                  <span className="text-card-foreground">${destination.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes & fees</span>
                  <span className="text-card-foreground">${taxes}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border">
                  <span className="text-card-foreground">Total</span>
                  <span className="text-card-foreground">${total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Safety Alert */}
            {showSafetyAlert && (
              <Alert className="border-warning bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning-foreground" />
                <AlertTitle className="text-warning-foreground font-semibold">Before you book...</AlertTitle>
                <AlertDescription className="text-warning-foreground/80">
                  <p className="mb-3">Did you know you can check family safety features for this destination?</p>
                  <Button
                    variant="outline"
                    className="gap-2 border-safety text-safety hover:bg-safety/10 bg-transparent"
                    onClick={handleSafetyAlertClick}
                  >
                    <Shield className="w-4 h-4" />
                    View Safety Report - Takes 30 seconds
                  </Button>
                  <p className="text-xs mt-2 text-muted-foreground">
                    Helping 87% of families book with more confidence
                  </p>
                </AlertDescription>
              </Alert>
            )}

              <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email (Optional) */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-card-foreground">
                      Email <span className="text-muted-foreground text-sm">(optional)</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="john@example.com"
                      className="bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll send you booking confirmation and travel tips
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Complete Booking - ${total.toLocaleString()}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  This is a prototype - no actual booking will be made.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
