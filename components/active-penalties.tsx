"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface Penalty {
  id: string
  reason: string
  severity: string
  status: string
  issuedDate: string
  expiresAt: string | null
}

export default function ActivePenalties() {
  const [penalties, setPenalties] = useState<Penalty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        const response = await fetch("/api/penalties")
        if (response.ok) {
          const data = await response.json()
          setPenalties(data)
        }
      } catch (error) {
        console.error("Error fetching penalties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPenalties()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Show empty state if no penalties
  if (penalties.length === 0) {
    return (
      <div className="bg-green/10 border-2 border-green rounded-lg p-12 text-center">
        <p className="text-lg font-semibold text-green mb-2">No Active Penalties</p>
        <p className="text-muted-foreground">Keep up the great work maintaining the facility rules!</p>
      </div>
    )
  }

  const getRestrictionText = (severity: string): string => {
    if (severity === "low") return "Warning - No booking restrictions"
    if (severity === "medium") return "Maximum 3 bookings per week"
    if (severity === "high") return "Maximum 2 bookings per week"
    return "Unknown"
  }

  return (
    <div className="space-y-4">
      {penalties.map((penalty) => {
        return (
          <div key={penalty.id} className="bg-card border-2 border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-bold text-foreground capitalize">{penalty.severity} Penalty</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      penalty.severity === "high"
                        ? "bg-destructive/20 text-destructive"
                        : penalty.severity === "medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {penalty.status.charAt(0).toUpperCase() + penalty.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm font-semibold text-primary mb-1">{getRestrictionText(penalty.severity)}</p>
                <p className="text-sm text-muted-foreground">{penalty.reason}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm border-t border-border pt-3 mt-3">
              <p className="text-foreground">
                <span className="font-semibold">Issued:</span> {new Date(penalty.issuedDate).toLocaleDateString("en-IN")}
              </p>
              {penalty.expiresAt && (
                <p className="text-foreground">
                  <span className="font-semibold">Expires:</span> {new Date(penalty.expiresAt).toLocaleDateString("en-IN")}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
