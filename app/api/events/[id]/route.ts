import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const event = await prisma.event.findUnique({
      where: { id }
    })

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || (session.user.role !== "staff" && session.user.role !== "admin")) {
      return NextResponse.json(
        { error: "Unauthorized. Staff access required." },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const { title, description, sport, date, startTime, endTime, location, maxParticipants } = body

    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        sport,
        date: new Date(date),
        startTime,
        endTime,
        location,
        maxParticipants
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || (session.user.role !== "staff" && session.user.role !== "admin")) {
      return NextResponse.json(
        { error: "Unauthorized. Staff access required." },
        { status: 401 }
      )
    }

    const { id } = await params

    await prisma.event.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    )
  }
}
