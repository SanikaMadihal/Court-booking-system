"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Calendar, AlertCircle, Phone, Trophy, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendarEvent {
  id: string
  title: string
  description: string | null
  sport: string
  date: string
  startTime: string
  endTime: string
  location: string
  maxParticipants: number | null
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const month = currentDate.getMonth()
      const year = currentDate.getFullYear()
      const response = await fetch(`/api/events?month=${month}&year=${year}`)
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }, [currentDate])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    setSelectedDate(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    setSelectedDate(null)
  }

  const getEventsForDate = (day: number): CalendarEvent[] => {
    return events.filter((e) => {
      const eventDate = new Date(e.date)
      return (
        eventDate.getUTCDate() === day &&
        eventDate.getUTCMonth() === currentDate.getMonth() &&
        eventDate.getUTCFullYear() === currentDate.getFullYear()
      )
    })
  }

  const getEventTypeForDisplay = (event: CalendarEvent): "tournament" | "maintenance" => {
    const title = event.title.toLowerCase()
    if (title.includes("maintenance") || title.includes("inspection") || title.includes("repair")) {
      return "maintenance"
    }
    return "tournament"
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

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              /* Calendar Days */
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => {
                  const dayEvents = day ? getEventsForDate(day) : []
                  const hasEvents = dayEvents.length > 0
                  const isSelected = day === selectedDate
                  const hasTournament = dayEvents.some(e => getEventTypeForDisplay(e) === "tournament")
                  const hasMaintenance = dayEvents.some(e => getEventTypeForDisplay(e) === "maintenance")

                  return (
                    <button
                      key={idx}
                      onClick={() => day && setSelectedDate(day)}
                      className={`aspect-square p-2 rounded-lg border-2 text-sm font-semibold transition-all flex flex-col items-center justify-center ${
                        !day
                          ? "bg-white border-transparent"
                          : isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : hasMaintenance
                              ? "bg-red-100 text-foreground border-red-500"
                              : hasTournament
                                ? "bg-secondary/20 text-foreground border-secondary"
                                : "bg-white text-foreground border-border hover:border-primary"
                      }`}
                    >
                      {day}
                      {hasEvents && (
                        <div className="text-xs mt-1">
                          {hasTournament && "🏆"}
                          {hasMaintenance && "🔧"}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
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
                {getEventsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-3">
                    {getEventsForDate(selectedDate).map((event) => (
                      <div key={event.id} className="space-y-2 pb-3 border-b border-border last:border-b-0">
                        <p className="text-sm text-foreground font-semibold">{event.title}</p>
                        {event.description && (
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {event.startTime} - {event.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {event.location}
                          </span>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            getEventTypeForDisplay(event) === "tournament"
                              ? "bg-secondary/20 text-secondary"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {event.sport}
                        </span>
                      </div>
                    ))}
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
          <h3 className="text-2xl font-bold text-foreground mb-4">Events This Month</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No events scheduled for this month</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-start gap-4 pb-3 border-b border-border last:border-b-0">
                  <div className={`mt-1 ${getEventTypeForDisplay(event) === "tournament" ? "text-secondary" : "text-red-500"}`}>
                    {getEventTypeForDisplay(event) === "tournament" ? <Trophy size={20} /> : <AlertCircle size={20} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("en-US", { 
                        weekday: "short", 
                        month: "long", 
                        day: "numeric" 
                      })} • {event.startTime} - {event.endTime}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {event.location}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      getEventTypeForDisplay(event) === "tournament" ? "bg-secondary/20 text-secondary" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {event.sport}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
