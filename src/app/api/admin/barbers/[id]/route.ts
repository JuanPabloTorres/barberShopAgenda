import { prisma } from "@lib/prisma";
import { requireAdmin } from "@lib/serverAuth";
import { NextResponse } from "next/server";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> } | { params: { id: string } }) {
  const session = await requireAdmin(request);
  if (session instanceof NextResponse) return session;
  if (!session.userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  let id: string;
  if (context.params instanceof Promise) {
    const params = await context.params;
    id = params.id;
  } else {
    id = context.params.id;
  }
  const body = await request.json();
  const { name, isActive } = body;
  const data: any = {};
  if (name) data.name = name;
  if (typeof isActive === "boolean") data.isActive = isActive;
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "NO_DATA" }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ error: "NO_ID" }, { status: 400 });
  }
  await prisma.user.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}
