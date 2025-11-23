import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  sport: string
  title: string
  description: string
  imageSrc: string
  imagePosition: "left" | "right"
  href: string
}

export default function HeroSection({ sport, title, description, imageSrc, imagePosition, href }: HeroSectionProps) {
  return (
    <div
      className={`min-h-96 flex items-stretch overflow-hidden border-b-2 border-border ${
        imagePosition === "right" ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {/* Text Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 bg-white clip-diagonal-right">
        <span className="text-primary text-sm font-semibold mb-2">SPORTS ARENA</span>
        <h2 className="text-4xl font-bold text-foreground mb-4">{title}</h2>
        <p className="text-lg text-muted-foreground mb-8">{description}</p>
        <Link href={href}>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-blue-700 w-fit">
            Book Now
          </Button>
        </Link>
      </div>

      {/* Image Content */}
      <div className="w-full md:w-1/2 relative clip-diagonal-left">
        <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
    </div>
  )
}
