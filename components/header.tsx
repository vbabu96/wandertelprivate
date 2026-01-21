import { Plane } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">FamilyTravel</h1>
              <p className="text-xs text-muted-foreground">Book Your Perfect Family Vacation</p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/20 text-warning-foreground text-sm">
              🎉 Special: We're testing new family-friendly features - Help us improve!
            </span>
          </div>
        </div>
        <div className="md:hidden mt-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/20 text-warning-foreground text-xs">
            🎉 Testing new features - Help us improve!
          </span>
        </div>
      </div>
    </header>
  )
}
