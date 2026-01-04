import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId") || session.user.id

    const bookings = await prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        court: true,
      },
      orderBy: {
        date: "desc"
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { courtId, date, startTime, endTime, participants } = body

    if (!courtId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate 24-hour booking window
    const bookingDateTime = new Date(date)
    const [hours, minutes] = startTime.split(':').map(Number)
    bookingDateTime.setHours(hours, minutes, 0, 0)
    
    const now = new Date()
    const hoursDiff = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    if (hoursDiff < 0) {
      return NextResponse.json(
        { error: "Cannot book slots in the past" },
        { status: 400 }
      )
    }
    
    if (hoursDiff > 24) {
      return NextResponse.json(
        { error: "Bookings are only allowed within 24 hours" },
        { status: 400 }
      )
    }

    // Get court capacity
    const court = await prisma.court.findUnique({
      where: { id: courtId }
    })

    if (!court) {
      return NextResponse.json(
        { error: "Court not found" },
        { status: 404 }
      )
    }

    // Check total participants for this slot
    const existingBookings = await prisma.booking.findMany({
      where: {
        courtId,
        date: new Date(date),
        startTime
      }
    })

    const totalParticipants = existingBookings.reduce((sum, booking) => sum + booking.participants, 0)
    
    if (totalParticipants + (participants || 1) > court.maxCapacity) {
      return NextResponse.json(
        { error: `Court is full (${totalParticipants}/${court.maxCapacity} booked)` },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        courtId,
        date: new Date(date),
        startTime,
        endTime,
        participants: participants || 1,
        status: "confirmed"
      },
      include: {
        court: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(
      { message: "Booking created successfully", booking },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}
