"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { DestinationCard } from "@/components/destination-card"
import { SafetyModal } from "@/components/safety-modal"
import { CheckoutForm, type FormData } from "@/components/checkout-form"
import { RevealPage } from "@/components/reveal-page"
import { destinations, type Destination } from "@/lib/destinations"
import { trackEvent, updateJourney, getOrCreateJourney, type UserJourney } from "@/lib/analytics"

type View = "landing" | "checkout" | "reveal"

const defaultJourney: UserJourney = {
  destinationsViewed: [],
  safetyViewedFor: [],
  bookingAttemptedFor: null,
  safetyPromptShown: false,
  safetyPromptClicked: false,
  bookingCompleted: false,
  safetyViewStartTime: null,
  totalSafetyViewTime: 0,
}

export default function Home() {
  const [view, setView] = useState<View>("landing")
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [safetyModalOpen, setSafetyModalOpen] = useState(false)
  const [safetyModalDestination, setSafetyModalDestination] = useState<Destination | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [journey, setJourney] = useState<UserJourney>(defaultJourney)

  useEffect(() => {
    setJourney(getOrCreateJourney())
    trackEvent({ eventName: "landing_page_view" })
  }, [])

  const hasViewedSafetyForSelected = selectedDestination
    ? journey.safetyViewedFor.includes(selectedDestination.id)
    : false

  const handleViewSafety = (destination: Destination) => {
    setSafetyModalDestination(destination)
    setSafetyModalOpen(true)

    if (!journey.destinationsViewed.includes(destination.id)) {
      const updated = updateJourney({
        destinationsViewed: [...journey.destinationsViewed, destination.id],
      })
      setJourney(updated)
    }
  }

  const handleBookDirect = (destination: Destination) => {
    trackEvent({
      eventName: "book_now_clicked",
      destination: destination.id,
      viewedSafety: journey.safetyViewedFor.includes(destination.id),
    })

    const updated = updateJourney({ bookingAttemptedFor: destination.id })
    setJourney(updated)
    setSelectedDestination(destination)
    setView("checkout")
  }

  const handleBookFromSafety = (destination: Destination) => {
    setSafetyModalOpen(false)
    const updated = updateJourney({ bookingAttemptedFor: destination.id })
    setJourney(updated)
    setSelectedDestination(destination)
    setView("checkout")
  }

  const handleViewSafetyFromCheckout = () => {
    if (selectedDestination) {
      setSafetyModalDestination(selectedDestination)
      setSafetyModalOpen(true)
    }
  }

  const handleCompleteBooking = (data: FormData) => {
    setFormData(data)
    setView("reveal")
  }

  const handleClose = () => {
    setView("landing")
    setSelectedDestination(null)
    setFormData(null)
  }

  const handleSafetyModalClose = () => {
    setSafetyModalOpen(false)
    setJourney(getOrCreateJourney())
  }

  if (view === "checkout" && selectedDestination) {
    return (
      <>
        <CheckoutForm
          destination={selectedDestination}
          viewedSafety={hasViewedSafetyForSelected}
          onBack={() => setView("landing")}
          onViewSafety={handleViewSafetyFromCheckout}
          onComplete={handleCompleteBooking}
        />
        <SafetyModal
          destination={safetyModalDestination}
          isOpen={safetyModalOpen}
          onClose={handleSafetyModalClose}
          onBook={handleBookFromSafety}
        />
      </>
    )
  }

  if (view === "reveal" && formData) {
    return <RevealPage viewedSafety={hasViewedSafetyForSelected} formData={formData} onClose={handleClose} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            Where Should Your Family Go Next?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Click any destination to see details and exclusive family packages
          </p>
        </div>

        {/* Destination Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onViewSafety={handleViewSafety}
              onBook={handleBookDirect}
            />
          ))}
        </div>
      </main>

      {/* Safety Modal */}
      <SafetyModal
        destination={safetyModalDestination}
        isOpen={safetyModalOpen}
        onClose={handleSafetyModalClose}
        onBook={handleBookFromSafety}
      />
    </div>
  )
}
