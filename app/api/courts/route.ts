import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const sport = searchParams.get("sport")
    const date = searchParams.get("date")

    const where: any = {}
    if (sport) where.sport = sport

    const courts = await prisma.court.findMany({
      where,
      include: {
        bookings: date ? {
          where: {
            date: new Date(date),
            status: "confirmed"
          }
        } : false
      }
    })

    return NextResponse.json(courts)
  } catch (error) {
    console.error("Error fetching courts:", error)
    return NextResponse.json(
      { error: "Failed to fetch courts" },
      { status: 500 }
    )
  }
}
