"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CreateEventPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: ""
  })

  if (session?.user?.role !== "staff" && session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Only staff members can create events.</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Failed to create event")
        return
      }

      alert("Event created successfully!")
      router.push("/calendar")
    } catch (error) {
      console.error("Error creating event:", error)
      alert("Failed to create event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create Event</h1>
          <p className="text-muted-foreground">Add a new event to the calendar</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border-2 border-border rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              <FileText className="inline mr-2" size={16} />
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              placeholder="Enter event description"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              <Calendar className="inline mr-2" size={16} />
              Event Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <Clock className="inline mr-2" size={16} />
                Start Time *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <Clock className="inline mr-2" size={16} />
                End Time *
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              placeholder="Enter event location"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-white hover:bg-primary/90 flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/staff/dashboard")}
              className="bg-muted text-foreground hover:bg-muted/80"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
