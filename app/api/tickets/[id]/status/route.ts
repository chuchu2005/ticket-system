import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || !['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
