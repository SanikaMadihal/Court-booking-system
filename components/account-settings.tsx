import { Button } from "@/components/ui/button"

export default function AccountSettings() {
  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="bg-card border-2 border-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            <span className="text-foreground">Booking confirmations</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            <span className="text-foreground">Upcoming bookings reminders</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-5 h-5 accent-primary" />
            <span className="text-foreground">Event announcements</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            <span className="text-foreground">Penalty notifications</span>
          </label>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-card border-2 border-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            <span className="text-foreground">Show my bookings in facility stats</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-5 h-5 accent-primary" />
            <span className="text-foreground">Allow others to view my profile</span>
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-6">
        <h3 className="text-xl font-bold text-destructive mb-4">Danger Zone</h3>
        <p className="text-foreground mb-4">These actions cannot be undone. Please proceed with caution.</p>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
          >
            Reset Password
          </Button>
          <Button className="w-full bg-destructive text-destructive-foreground hover:bg-red-700">Delete Account</Button>
        </div>
      </div>
    </div>
  )
}
