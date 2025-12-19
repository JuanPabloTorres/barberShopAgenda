import { prisma } from "../../../../lib/prisma";
import { timeToMinutes, minutesToTime, subtractInterval } from "../../../../lib/timeHelpers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");
  const barberId = searchParams.get("barberId");
  if (!date || !serviceId || !barberId) {
    return NextResponse.json({ error: "MISSING_PARAMS" }, { status: 400 });
  }

  // 1. Load service
  const service = await prisma.service.findFirst({ where: { id: serviceId, isActive: true } });
  if (!service) return NextResponse.json({ slots: [] });
  const duration = service.durationMin;

  // 2. Day of week
  const dayOfWeek = new Date(`${date}T00:00:00`).getDay();

  // 3. Load schedule
  const schedule = await prisma.barberWeeklySchedule.findUnique({
    where: { barberId_dayOfWeek: { barberId, dayOfWeek } },
  });
  if (!schedule || schedule.isClosed) return NextResponse.json({ slots: [] });
  let intervals = [
    { start: timeToMinutes(schedule.startTime), end: timeToMinutes(schedule.endTime) },
  ];

  // 4. Subtract break
  const breakObj = await prisma.barberWeeklyBreak.findUnique({
    where: { barberId_dayOfWeek: { barberId, dayOfWeek } },
  });
  if (breakObj) {
    intervals = subtractInterval(intervals, {
      start: timeToMinutes(breakObj.startTime),
      end: timeToMinutes(breakObj.endTime),
    });
  }

  // 5. Subtract time off
  const timeOffs = await prisma.barberTimeOff.findMany({
    where: { barberId, date },
  });
  for (const t of timeOffs) {
    if (t.isAllDay) {
      intervals = [];
      break;
    }
    if (t.startTime && t.endTime) {
      intervals = subtractInterval(intervals, {
        start: timeToMinutes(t.startTime),
        end: timeToMinutes(t.endTime),
      });
    }
  }

  // 6. Subtract booked appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      barberId,
      status: "BOOKED",
      startAt: {
        gte: new Date(`${date}T00:00:00`),
        lt: new Date(`${date}T23:59:59.999`),
      },
    },
  });
  for (const appt of appointments) {
    intervals = subtractInterval(intervals, {
      start: appt.startAt.getHours() * 60 + appt.startAt.getMinutes(),
      end: appt.endAt.getHours() * 60 + appt.endAt.getMinutes(),
    });
  }

  // 7. Generate slots (15 min step, slot must fit duration)
  const slots: { startTime: string; endTime: string }[] = [];
  for (const interval of intervals) {
    for (
      let start = interval.start;
      start + duration <= interval.end;
      start += 15
    ) {
      slots.push({
        startTime: minutesToTime(start),
        endTime: minutesToTime(start + duration),
      });
    }
  }
  return NextResponse.json({ slots });
}
