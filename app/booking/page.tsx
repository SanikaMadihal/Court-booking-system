"use client"

import { useState, useMemo, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type Sport = "badminton" | "table-tennis" | "squash"

interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
  currentBookings: number
}

interface Court {
  id: string
  name: string
  sport: string
  courtNumber: number
  maxCapacity: number
}

interface Booking {
  id: string
  courtId: string
  date: string
  startTime: string
  endTime: string
  participants: number
}

const COURT_CONFIG: Record<Sport, { label: string; icon: string; courts: number; maxCapacity: number }> = {
  badminton: {
    label: "Badminton",
    icon: "🏸",
    courts: 2,
    maxCapacity: 4,
  },
  "table-tennis": {
    label: "Table Tennis",
    icon: "🏓",
    courts: 3,
    maxCapacity: 4,
  },
  squash: {
    label: "Squash",
    icon: "🟡",
    courts: 2,
    maxCapacity: 2,
  },
}

const generateTimeSlots = (selectedDate: Date): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const startHour = 6
  const endHour = 20
  const now = new Date()
  const isToday = selectedDate.toDateString() === now.toDateString()

  let currentHour = startHour
  let currentMin = 0

  while (currentHour < endHour) {
    const startTimeStr = `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`
    const endMin = currentMin + 50
    let endHourCalc = currentHour
    let adjustedEndMin = endMin

    if (endMin >= 60) {
      endHourCalc = currentHour + 1
      adjustedEndMin = endMin - 60
    }

    const endTimeStr = `${String(endHourCalc).padStart(2, "0")}:${String(adjustedEndMin).padStart(2, "0")}`
    
    // Create datetime for the slot
    const slotDateTime = new Date(selectedDate)
    slotDateTime.setHours(currentHour, currentMin, 0, 0)
    
    // Check if slot is within 24 hours from now
    const hoursDiff = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    const isAvailable = hoursDiff >= 0 && hoursDiff <= 24

    slots.push({ 
      startTime: startTimeStr, 
      endTime: endTimeStr,
      isAvailable,
      currentBookings: 0
    })

    currentMin += 60
    if (currentMin >= 60) {
      currentHour += 1
      currentMin = 0
    }
  }

  return slots
}

export default function BookingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedSport, setSelectedSport] = useState<Sport>("badminton")
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null)
  const [courts, setCourts] = useState<Court[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  const availableDates = useMemo(() => {
    const dates = []
    const today = new Date()
    // Show today and tomorrow only (24-hour window)
    for (let i = 0; i < 2; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  }, [])

  const currentDate = availableDates[selectedDate]
  const dateString = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  const TIME_SLOTS = useMemo(() => generateTimeSlots(currentDate), [currentDate])

  // Fetch courts and bookings
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [courtsRes, bookingsRes] = await Promise.all([
          fetch(`/api/courts?sport=${selectedSport}`),
          fetch(`/api/bookings/all?date=${currentDate.toISOString()}`)
        ])

        if (courtsRes.ok) {
          const courtsData = await courtsRes.json()
          setCourts(courtsData)
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json()
          setBookings(bookingsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedSport, currentDate])

  const getSlotBookingCount = (courtId: string, startTime: string): number => {
    return bookings.filter(
      (b) => 
        b.courtId === courtId && 
        b.startTime === startTime &&
        new Date(b.date).toDateString() === currentDate.toDateString()
    ).reduce((sum, b) => sum + b.participants, 0)
  }

  const toggleSlot = (courtId: string, courtName: string, timeSlot: string, startTime: string) => {
    const slotId = `${courtName} - ${timeSlot}`
    if (selectedSlot === slotId) {
      setSelectedSlot(null)
      setSelectedCourtId(null)
    } else {
      setSelectedSlot(slotId)
      setSelectedCourtId(courtId)
    }
  }

  const handleBooking = async () => {
    if (!selectedSlot || !selectedCourtId) {
      alert("Please select one time slot")
      return
    }

    if (!session) {
      alert("Please login to make a booking")
      router.push("/login")
      return
    }

    const timeRange = selectedSlot.split(" - ")[1]
    const [startTime, endTime] = timeRange.split("-")

    setBookingLoading(true)
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courtId: selectedCourtId,
          date: currentDate.toISOString(),
          startTime: startTime.trim(),
          endTime: endTime.trim(),
          participants: 1
        })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Failed to create booking")
        return
      }

      alert(`Booking confirmed for ${selectedSlot} on ${dateString}!`)
      setSelectedSlot(null)
      setSelectedCourtId(null)
      
      // Refresh bookings
      const bookingsRes = await fetch(`/api/bookings/all?date=${currentDate.toISOString()}`)
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        setBookings(bookingsData)
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      alert("Failed to create booking. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

  const sportConfig = COURT_CONFIG[selectedSport]
  const availableSlots = TIME_SLOTS.filter(s => s.isAvailable).length
  const totalSlots = TIME_SLOTS.length

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Book a Court</h1>
          <p className="text-muted-foreground">Bookings available within 24 hours only • {availableSlots}/{totalSlots} slots available today</p>
        </div>

        {/* Sport Selection Tabs */}
        <div className="mb-8 flex gap-4 border-b-2 border-border pb-4">
          {(Object.keys(COURT_CONFIG) as Sport[]).map((sport) => (
            <button
              key={sport}
              onClick={() => {
                setSelectedSport(sport)
                setSelectedSlot(null)
                setSelectedCourtId(null)
              }}
              className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all flex items-center gap-2 ${
                selectedSport === sport
                  ? "bg-primary text-primary-foreground border-b-4 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{COURT_CONFIG[sport].icon}</span>
              {COURT_CONFIG[sport].label}
            </button>
          ))}
        </div>

        {/* Date Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Select Date (24-Hour Window)</h2>
          <div className="flex gap-2 items-center overflow-x-auto pb-2">
            <div className="flex gap-2">
              {availableDates.map((date, idx) => {
                const isToday = date.toDateString() === new Date().toDateString()
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDate(idx)
                      setSelectedSlot(null)
                      setSelectedCourtId(null)
                    }}
                    className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all whitespace-nowrap ${
                      selectedDate === idx
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-white text-foreground border-border hover:border-primary"
                    }`}
                  >
                    {isToday ? "Today" : "Tomorrow"}
                    <span className="text-sm block">
                      {date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Courts and Time Slots Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Select Time Slot</h2>
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(350px, 1fr))` }}>
            {courts.map((court) => {
              return (
                <div
                  key={court.id}
                  className="bg-white border-2 border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <span>{sportConfig.icon}</span>
                      {court.name}
                    </h3>
                    <span className="text-sm font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                      Max {court.maxCapacity}
                    </span>
                  </div>

                  {/* Time slots in 2-column grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {TIME_SLOTS.map((slot, slotIdx) => {
                      const slotId = `${court.name} - ${slot.startTime}-${slot.endTime}`
                      const isSelected = selectedSlot === slotId
                      const bookingCount = getSlotBookingCount(court.id, slot.startTime)
                      const isFull = bookingCount >= court.maxCapacity
                      const isAvailable = slot.isAvailable && !isFull

                      return (
                        <button
                          key={slotIdx}
                          onClick={() => isAvailable && toggleSlot(court.id, court.name, `${slot.startTime}-${slot.endTime}`, slot.startTime)}
                          disabled={!isAvailable}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            !slot.isAvailable
                              ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                              : isFull
                              ? "bg-red-50 border-red-300 text-red-600 cursor-not-allowed"
                              : isSelected
                              ? "bg-primary/20 border-primary text-primary font-semibold"
                              : "bg-muted border-border hover:border-primary hover:bg-muted/50 cursor-pointer"
                          }`}
                        >
                          <div className="text-sm font-bold">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="text-xs mt-1">
                            {!slot.isAvailable ? (
                              <span className="text-gray-400">Not available</span>
                            ) : isFull ? (
                              <span className="text-red-600 font-semibold">Full</span>
                            ) : (
                              <span className="text-muted-foreground">
                                {bookingCount}/{court.maxCapacity} booked
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary and Booking Button */}
        <div className="bg-muted p-6 rounded-lg sticky bottom-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Booking Summary</h3>
              <p className="text-muted-foreground">
                {selectedSlot ? `Selected: ${selectedSlot} on ${dateString}` : "Select one time slot to book"}
              </p>
            </div>
            <Button
              onClick={handleBooking}
              size="lg"
              className="bg-orange-500 text-white hover:bg-orange-600"
              disabled={!selectedSlot || bookingLoading}
            >
              {bookingLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
