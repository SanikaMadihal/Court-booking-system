"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, LogOut, Settings, Clock, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [showDropdown, setShowDropdown] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-border bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              SA
            </div>
            <div>
              <div className="text-xl font-bold text-primary">Sports Arena</div>
              <div className="text-xs text-muted-foreground">Court Booking</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive("/") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              Home
            </Link>
            <Link
              href="/booking"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive("/booking") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              Booking
            </Link>
            <Link
              href="/calendar"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive("/calendar") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              Calendar
            </Link>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border-2 border-primary text-primary font-semibold transition-all"
            >
              <User size={20} />
              <span className="hidden sm:inline">Sign in</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-border rounded-lg shadow-lg overflow-hidden z-10">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors border-b border-border"
                >
                  <User size={18} className="text-primary" />
                  <span className="font-semibold text-foreground">Profile</span>
                </Link>
                <Link
                  href="/profile?tab=history"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors border-b border-border"
                >
                  <Clock size={18} className="text-primary" />
                  <span className="font-semibold text-foreground">My Bookings</span>
                </Link>
                <Link
                  href="/profile?tab=penalties"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors border-b border-border"
                >
                  <AlertCircle size={18} className="text-destructive" />
                  <span className="font-semibold text-foreground">Penalties</span>
                </Link>
                <Link
                  href="/profile?tab=settings"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors border-b border-border"
                >
                  <Settings size={18} className="text-primary" />
                  <span className="font-semibold text-foreground">Settings</span>
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors font-semibold">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
