interface Booking {
  id: string
  sport: string
  court: string
  date: string
  time: string
  status: "completed" | "cancelled"
}

const BOOKING_HISTORY: Booking[] = [
  {
    id: "BK-001",
    sport: "Badminton",
    court: "Court 1A",
    date: "Dec 15, 2024",
    time: "06:00 - 07:00",
    status: "completed",
  },
  {
    id: "BK-002",
    sport: "Table Tennis",
    court: "Table 3",
    date: "Dec 10, 2024",
    time: "17:00 - 18:00",
    status: "completed",
  },
  {
    id: "BK-003",
    sport: "Squash",
    court: "Court 2B",
    date: "Dec 5, 2024",
    time: "18:30 - 19:30",
    status: "completed",
  },
  {
    id: "BK-004",
    sport: "Badminton",
    court: "Court 2A",
    date: "Nov 28, 2024",
    time: "16:30 - 17:30",
    status: "cancelled",
  },
]

export default function BookingHistory() {
  return (
    <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-border bg-muted">
            <th className="text-left px-6 py-4 font-semibold text-foreground">Booking ID</th>
            <th className="text-left px-6 py-4 font-semibold text-foreground">Sport</th>
            <th className="text-left px-6 py-4 font-semibold text-foreground">Court</th>
            <th className="text-left px-6 py-4 font-semibold text-foreground">Date</th>
            <th className="text-left px-6 py-4 font-semibold text-foreground">Time</th>
            <th className="text-left px-6 py-4 font-semibold text-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {BOOKING_HISTORY.map((booking) => (
            <tr key={booking.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="px-6 py-4 font-semibold text-primary">{booking.id}</td>
              <td className="px-6 py-4 text-foreground">{booking.sport}</td>
              <td className="px-6 py-4 text-foreground">{booking.court}</td>
              <td className="px-6 py-4 text-foreground">{booking.date}</td>
              <td className="px-6 py-4 text-foreground">{booking.time}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === "completed" ? "bg-green/20 text-green" : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
