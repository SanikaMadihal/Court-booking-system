"use client"

import { useState, useMemo } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

type Sport = "badminton" | "table-tennis" | "squash"

interface TimeSlot {
  startTime: string
  endTime: string
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

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const startHour = 6
  const endHour = 20

  let currentHour = startHour
  let currentMin = 0

  while (currentHour < endHour) {
    const startTimeStr = `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`
    const endMin = currentMin + 50
    let endHour = currentHour
    let adjustedEndMin = endMin

    if (endMin >= 60) {
      endHour = currentHour + 1
      adjustedEndMin = endMin - 60
    }

    const endTimeStr = `${String(endHour).padStart(2, "0")}:${String(adjustedEndMin).padStart(2, "0")}`
    slots.push({ startTime: startTimeStr, endTime: endTimeStr })

    // Move to next slot (50 min session + 10 min gap = 60 min)
    currentMin += 60
    if (currentMin >= 60) {
      currentHour += 1
      currentMin = 0
    }
  }

  return slots
}

const TIME_SLOTS = generateTimeSlots()

export default function BookingPage() {
  const [selectedSport, setSelectedSport] = useState<Sport>("badminton")
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const availableDates = useMemo(() => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 1; i++) {
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

  const toggleSlot = (courtName: string, timeSlot: string) => {
    const slotId = `${courtName}-${timeSlot}`
    if (selectedSlot === slotId) {
      setSelectedSlot(null)
    } else {
      setSelectedSlot(slotId)
    }
  }

  const handleBooking = () => {
    if (!selectedSlot) {
      alert("Please select one time slot")
      return
    }
    alert(`Booked slot: ${selectedSlot} on ${dateString}`)
    setSelectedSlot(null)
  }

  const sportConfig = COURT_CONFIG[selectedSport]

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Book a Court</h1>
          <p className="text-muted-foreground">Select your sport, date, and one time slot to book</p>
        </div>

        {/* Sport Selection Tabs */}
        <div className="mb-8 flex gap-4 border-b-2 border-border pb-4">
          {(Object.keys(COURT_CONFIG) as Sport[]).map((sport) => (
            <button
              key={sport}
              onClick={() => {
                setSelectedSport(sport)
                setSelectedSlot(null)
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
          <h2 className="text-xl font-semibold text-foreground mb-4">Select Date</h2>
          <div className="flex gap-2 items-center overflow-x-auto pb-2">
            <Button
              onClick={() => setSelectedDate(Math.max(0, selectedDate - 1))}
              disabled={selectedDate === 0}
              variant="outline"
              size="sm"
            >
              <ChevronLeft size={20} />
            </Button>

            <div className="flex gap-2">
              {availableDates.map((date, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(idx)}
                  className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all whitespace-nowrap ${
                    selectedDate === idx
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-foreground border-border hover:border-primary"
                  }`}
                >
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                  })}
                </button>
              ))}
            </div>

            <Button
              onClick={() => setSelectedDate(Math.min(0, selectedDate + 1))}
              disabled={selectedDate === 0}
              variant="outline"
              size="sm"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        {/* Courts and Time Slots Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Select Time Slot</h2>
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(350px, 1fr))` }}>
            {Array.from({ length: sportConfig.courts }).map((_, courtIdx) => {
              const courtName = `${sportConfig.label} Court ${courtIdx + 1}`
              return (
                <div
                  key={courtIdx}
                  className="bg-white border-2 border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <span>{sportConfig.icon}</span>
                      {courtName}
                    </h3>
                    <span className="text-sm font-semibold px-3 py-1 rounded-full bg-green/20 text-green">
                      Max {sportConfig.maxCapacity}
                    </span>
                  </div>

                  {/* Time slots in 2-column grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {TIME_SLOTS.map((slot, slotIdx) => {
                      const slotId = `${courtName}-${slot.startTime}-${slot.endTime}`
                      const isSelected = selectedSlot === slotId
                      return (
                        <button
                          key={slotIdx}
                          onClick={() => toggleSlot(courtName, `${slot.startTime}-${slot.endTime}`)}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            isSelected
                              ? "bg-primary/20 border-primary text-primary font-semibold"
                              : "bg-muted border-border hover:border-primary hover:bg-muted/50"
                          }`}
                        >
                          <div className="text-sm font-bold">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">0/4 students</div>
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
                {selectedSlot ? `Slot selected: ${selectedSlot} on ${dateString}` : "Select one time slot to book"}
              </p>
            </div>
            <Button
              onClick={handleBooking}
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-orange-600"
              disabled={!selectedSlot}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
