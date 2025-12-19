import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/serverAuth";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin(request);
  if (!session.userId) return session;
  const { id } = params;
  const body = await request.json();
  const { status } = body;
  if (!status || !["DONE", "CANCELLED"].includes(status)) {
    return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
  }
  await prisma.appointment.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
