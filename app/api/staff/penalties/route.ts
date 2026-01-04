import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await auth()
    
    if (!session || (session.user.role !== "staff" && session.user.role !== "admin")) {
      return NextResponse.json(
        { error: "Unauthorized. Staff access required." },
        { status: 401 }
      )
    }

    const penalties = await prisma.penalty.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        issuedDate: "desc",
      },
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

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    
    if (!session || (session.user.role !== "staff" && session.user.role !== "admin")) {
      return NextResponse.json(
        { error: "Unauthorized. Staff access required." },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { penaltyId, status } = body

    if (!penaltyId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (status !== "active" && status !== "resolved") {
      return NextResponse.json(
        { error: "Invalid status. Must be 'active' or 'resolved'" },
        { status: 400 }
      )
    }

    const penalty = await prisma.penalty.update({
      where: { id: penaltyId },
      data: { status },
    })

    return NextResponse.json({
      message: "Penalty status updated successfully",
      penalty,
    })
  } catch (error) {
    console.error("Error updating penalty:", error)
    return NextResponse.json(
      { error: "Failed to update penalty" },
      { status: 500 }
    )
  }
}
