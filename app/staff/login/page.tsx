"use client"

import { useState } from "react"
import { signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, User, Lock } from "lucide-react"

export default function StaffLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid staff credentials")
      } else {
        // Check if the user is staff or admin
        const response = await fetch("/api/user/profile")
        const userData = await response.json()
        
        if (userData.role === "staff" || userData.role === "admin") {
          router.push("/staff/dashboard")
          router.refresh()
        } else {
          setError("Access denied. Staff credentials required.")
          await signOut({ redirect: false }) // Sign out non-staff user
        }
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl border-2 border-primary">
        {/* Staff Badge Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-foreground">Staff Portal</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your staff credentials
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-destructive/10 border-2 border-destructive text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Staff Email
                </div>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="staff@kletech.ac.in"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </div>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                Staff Sign In
              </span>
            )}
          </Button>

          <div className="text-center text-sm border-t border-border pt-4 mt-4">
            <span className="text-muted-foreground">Not a staff member? </span>
            <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
              Student Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
