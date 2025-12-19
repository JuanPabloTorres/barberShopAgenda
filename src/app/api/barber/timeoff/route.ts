import { prisma } from "../../../lib/prisma";
import { requireSession } from "../../../lib/serverAuth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await requireSession(request);
  if (!session.userId) return session;
  const body = await request.json();
  const { date, isAllDay, startTime, endTime, reason } = body;
  if (!date || typeof isAllDay !== "boolean") {
    return NextResponse.json({ error: "INVALID_TIMEOFF" }, { status: 400 });
  }
  await prisma.barberTimeOff.create({
    data: {
      barberId: session.userId,
      date,
      isAllDay,
      startTime,
      endTime,
      reason,
    },
  });
  return NextResponse.json({ ok: true });
}
