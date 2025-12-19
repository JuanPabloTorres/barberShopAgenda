import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/serverAuth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await requireAdmin(request);
  if (!session.userId) return session;
  const barbers = await prisma.user.findMany({
    where: { role: "BARBER" },
    select: { id: true, name: true, email: true, role: true, isActive: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ barbers });
}

export async function POST(request: Request) {
  const session = await requireAdmin(request);
  if (!session.userId) return session;
  const body = await request.json();
  const { name, email, password } = body;
  if (!name || !email || !password) {
    return NextResponse.json({ error: "MISSING_PARAMS" }, { status: 400 });
  }
  const bcrypt = await import("bcrypt");
  const passwordHash = await bcrypt.hash(password, 10);
  const barber = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "BARBER",
      isActive: true,
    },
  });
  return NextResponse.json({ barber });
}
