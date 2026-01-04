"use client"

import { useState, useEffect } from "react"
import { Loader2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Booking {
  id: string
  court: {
    name: string
    sport: string
  }
  date: string
  startTime: string
  endTime: string
  status: "confirmed" | "cancelled" | "completed"
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return

    setCancellingId(bookingId)
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      })

      if (response.ok) {
        // Refresh bookings
        fetchBookings()
      } else {
        alert("Failed to cancel booking")
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
      alert("An error occurred")
    } finally {
      setCancellingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bookings found.
      </div>
    )
  }

  return (
    <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-border bg-muted">
              <th className="text-left px-6 py-4 font-semibold text-foreground">Sport</th>
              <th className="text-left px-6 py-4 font-semibold text-foreground">Court</th>
              <th className="text-left px-6 py-4 font-semibold text-foreground">Date</th>
              <th className="text-left px-6 py-4 font-semibold text-foreground">Time</th>
              <th className="text-left px-6 py-4 font-semibold text-foreground">Status</th>
              <th className="text-left px-6 py-4 font-semibold text-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-foreground capitalize">{booking.court.sport}</td>
                <td className="px-6 py-4 text-foreground">{booking.court.name}</td>
                <td className="px-6 py-4 text-foreground">
                  {new Date(booking.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-foreground">
                  {booking.startTime} - {booking.endTime}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {booking.status === "confirmed" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="flex items-center gap-1"
                    >
                      {cancellingId === booking.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
