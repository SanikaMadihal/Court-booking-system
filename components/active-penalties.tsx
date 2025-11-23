interface Penalty {
  id: string
  type: string
  reason: string
  startDate: string
  endDate: string
  severity: "low" | "medium" | "high"
}

const PENALTIES: Penalty[] = [
  {
    id: "PEN-001",
    type: "No-show Penalty",
    reason: "Missed booking on Dec 1, 2024",
    startDate: "Dec 2, 2024",
    endDate: "Dec 8, 2024",
    severity: "low",
  },
  {
    id: "PEN-002",
    type: "Late Cancellation",
    reason: "Cancelled within 1 hour of booking",
    startDate: "Nov 25, 2024",
    endDate: "Nov 27, 2024",
    severity: "low",
  },
]

export default function ActivePenalties() {
  // Show empty state if no penalties
  if (PENALTIES.length === 0) {
    return (
      <div className="bg-green/10 border-2 border-green rounded-lg p-12 text-center">
        <p className="text-lg font-semibold text-green mb-2">No Active Penalties</p>
        <p className="text-muted-foreground">Keep up the great work maintaining the facility rules!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {PENALTIES.map((penalty) => (
        <div key={penalty.id} className="bg-card border-2 border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold text-foreground">{penalty.type}</h4>
              <p className="text-sm text-muted-foreground">{penalty.reason}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                penalty.severity === "high"
                  ? "bg-destructive/20 text-destructive"
                  : penalty.severity === "medium"
                    ? "bg-secondary/20 text-secondary"
                    : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {penalty.severity.charAt(0).toUpperCase() + penalty.severity.slice(1)}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-foreground">
              <span className="font-semibold">Active from:</span> {penalty.startDate}
            </p>
            <p className="text-foreground">
              <span className="font-semibold">Expires:</span> {penalty.endDate}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
