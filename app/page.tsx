import HeroSection from "@/components/hero-section"
import EventsSection from "@/components/events-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Badminton Hero */}
      <HeroSection
        sport="Badminton"
        title="Badminton Courts"
        description="Book premium badminton courts with professional-grade facilities. Perfect for casual players and tournaments."
        imageSrc="/badminton-court-with-players.jpg"
        imagePosition="right"
        href="/booking?sport=badminton"
      />

      {/* Table Tennis Hero */}
      <HeroSection
        sport="Table Tennis"
        title="Table Tennis Tables"
        description="State-of-the-art table tennis facilities with international standard tables. Ideal for matches and practice sessions."
        imageSrc="/table-tennis-players-in-action.jpg"
        imagePosition="left"
        href="/booking?sport=table-tennis"
      />

      {/* Squash Hero */}
      <HeroSection
        sport="Squash"
        title="Squash Courts"
        description="Modern squash courts with perfect acoustics and lighting. Experience competitive play at its finest."
        imageSrc="/squash-court-professional.jpg"
        imagePosition="right"
        href="/booking?sport=squash"
      />

      {/* Events Section */}
      <EventsSection />
    </div>
  )
}
