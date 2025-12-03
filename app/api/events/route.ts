import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const month = searchParams.get("month")
    const year = searchParams.get("year")

    let whereClause: { date: { gte: Date; lte?: Date } } = {
      date: {
        gte: new Date()
      }
    }

    // If month and year are provided, get events for that specific month
    if (month && year) {
      const startOfMonth = new Date(parseInt(year), parseInt(month), 1)
      const endOfMonth = new Date(parseInt(year), parseInt(month) + 1, 0, 23, 59, 59)
      whereClause = {
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: {
        date: "asc"
      }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
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
    const { title, description, sport, date, startTime, endTime, location, maxParticipants } = body

    if (!title || !sport || !date || !startTime || !endTime || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate time ordering
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        sport,
        date: new Date(date),
        startTime,
        endTime,
        location,
        maxParticipants: maxParticipants || null
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    )
  }
}
