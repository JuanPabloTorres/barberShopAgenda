import { prisma } from "../../../lib/prisma";
import { requireSession } from "../../../lib/serverAuth";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const session = await requireSession(request);
  if (!session.userId) return session;
  const body = await request.json();
  const { schedule } = body;
  if (!Array.isArray(schedule)) {
    return NextResponse.json({ error: "INVALID_SCHEDULE" }, { status: 400 });
  }
  // Upsert each day
  for (const day of schedule) {
    await prisma.barberWeeklySchedule.upsert({
      where: { barberId_dayOfWeek: { barberId: session.userId, dayOfWeek: day.dayOfWeek } },
      update: {
        startTime: day.startTime,
        endTime: day.endTime,
        isClosed: day.isClosed,
      },
      create: {
        barberId: session.userId,
        dayOfWeek: day.dayOfWeek,
        startTime: day.startTime,
        endTime: day.endTime,
        isClosed: day.isClosed,
      },
    });
  }
  return NextResponse.json({ ok: true });
}
