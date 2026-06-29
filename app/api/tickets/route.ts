import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, description, priority } = body;

    if (!name || !email || !subject || !description || !priority) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!['low', 'medium', 'high'].includes(priority)) {
      return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: { name, email, subject, description, priority },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const tickets = await prisma.ticket.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(priority && { priority: priority as any }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}
