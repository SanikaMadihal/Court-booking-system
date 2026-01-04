import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")

    // If date is provided, filter by date (for booking page)
    if (dateParam) {
      const requestedDate = new Date(dateParam)
      const startOfDay = new Date(requestedDate)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(requestedDate)
      endOfDay.setHours(23, 59, 59, 999)

      const bookings = await prisma.booking.findMany({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        select: {
          id: true,
          courtId: true,
          date: true,
          startTime: true,
          endTime: true,
          participants: true,
        },
      })

      return NextResponse.json(bookings)
    }

    // If no date, return all bookings with full details (for staff)
    const session = await auth()
    
    if (!session || (session.user.role !== "staff" && session.user.role !== "admin")) {
      return NextResponse.json(
        { error: "Unauthorized. Staff access required." },
        { status: 401 }
      )
    }

    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        court: {
          select: {
            id: true,
            name: true,
            sport: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
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
