import { prisma } from "@/lib/prisma";
import { sendConfirmationEmail } from "@/lib/email";
import { timeToMinutes, subtractInterval } from "@/lib/timeHelpers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { barberId, serviceId, date, startTime, clientName, clientPhone, clientEmail } = body;
    if (!barberId || !serviceId || !date || !startTime || !clientName || !clientPhone || !clientEmail) {
      return NextResponse.json({ error: "MISSING_PARAMS" }, { status: 400 });
    }
    // Load service
    const service = await prisma.service.findFirst({ where: { id: serviceId, isActive: true } });
    if (!service) return NextResponse.json({ error: "SERVICE_NOT_FOUND" }, { status: 400 });
    // Load barber
    const barber = await prisma.user.findFirst({ where: { id: barberId, role: "BARBER", isActive: true } });
    if (!barber) return NextResponse.json({ error: "BARBER_NOT_FOUND" }, { status: 400 });
    const startMinutes = timeToMinutes(startTime);
    if (Number.isNaN(startMinutes)) {
      return NextResponse.json({ error: "INVALID_TIME" }, { status: 400 });
    }
    // Load schedule for day
    const dayOfWeek = new Date(`${date}T00:00:00`).getDay();
    const schedule = await prisma.barberWeeklySchedule.findUnique({
      where: { barberId_dayOfWeek: { barberId, dayOfWeek } },
    });
    if (!schedule || schedule.isClosed) {
      return NextResponse.json({ error: "OUT_OF_SCHEDULE" }, { status: 400 });
    }
    let intervals = [
      { start: timeToMinutes(schedule.startTime), end: timeToMinutes(schedule.endTime) },
    ];
    // Subtract break
    const breakObj = await prisma.barberWeeklyBreak.findUnique({
      where: { barberId_dayOfWeek: { barberId, dayOfWeek } },
    });
    if (breakObj) {
      intervals = subtractInterval(intervals, {
        start: timeToMinutes(breakObj.startTime),
        end: timeToMinutes(breakObj.endTime),
      });
    }
    // Subtract time off
    const timeOffs = await prisma.barberTimeOff.findMany({
      where: { barberId, date },
    });
    for (const t of timeOffs) {
      if (t.isAllDay) {
        return NextResponse.json({ error: "BARBER_OFF" }, { status: 400 });
      }
      if (t.startTime && t.endTime) {
        intervals = subtractInterval(intervals, {
          start: timeToMinutes(t.startTime),
          end: timeToMinutes(t.endTime),
        });
      }
    }
    const endMinutes = startMinutes + service.durationMin;
    const fitsSchedule = intervals.some((interval) => startMinutes >= interval.start && endMinutes <= interval.end);
    if (!fitsSchedule) {
      return NextResponse.json({ error: "OUT_OF_SCHEDULE" }, { status: 400 });
    }
    // Calculate start/end
    const startAt = new Date(`${date}T${startTime}:00`);
    const endAt = new Date(startAt.getTime() + service.durationMin * 60000);
    // Check overlap
    const overlap = await prisma.appointment.findFirst({
      where: {
        barberId,
        status: "BOOKED",
        OR: [
          { startAt: { lt: endAt }, endAt: { gt: startAt } },
        ],
      },
    });
    if (overlap) {
      return NextResponse.json({ error: "TIME_TAKEN" }, { status: 409 });
    }
    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        barberId,
        serviceId,
        startAt,
        endAt,
        clientName,
        clientPhone,
        clientEmail,
        status: "BOOKED",
      },
    });
    // Send confirmation email (safe)
    sendConfirmationEmail({
      to: clientEmail,
      subject: "Your Appointment is Confirmed",
      html: `<p>Hi ${clientName},</p><p>Your appointment for <b>${service.name}</b> with <b>${barber.name}</b> is confirmed for <b>${date}</b> at <b>${startTime}</b>.</p>`,
    });
    return NextResponse.json({ ok: true, appointmentId: appointment.id });
  } catch (err) {
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
