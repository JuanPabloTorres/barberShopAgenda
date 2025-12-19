import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/serverAuth";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin(request);
  if (!session.userId) return session;
  const { id } = params;
  const body = await request.json();
  const { name, isActive } = body;
  const data: any = {};
  if (name) data.name = name;
  if (typeof isActive === "boolean") data.isActive = isActive;
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "NO_DATA" }, { status: 400 });
  }
  await prisma.user.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}
