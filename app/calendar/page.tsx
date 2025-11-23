"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar, AlertCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendarEvent {
  date: number
  title: string
  type: "tournament" | "maintenance"
}

const CALENDAR_EVENTS: CalendarEvent[] = [
  { date: 5, title: "Badminton Tournament", type: "tournament" },
  { date: 12, title: "Court Maintenance", type: "maintenance" },
  { date: 15, title: "Table Tennis Championship", type: "tournament" },
  { date: 22, title: "Squash League Finals", type: "tournament" },
  { date: 28, title: "Annual Inspection", type: "maintenance" },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getEventForDate = (day: number): CalendarEvent | undefined => {
    return CALENDAR_EVENTS.find((e) => e.date === day)
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const calendarDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Facility Calendar</h1>
          <p className="text-muted-foreground">View upcoming tournaments, events, and maintenance schedules</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-card border-2 border-border rounded-lg p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button onClick={prevMonth} variant="outline" size="sm">
                <ChevronLeft size={20} />
              </Button>
              <h2 className="text-2xl font-bold text-foreground">{monthName}</h2>
              <Button onClick={nextMonth} variant="outline" size="sm">
                <ChevronRight size={20} />
              </Button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold text-muted-foreground text-sm py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => {
                const event = day ? getEventForDate(day) : undefined
                const isSelected = day === selectedDate

                return (
                  <button
                    key={idx}
                    onClick={() => day && setSelectedDate(day)}
                    className={`aspect-square p-2 rounded-lg border-2 text-sm font-semibold transition-all flex flex-col items-center justify-center ${
                      !day
                        ? "bg-white border-transparent"
                        : isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : event
                            ? event.type === "tournament"
                              ? "bg-secondary/20 text-foreground border-secondary"
                              : "bg-red-100 text-foreground border-red-500"
                            : "bg-white text-foreground border-border hover:border-primary"
                    }`}
                  >
                    {day}
                    {event && <div className="text-xs mt-1">{event.type === "tournament" ? "🏆" : "🔧"}</div>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Legend and Info */}
          <div className="space-y-6">
            {/* Legend */}
            <div className="bg-card border-2 border-border rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-4">Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-secondary/20 border-2 border-secondary rounded"></div>
                  <span className="text-sm text-foreground">Tournament / Event</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-100 border-2 border-red-500 rounded"></div>
                  <span className="text-sm text-foreground">Maintenance</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary border-2 border-primary rounded"></div>
                  <span className="text-sm text-foreground">Selected Date</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-accent-yellow/20 border-2 border-accent-yellow rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <Phone className="text-accent-yellow mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-foreground mb-1">Event Booking</h4>
                  <p className="text-sm text-foreground">To book facility for an event, contact:</p>
                </div>
              </div>
              <p className="text-lg font-bold text-foreground">+1 (555) 123-4567</p>
              <p className="text-xs text-muted-foreground mt-2">Available 9am - 5pm, Mon-Fri</p>
            </div>

            {/* Selected Date Info */}
            {selectedDate && (
              <div className="bg-card border-2 border-border rounded-lg p-6">
                <h4 className="font-bold text-foreground mb-3">
                  {new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString(
                    "en-US",
                    { weekday: "long", month: "long", day: "numeric" },
                  )}
                </h4>
                {getEventForDate(selectedDate) ? (
                  <div className="space-y-2">
                    <p className="text-sm text-foreground font-semibold">{getEventForDate(selectedDate)?.title}</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        getEventForDate(selectedDate)?.type === "tournament"
                          ? "bg-secondary/20 text-secondary"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {getEventForDate(selectedDate)?.type === "tournament" ? "Tournament" : "Maintenance"}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No events scheduled</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Events List */}
        <div className="mt-8 bg-card border-2 border-border rounded-lg p-6">
          <h3 className="text-2xl font-bold text-foreground mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {CALENDAR_EVENTS.map((event, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-3 border-b border-border last:border-b-0">
                <div className={`mt-1 ${event.type === "tournament" ? "text-secondary" : "text-red-500"}`}>
                  {event.type === "tournament" ? <Calendar size={20} /> : <AlertCircle size={20} />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })} {event.date}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.type === "tournament" ? "bg-secondary/20 text-secondary" : "bg-red-100 text-red-700"
                  }`}
                >
                  {event.type === "tournament" ? "Tournament" : "Maintenance"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
