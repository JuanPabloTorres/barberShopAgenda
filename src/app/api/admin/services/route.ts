import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/serverAuth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await requireAdmin(request);
  if (!session.userId) return session;
  const services = await prisma.service.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ services });
}

export async function POST(request: Request) {
  const session = await requireAdmin(request);
  if (!session.userId) return session;
  const body = await request.json();
  const { name, price, durationMin } = body;
  if (!name || typeof price !== "number" || typeof durationMin !== "number") {
    return NextResponse.json({ error: "MISSING_PARAMS" }, { status: 400 });
  }
  const service = await prisma.service.create({
    data: { name, price, durationMin, isActive: true },
  });
  return NextResponse.json({ service });
}
