import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/serverAuth";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireSession(request);
  if (!session.userId) return session;
  const { id } = params;
  const body = await request.json();
  const { status } = body;
  if (!status || !["DONE", "CANCELLED"].includes(status)) {
    return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
  }
  // Only allow barber to update own appointment
  const appt = await prisma.appointment.findUnique({ where: { id } });
  if (!appt || appt.barberId !== session.userId) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  await prisma.appointment.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
