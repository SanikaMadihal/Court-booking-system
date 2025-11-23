import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export default function EventsSection() {
  return (
    <div className="bg-gradient-to-r from-secondary to-accent py-12 md:py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Calendar className="text-secondary-foreground" size={32} />
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-secondary-foreground">Events & Tournaments</h3>
            <p className="text-secondary-foreground/80">Check out upcoming events and book your spot</p>
          </div>
        </div>
        <Link href="/calendar">
          <Button size="lg" className="bg-white text-secondary hover:bg-gray-100">
            View Calendar
          </Button>
        </Link>
      </div>
    </div>
  )
}
