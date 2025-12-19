import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/serverAuth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await requireSession(request);
  if (!session.userId) return session;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const where: any = { barberId: session.userId };
  if (date) {
    const [year, month, day] = date.split("-").map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day + 1, 0, 0, 0, 0);
    where.startAt = {
      gte: startOfDay,
      lt: endOfDay,
    };
  }
  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: { startAt: "asc" },
  });
  return NextResponse.json({ appointments });
}
