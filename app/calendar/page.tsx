"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { ChevronLeft, ChevronRight, Calendar, AlertCircle, Phone, Trophy, Clock, MapPin, User, Trash2 } from "lucide-react"
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

interface Booking {
  id: string
  courtId: string
  date: string
  startTime: string
  endTime: string
  status: string
  court: {
    name: string
    sport: string
  }
}

type CalendarItem = {
  id: string
  title: string
  description?: string | null
  sport: string
  date: string
  startTime: string
  endTime: string
  location: string
  type: 'tournament' | 'maintenance' | 'booking'
}

export default function CalendarPage() {
  const { data: session } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [items, setItems] = useState<CalendarItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const month = currentDate.getMonth()
      const year = currentDate.getFullYear()
      
      const [eventsRes, bookingsRes] = await Promise.all([
        fetch(`/api/events?month=${month}&year=${year}`, { cache: 'no-store' }),
        fetch(`/api/bookings`, { cache: 'no-store' })
      ])
      
      const eventsData: CalendarEvent[] = await eventsRes.json()
      const bookingsData: Booking[] = await bookingsRes.json()

      const mappedEvents: CalendarItem[] = eventsData.map(event => {
        const title = event.title.toLowerCase()
        const type = (title.includes("maintenance") || title.includes("inspection") || title.includes("repair")) 
          ? "maintenance" 
          : "tournament"
        
        return {
          ...event,
          type
        }
      })

      const mappedBookings: CalendarItem[] = Array.isArray(bookingsData) ? bookingsData
        .filter(booking => booking.status !== "cancelled")
        .map(booking => ({
        id: booking.id,
        title: "My Booking",
        description: `Court: ${booking.court.name}`,
        sport: booking.court.sport,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        location: booking.court.name,
        type: 'booking'
      })) : []

      setItems([...mappedEvents, ...mappedBookings])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }, [currentDate])

  const handleDeleteEvent = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering date selection if inside a clickable area
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchData()
      } else {
        console.error("Failed to delete event")
        alert("Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      alert("Error deleting event")
    }
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

  const getItemsForDate = (day: number): CalendarItem[] => {
    return items.filter((item) => {
      const itemDate = new Date(item.date)
      return (
        itemDate.getDate() === day &&
        itemDate.getMonth() === currentDate.getMonth() &&
        itemDate.getFullYear() === currentDate.getFullYear()
      )
    })
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
          <p className="text-muted-foreground">View upcoming tournaments, events, maintenance schedules, and your bookings</p>
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
                  const dayItems = day ? getItemsForDate(day) : []
                  const hasItems = dayItems.length > 0
                  const isSelected = day === selectedDate
                  const hasTournament = dayItems.some(e => e.type === "tournament")
                  const hasMaintenance = dayItems.some(e => e.type === "maintenance")
                  const hasBooking = dayItems.some(e => e.type === "booking")

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
                              : hasBooking
                                ? "bg-green-100 text-foreground border-green-500"
                                : hasTournament
                                  ? "bg-secondary/20 text-foreground border-secondary"
                                  : "bg-white text-foreground border-border hover:border-primary"
                      }`}
                    >
                      {day}
                      {hasItems && (
                        <div className="text-xs mt-1 flex gap-0.5">
                          {hasTournament && "🏆"}
                          {hasMaintenance && "🔧"}
                          {hasBooking && "📅"}
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
                  <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded"></div>
                  <span className="text-sm text-foreground">My Booking</span>
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
              <p className="text-lg font-bold text-foreground">+91 9876543210</p>
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
                {getItemsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-3">
                    {getItemsForDate(selectedDate).map((item) => (
                      <div key={item.id} className="space-y-2 pb-3 border-b border-border last:border-b-0">
                        <p className="text-sm text-foreground font-semibold">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {item.startTime} - {item.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {item.location}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              item.type === "tournament"
                                ? "bg-secondary/20 text-secondary"
                                : item.type === "maintenance"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {item.sport}
                          </span>
                          {(session?.user?.role === "admin" || session?.user?.role === "staff") && (item.type === "tournament" || item.type === "maintenance") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                              onClick={(e) => handleDeleteEvent(item.id, e)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No events or bookings scheduled</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Events List */}
        <div className="mt-8 bg-card border-2 border-border rounded-lg p-6">
          <h3 className="text-2xl font-bold text-foreground mb-4">Events & Bookings This Month</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No events or bookings scheduled for this month</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-4 pb-3 border-b border-border last:border-b-0">
                  <div className={`mt-1 ${
                    item.type === "tournament" 
                      ? "text-secondary" 
                      : item.type === "maintenance" 
                        ? "text-red-500" 
                        : "text-green-500"
                  }`}>
                    {item.type === "tournament" ? <Trophy size={20} /> : item.type === "maintenance" ? <AlertCircle size={20} /> : <User size={20} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString("en-US", { 
                        weekday: "short", 
                        month: "long", 
                        day: "numeric" 
                      })} • {item.startTime} - {item.endTime}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {item.location}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        item.type === "tournament" 
                          ? "bg-secondary/20 text-secondary" 
                          : item.type === "maintenance" 
                            ? "bg-red-100 text-red-700" 
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.sport}
                    </span>
                    {(session?.user?.role === "admin" || session?.user?.role === "staff") && (item.type === "tournament" || item.type === "maintenance") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={(e) => handleDeleteEvent(item.id, e)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}