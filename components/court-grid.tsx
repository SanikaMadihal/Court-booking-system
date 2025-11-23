"use client"

interface CourtGridProps {
  courts: string[]
  selectedCourts: Set<string>
  onToggleCourt: (courtName: string) => void
}

export default function CourtGrid({ courts, selectedCourts, onToggleCourt }: CourtGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {courts.map((court) => (
        <button
          key={court}
          onClick={() => onToggleCourt(court)}
          className={`p-4 rounded-lg border-2 font-semibold text-center transition-all min-h-20 flex items-center justify-center ${
            selectedCourts.has(court)
              ? "bg-green text-white border-green"
              : "bg-white text-foreground border-border hover:border-green hover:bg-green/10"
          }`}
        >
          {court}
        </button>
      ))}
    </div>
  )
}
