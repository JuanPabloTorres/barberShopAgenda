import { prisma } from "../../../lib/prisma";
import { requireSession } from "../../../lib/serverAuth";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const session = await requireSession(request);
  if (!session.userId) return session;
  const body = await request.json();
  const { dayOfWeek, startTime, endTime, label } = body;
  if (typeof dayOfWeek !== "number" || !startTime || !endTime) {
    return NextResponse.json({ error: "INVALID_BREAK" }, { status: 400 });
  }
  await prisma.barberWeeklyBreak.upsert({
    where: { barberId_dayOfWeek: { barberId: session.userId, dayOfWeek } },
    update: { startTime, endTime, label },
    create: { barberId: session.userId, dayOfWeek, startTime, endTime, label },
  });
  return NextResponse.json({ ok: true });
}
