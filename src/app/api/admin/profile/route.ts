import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/serverAuth";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const session = await requireAdmin(request);
  if (!session.userId) return session;
  const body = await request.json();
  const { name, password } = body;
  const data: any = {};
  if (name) data.name = name;
  if (password) {
    const bcrypt = await import("bcrypt");
    data.passwordHash = await bcrypt.hash(password, 10);
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "NO_DATA" }, { status: 400 });
  }
  await prisma.user.update({ where: { id: session.userId }, data });
  return NextResponse.json({ ok: true });
}
