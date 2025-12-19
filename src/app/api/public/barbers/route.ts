import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const barbers = await prisma.user.findMany({
    where: { role: "BARBER", isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ barbers });
}
