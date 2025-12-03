"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { User, LogOut, Settings, Clock, AlertCircle, Shield, LayoutDashboard } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)

  const isActive = (path: string) => pathname === path
  const isStaffOrAdmin = session?.user?.role === "staff" || session?.user?.role === "admin"
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-border bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative overflow-hidden rounded-lg">
              <Image 
                src="/logo.svg" 
                alt="Sports Arena Logo"
                width={40}
                height={40}
                className="object-contain"
                onError={(e) => {
                  // Fallback to text logo if image doesn't load
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement!.innerHTML = '<div class="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg">SA</div>'
                }}
              />
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
            {isStaffOrAdmin && (
              <Link
                href="/staff/dashboard"
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  isActive("/staff/dashboard") ? "bg-secondary text-secondary-foreground" : "text-secondary hover:bg-secondary/10"
                }`}
              >
                <LayoutDashboard size={18} />
                Staff Dashboard
              </Link>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            {session ? (
              <>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border-2 border-primary text-primary font-semibold transition-all"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">{session.user.name}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-border rounded-lg shadow-lg overflow-hidden z-10">
                    <Link
                      href="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors border-b border-border"
                    >
                      <User size={18} className="text-primary" />
                      <span className="font-semibold text-foreground">Profile</span>
                    </Link>
                    <Link
                      href="/profile?tab=history"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors border-b border-border"
                    >
                      <Clock size={18} className="text-primary" />
                      <span className="font-semibold text-foreground">My Bookings</span>
                    </Link>
                    <Link
                      href="/profile?tab=penalties"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors border-b border-border"
                    >
                      <AlertCircle size={18} className="text-destructive" />
                      <span className="font-semibold text-foreground">Penalties</span>
                    </Link>
                    <Link
                      href="/profile?tab=settings"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors border-b border-border"
                    >
                      <Settings size={18} className="text-primary" />
                      <span className="font-semibold text-foreground">Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors font-semibold"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
            )}
          </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/staff/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted font-medium transition-all"
                >
                  <Shield size={18} />
                  <span className="hidden sm:inline">Staff</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}