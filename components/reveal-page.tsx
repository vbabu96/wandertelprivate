"use client"

import { useState } from "react"
import { PartyPopper, Copy, Check, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { trackEvent, exportToCSV, getOrCreateJourney } from "@/lib/analytics"
import type { FormData } from "@/components/checkout-form"

interface RevealPageProps {
  viewedSafety: boolean
  formData: FormData
  onClose: () => void
}

type SurveyResponse = "yes" | "maybe" | "no" | null
type NotifyResponse = "yes" | "no" | null

const safetyFeatures = [
  { id: "neighborhood", label: "Neighborhood safety / crime rates" },
  { id: "medical", label: "Nearby hospitals and medical care" },
  { id: "restaurants", label: "Kid-friendly restaurants and activities" },
  { id: "playgrounds", label: "Playgrounds and outdoor spaces" },
  { id: "health", label: "Health requirements (vaccines, etc.)" },
  { id: "weather", label: "Weather and seasonal considerations" },
  { id: "emergency", label: "Emergency contacts and resources" },
  { id: "customs", label: "Local customs and tips" },
]

export function RevealPage({ viewedSafety, formData, onClose }: RevealPageProps) {
  const [helpfulResponse, setHelpfulResponse] = useState<SurveyResponse>(null)
  const [importantFeatures, setImportantFeatures] = useState<string[]>([])
  const [notifyResponse, setNotifyResponse] = useState<NotifyResponse>(null)
  const [email, setEmail] = useState(formData.email)
  const [sendTips, setSendTips] = useState(false)
  const [copied, setCopied] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const journey = getOrCreateJourney()

  const handleHelpfulResponse = (response: SurveyResponse) => {
    setHelpfulResponse(response)
    trackEvent({
      eventName: "survey_helpful_response",
      surveyResponses: { helpful: response },
    })
  }

  const toggleFeature = (featureId: string) => {
    setImportantFeatures((prev) => {
      const updated = prev.includes(featureId) ? prev.filter((f) => f !== featureId) : [...prev, featureId]

      trackEvent({
        eventName: "survey_features_updated",
        surveyResponses: { importantFeatures: updated },
      })

      return updated
    })
  }

  const handleNotifyResponse = (response: NotifyResponse) => {
    setNotifyResponse(response)
    trackEvent({
      eventName: "survey_notify_response",
      surveyResponses: { notify: response },
      emailCaptured: response === "yes",
    })
  }

  const handleSubmit = () => {
    trackEvent({
      eventName: "survey_completed",
      surveyResponses: {
        helpful: helpfulResponse,
        importantFeatures,
        notify: notifyResponse,
        email: notifyResponse === "yes" ? email : null,
        sendTips,
      },
      emailCaptured: notifyResponse === "yes" && !!email,
    })
    setSubmitted(true)
  }

  const handleShare = (platform: string) => {
    trackEvent({
      eventName: "share_clicked",
      metadata: { platform },
    })

    const url = window.location.href
    const text = "Check out this family travel safety feature prototype!"

    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        "_blank",
      )
    } else if (platform === "copy") {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleExportData = () => {
    const csv = exportToCSV()
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `family-travel-analytics-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-card">
        <CardContent className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <PartyPopper className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-card-foreground">Thank You! 🎉</h1>
          </div>

          {/* Main Message */}
          <div className="bg-secondary/50 rounded-xl p-6 text-center space-y-3">
            <p className="font-semibold text-card-foreground">IMPORTANT: This was a test - you were NOT charged!</p>
            <p className="text-muted-foreground">
              {`We're building a new family travel safety feature and wanted to see if YOU would use it.`}
            </p>
            <p className="text-muted-foreground">Your feedback is incredibly valuable.</p>
          </div>

          {/* Behavior Notice */}
          <div className={`p-4 rounded-lg ${viewedSafety ? "bg-safety/10" : "bg-warning/10"}`}>
            <p className={viewedSafety ? "text-safety" : "text-warning-foreground"}>
              {viewedSafety
                ? "We noticed you checked the safety information before booking. That's exactly what we're building!"
                : "We noticed you booked without checking our safety features. That's okay - we're trying to understand traveler behavior!"}
            </p>
          </div>

          {!submitted ? (
            <>
              {/* Question 1 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-card-foreground">
                  Would family safety information (neighborhood safety, nearby hospitals, kid-friendly areas) be helpful
                  when booking trips?
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "yes" as const, emoji: "😍", label: "YES - I would definitely use this!" },
                    { value: "maybe" as const, emoji: "🤔", label: "MAYBE - Depends on the destination" },
                    { value: "no" as const, emoji: "😐", label: "NO - I don't need this information" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={helpfulResponse === option.value ? "default" : "outline"}
                      className={`flex-1 min-w-[200px] ${helpfulResponse === option.value ? "bg-primary text-primary-foreground" : ""}`}
                      onClick={() => handleHelpfulResponse(option.value)}
                    >
                      <span className="mr-2">{option.emoji}</span>
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Question 2 (conditional) */}
              {(helpfulResponse === "yes" || helpfulResponse === "maybe") && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">
                    What safety information matters MOST to you when traveling with kids?
                  </h3>
                  <p className="text-sm text-muted-foreground">Select all that apply</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {safetyFeatures.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer"
                        onClick={() => toggleFeature(feature.id)}
                      >
                        <Checkbox
                          id={feature.id}
                          checked={importantFeatures.includes(feature.id)}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                        <Label htmlFor={feature.id} className="cursor-pointer text-card-foreground">
                          {feature.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Question 3 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-card-foreground">
                  Would you like to be notified when this feature launches on real booking sites?
                </h3>
                <div className="flex gap-3">
                  <Button
                    variant={notifyResponse === "yes" ? "default" : "outline"}
                    className={notifyResponse === "yes" ? "bg-primary text-primary-foreground" : ""}
                    onClick={() => handleNotifyResponse("yes")}
                  >
                    YES - Keep me posted!
                  </Button>
                  <Button
                    variant={notifyResponse === "no" ? "default" : "outline"}
                    className={notifyResponse === "no" ? "bg-primary text-primary-foreground" : ""}
                    onClick={() => handleNotifyResponse("no")}
                  >
                    NO - Just wanted to try the demo
                  </Button>
                </div>

                {notifyResponse === "yes" && (
                  <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="notifyEmail" className="text-card-foreground">
                        Email
                      </Label>
                      <Input
                        id="notifyEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="bg-background"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tips" checked={sendTips} onCheckedChange={(checked) => setSendTips(!!checked)} />
                      <Label htmlFor="tips" className="text-muted-foreground">
                        Also send me family travel tips (optional)
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleSubmit}
                disabled={!helpfulResponse}
              >
                Submit Feedback
              </Button>
            </>
          ) : (
            <>
              {/* Thank You Message */}
              <div className="text-center space-y-4 py-6">
                <p className="text-lg text-card-foreground">Thank you so much for your time!</p>
                <p className="text-muted-foreground">Your input helps us build better tools for family travelers.</p>
                <p className="text-muted-foreground">
                  Feel free to share this with other parents who might find it useful!
                </p>
              </div>

              {/* Share Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" onClick={() => handleShare("facebook")}>
                  Share on Facebook
                </Button>
                <Button variant="outline" onClick={() => handleShare("twitter")}>
                  Share on Twitter
                </Button>
                <Button variant="outline" onClick={() => handleShare("copy")} className="gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>

              {/* Export Data Button */}
              <div className="pt-4 border-t border-border">
                <Button variant="outline" onClick={handleExportData} className="w-full gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Export Analytics Data (CSV)
                </Button>
              </div>
            </>
          )}

          {/* Close Button */}
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
