"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Clock, 
  User,
  AlertTriangle,
  XCircle,
  Loader2,
  X
} from "lucide-react"

interface Booking {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  participants: number
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  court: {
    id: string
    name: string
    sport: string
  }
}

export default function ManageBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [cancelNote, setCancelNote] = useState("")
  const [penaltyLevel, setPenaltyLevel] = useState("no-penalty")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/staff/login")
      return
    }

    if (session.user.role !== "staff" && session.user.role !== "admin") {
      router.push("/")
      return
    }

    fetchBookings()
  }, [session, status, router])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings/all")
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

  const handleNoShow = async (booking: Booking) => {
    if (!confirm(`Mark ${booking.user.name}'s booking as No Show? This will issue a low penalty.`)) {
      return
    }

    setActionLoading(booking.id)
    try {
      const response = await fetch("/api/staff/manage-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          action: "no-show",
          userId: booking.user.id
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to process no-show")
      }

      alert("Booking cancelled and penalty issued for no-show")
      fetchBookings()
    } catch (error) {
      console.error("Error processing no-show:", error)
      alert(error instanceof Error ? error.message : "Failed to process no-show")
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelBooking = async () => {
    if (!selectedBooking) return
    if (!cancelNote.trim()) {
      alert("Please enter a cancellation note")
      return
    }

    setActionLoading(selectedBooking.id)
    try {
      const response = await fetch("/api/staff/manage-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          action: "cancel",
          userId: selectedBooking.user.id,
          note: cancelNote,
          penaltyLevel
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to cancel booking")
      }

      alert("Booking cancelled successfully")
      setShowCancelModal(false)
      setSelectedBooking(null)
      setCancelNote("")
      setPenaltyLevel("no-penalty")
      fetchBookings()
    } catch (error) {
      console.error("Error cancelling booking:", error)
      alert(error instanceof Error ? error.message : "Failed to cancel booking")
    } finally {
      setActionLoading(null)
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (filterStatus === "all") return true
    return booking.status === filterStatus
  })

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Manage Bookings</h1>
          <p className="text-muted-foreground">View and manage all court bookings</p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          {["all", "confirmed", "cancelled", "completed"].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                filterStatus === status
                  ? "bg-primary text-white"
                  : "bg-white text-foreground border-2 border-border hover:border-primary"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg border-2 border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Court</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-foreground">{booking.user.name}</div>
                          <div className="text-sm text-muted-foreground">{booking.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-foreground">{booking.court.name}</div>
                          <div className="text-sm text-muted-foreground capitalize">{booking.court.sport}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Clock className="w-4 h-4" />
                          <span>{booking.startTime} - {booking.endTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "confirmed" 
                            ? "bg-green-100 text-green-700"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {booking.status === "confirmed" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleNoShow(booking)}
                              disabled={actionLoading === booking.id}
                              className="bg-orange-500 text-white hover:bg-orange-600"
                            >
                              {actionLoading === booking.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  No Show
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking)
                                setShowCancelModal(true)
                              }}
                              disabled={actionLoading === booking.id}
                              className="bg-red-500 text-white hover:bg-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cancel Booking Modal */}
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Cancel Booking</h2>
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setSelectedBooking(null)
                    setCancelNote("")
                    setPenaltyLevel("no-penalty")
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Cancelling booking for <strong>{selectedBooking.user.name}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.court.name} - {new Date(selectedBooking.date).toLocaleDateString()} at {selectedBooking.startTime}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Cancellation Note *
                  </label>
                  <textarea
                    value={cancelNote}
                    onChange={(e) => setCancelNote(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                    rows={3}
                    placeholder="Enter reason for cancellation..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Penalty Level
                  </label>
                  <select
                    value={penaltyLevel}
                    onChange={(e) => setPenaltyLevel(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="no-penalty">No Penalty</option>
                    <option value="low">Low - Warning Only</option>
                    <option value="medium">Medium - Max 3 bookings/week</option>
                    <option value="high">High - Max 2 bookings/week</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-2">
                    {penaltyLevel === "low" && "Warning expires in 30 days"}
                    {penaltyLevel === "medium" && "Restriction expires in 90 days"}
                    {penaltyLevel === "high" && "Restriction expires in 90 days"}
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleCancelBooking}
                    disabled={actionLoading === selectedBooking.id}
                    className="flex-1 bg-red-500 text-white hover:bg-red-600"
                  >
                    {actionLoading === selectedBooking.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Confirm Cancellation"
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCancelModal(false)
                      setSelectedBooking(null)
                      setCancelNote("")
                      setPenaltyLevel("no-penalty")
                    }}
                    className="bg-muted text-foreground hover:bg-muted/80"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
