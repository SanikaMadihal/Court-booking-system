"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react"

interface Penalty {
  id: string
  reason: string
  severity: string
  status: string
  issuedDate: string
  expiresAt: string | null
  user: {
    id: string
    name: string
    email: string
  }
}

export default function ManagePenaltiesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [penalties, setPenalties] = useState<Penalty[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/staff/login")
      return
    }

    if (session.user.role !== "staff" && session.user.role !== "admin") {
      router.push("/")
      return
    }

    fetchPenalties()
  }, [session, status, router])

  const fetchPenalties = async () => {
    try {
      const response = await fetch("/api/staff/penalties")
      if (response.ok) {
        const data = await response.json()
        setPenalties(data)
      }
    } catch (error) {
      console.error("Failed to fetch penalties:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (penaltyId: string, newStatus: string) => {
    setActionLoading(penaltyId)
    try {
      const response = await fetch("/api/staff/penalties", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          penaltyId,
          status: newStatus
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update penalty status")
      }

      alert("Penalty status updated successfully")
      fetchPenalties()
    } catch (error) {
      console.error("Error updating penalty:", error)
      alert(error instanceof Error ? error.message : "Failed to update penalty")
    } finally {
      setActionLoading(null)
    }
  }

  const filteredPenalties = penalties.filter(penalty => {
    if (filterStatus === "all") return true
    return penalty.status === filterStatus
  })

  const getRestrictionText = (severity: string): string => {
    if (severity === "low") return "Warning"
    if (severity === "medium") return "Max 3 bookings/week"
    if (severity === "high") return "Max 2 bookings/week"
    return "Unknown"
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Manage Penalties</h1>
          <p className="text-muted-foreground">View and manage user penalties</p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          {["all", "active", "resolved"].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                filterStatus === status
                  ? "bg-primary text-white"
                  : "bg-white text-foreground border-2 border-border hover:border-primary"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Penalties Table */}
        <div className="bg-white rounded-lg border-2 border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Reason</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Severity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Issued Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPenalties.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No penalties found
                    </td>
                  </tr>
                ) : (
                  filteredPenalties.map((penalty) => (
                    <tr key={penalty.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-foreground">{penalty.user.name}</div>
                          <div className="text-sm text-muted-foreground">{penalty.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground max-w-xs">{penalty.reason}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            penalty.severity === "high"
                              ? "bg-destructive/20 text-destructive"
                              : penalty.severity === "medium"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {penalty.severity.charAt(0).toUpperCase() + penalty.severity.slice(1)}
                          </span>
                          <div className="text-xs text-muted-foreground mt-1">
                            {getRestrictionText(penalty.severity)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground">
                          {new Date(penalty.issuedDate).toLocaleDateString("en-IN")}
                        </div>
                        {penalty.expiresAt && (
                          <div className="text-xs text-muted-foreground">
                            Expires: {new Date(penalty.expiresAt).toLocaleDateString("en-IN")}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          penalty.status === "active" 
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {penalty.status.charAt(0).toUpperCase() + penalty.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {penalty.status === "active" ? (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(penalty.id, "resolved")}
                            disabled={actionLoading === penalty.id}
                            className="bg-green-500 text-white hover:bg-green-600"
                          >
                            {actionLoading === penalty.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Resolve
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(penalty.id, "active")}
                            disabled={actionLoading === penalty.id}
                            className="bg-orange-500 text-white hover:bg-orange-600"
                          >
                            {actionLoading === penalty.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                Reactivate
                              </>
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
