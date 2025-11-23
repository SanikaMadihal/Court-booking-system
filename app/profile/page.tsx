"use client"

import type React from "react"

import { useState } from "react"
import { User, Clock, AlertTriangle, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import BookingHistory from "@/components/booking-history"
import ActivePenalties from "@/components/active-penalties"
import AccountSettings from "@/components/account-settings"

type TabType = "profile" | "history" | "penalties" | "settings"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile")

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User size={20} /> },
    { id: "history", label: "My Bookings", icon: <Clock size={20} /> },
    { id: "penalties", label: "Active Penalties", icon: <AlertTriangle size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ]

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your bookings, view history, and account settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-border pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg border-2 font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white text-foreground border-border hover:border-primary"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "profile" && <ProfileOverview />}
          {activeTab === "history" && <BookingHistory />}
          {activeTab === "penalties" && <ActivePenalties />}
          {activeTab === "settings" && <AccountSettings />}
        </div>

        {/* Logout Button */}
        <div className="mt-12 pt-8 border-t-2 border-border">
          <Button
            size="lg"
            className="bg-destructive text-destructive-foreground hover:bg-red-700 flex items-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProfileOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* User Info */}
      <div className="bg-card border-2 border-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">User Information</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-semibold text-foreground">John Doe</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-semibold text-foreground">john.doe@university.edu</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="font-semibold text-foreground">UD-2024-001234</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p className="font-semibold text-foreground">January 15, 2024</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-4">
        <div className="bg-primary/10 border-2 border-primary rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Bookings</p>
          <p className="text-4xl font-bold text-primary">24</p>
        </div>
        <div className="bg-green/10 border-2 border-green rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Upcoming Bookings</p>
          <p className="text-4xl font-bold text-green">3</p>
        </div>
        <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Active Penalties</p>
          <p className="text-4xl font-bold text-destructive">0</p>
        </div>
      </div>
    </div>
  )
}
