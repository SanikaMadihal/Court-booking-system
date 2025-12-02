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

    const penalties = await prisma.penalty.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        issuedDate: "desc"
      }
    })

    return NextResponse.json(penalties)
  } catch (error) {
    console.error("Error fetching penalties:", error)
    return NextResponse.json(
      { error: "Failed to fetch penalties" },
      { status: 500 }
    )
  }
}
