import { prisma } from "@lib/prisma/client";
import { requireAdmin } from "@lib/serverAuth";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin(request);
  if (!session.userId) return session;
  const { id } = params;
  const body = await request.json();
  const { schedule } = body;
  if (!Array.isArray(schedule)) {
    return NextResponse.json({ error: "INVALID_SCHEDULE" }, { status: 400 });
  }
  for (const day of schedule) {
    await prisma.barberWeeklySchedule.upsert({
      where: { barberId_dayOfWeek: { barberId: id, dayOfWeek: day.dayOfWeek } },
      update: {
        startTime: day.startTime,
        endTime: day.endTime,
        isClosed: day.isClosed,
      },
      create: {
        barberId: id,
        dayOfWeek: day.dayOfWeek,
        startTime: day.startTime,
        endTime: day.endTime,
        isClosed: day.isClosed,
      },
    });
  }
  return NextResponse.json({ ok: true });
}
