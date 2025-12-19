import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { NextResponse } from "next/server";

export async function requireSession(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  return session;
}

export async function requireAdmin(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  return session;
}
