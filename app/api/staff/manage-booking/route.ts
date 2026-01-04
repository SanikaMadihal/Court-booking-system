import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const PENALTY_DESCRIPTIONS = {
  "low": "Warning - No booking restrictions",
  "medium": "Maximum 3 bookings per week",
  "high": "Maximum 2 bookings per week"
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session || (session.user.role !== "staff" && session.user.role !== "admin")) {
      return NextResponse.json(
        { error: "Unauthorized. Staff access required." },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { bookingId, action, userId, note, penaltyLevel } = body

    if (!bookingId || !action || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { court: true, user: true }
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    if (booking.status !== "confirmed") {
      return NextResponse.json(
        { error: "Only confirmed bookings can be modified" },
        { status: 400 }
      )
    }

    if (action === "no-show") {
      // Cancel booking and issue low penalty
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "cancelled" }
      })

      // Issue low penalty (warning) for no-show
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30) // Warning expires in 30 days

      await prisma.penalty.create({
        data: {
          userId,
          reason: "No Show",
          severity: "low",
          status: "active",
          expiresAt
        }
      })

      return NextResponse.json({
        message: "Booking cancelled and warning issued",
        severity: "low"
      })
    } else if (action === "cancel") {
      if (!note || !note.trim()) {
        return NextResponse.json(
          { error: "Cancellation note is required" },
          { status: 400 }
        )
      }

      // Cancel booking
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "cancelled" }
      })

      // Issue penalty if specified
      if (penaltyLevel && penaltyLevel !== "no-penalty") {
        const expiresAt = new Date()
        if (penaltyLevel === "low") {
          expiresAt.setDate(expiresAt.getDate() + 30) // Warning expires in 30 days
        } else {
          expiresAt.setDate(expiresAt.getDate() + 90) // Booking restrictions expire in 90 days
        }

        await prisma.penalty.create({
          data: {
            userId,
            reason: note,
            severity: penaltyLevel,
            status: "active",
            expiresAt
          }
        })
      }

      return NextResponse.json({
        message: "Booking cancelled successfully",
        severity: penaltyLevel !== "no-penalty" ? penaltyLevel : "none"
      })
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error managing booking:", error)
    return NextResponse.json(
      { error: "Failed to manage booking" },
      { status: 500 }
    )
  }
}
