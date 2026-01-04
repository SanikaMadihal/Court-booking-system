import Link from "next/link"
import { Mail, Phone, MessageSquare } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted text-foreground py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact Us */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Mail size={20} />
              Contact Us
            </h3>
            <Link href="mailto:arena@kletech.ac.in" className="text-primary hover:underline">
              arena@kletech.ac.in
            </Link>
          </div>

          {/* Concerns */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Phone size={20} />
              Concerns
            </h3>
            <p className="text-foreground">+91 9876543210</p>
            <p className="text-sm text-muted-foreground mt-2">Available 9am - 5pm, Mon-Fri</p>
          </div>

          {/* Feedback */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              Feedback
            </h3>
            <Link href="mailto:feedback@kletech.ac.in" className="text-primary hover:underline">
              Share your feedback
            </Link>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            Developed as a prototype for 5th sem course project for Software Engineering and Web Technology
          </p>
        </div>
      </div>
    </footer>
  )
}
