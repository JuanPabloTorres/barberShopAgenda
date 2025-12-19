"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/ui/Button";
import { Select } from "@/ui/Select";
import { Input } from "@/ui/Input";
import { useToast } from "@/ui/useToast";
import { Toast } from "@/ui/Toast";
import { Loading } from "@/ui/Loading";
import { PageHeader } from "@/ui/PageHeader";


export default function BookPage() {
  const [barbers, setBarbers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [date, setDate] = useState("");
  const [barberId, setBarberId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [slots, setSlots] = useState<any[]>([]);
  const [slot, setSlot] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toasts, showToast } = useToast();

  useEffect(() => {
    fetch("/api/public/barbers").then(r => r.json()).then(d => setBarbers(d.barbers));
    fetch("/api/public/services").then(r => r.json()).then(d => setServices(d.services));
  }, []);

  useEffect(() => {
    if (date && barberId && serviceId) {
      setLoading(true);
      fetch(`/api/public/availability?date=${date}&barberId=${barberId}&serviceId=${serviceId}`)
        .then(r => r.json())
        .then(d => setSlots(d.slots || []))
        .finally(() => setLoading(false));
    } else {
      setSlots([]);
    }
  }, [date, barberId, serviceId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const [startTime] = slot.split("-");
    const res = await fetch("/api/public/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barberId,
        serviceId,
        date,
        startTime,
        clientName,
        clientPhone,
        clientEmail,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      showToast("Appointment booked! Confirmation sent.", "success");
      setSlot("");
      setClientName("");
      setClientPhone("");
      setClientEmail("");
    } else {
      showToast(data.error === "TIME_TAKEN" ? "Time slot already taken." : "Booking failed.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <div className="mx-auto w-full max-w-4xl flex-1 flex flex-col gap-8 px-4 py-10 md:px-8">
        <PageHeader
          title="Book an Appointment"
          subtitle="Choose your barber, service, and time. We will handle the rest."
        />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-cream-200 bg-white p-8 shadow-lg flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slatewood-500 mb-1 block">Barber</label>
                  <Select value={barberId} onChange={e => setBarberId(e.target.value)} required>
                    <option value="">Select Barber</option>
                    {barbers.map((barber: any) => (
                      <option key={barber.id} value={barber.id}>{barber.name}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slatewood-500 mb-1 block">Service</label>
                  <Select value={serviceId} onChange={e => setServiceId(e.target.value)} required>
                    <option value="">Select Service</option>
                    {services.map((service: any) => (
                      <option key={service.id} value={service.id}>
                        {service.name} (${(service.price / 100).toFixed(2)})
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slatewood-500 mb-1 block">Date</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                {slots.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slatewood-500 mb-1 block">Time Slot</label>
                    <Select value={slot} onChange={e => setSlot(e.target.value)} required>
                      <option value="">Select Time Slot</option>
                      {slots.map((slotOption: any, index: number) => (
                        <option key={index} value={`${slotOption.startTime}-${slotOption.endTime}`}>
                          {slotOption.startTime} - {slotOption.endTime}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
              </div>
              {loading && <Loading />}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slatewood-500 mb-1 block">Your Name</label>
                  <Input placeholder="Your Name" value={clientName} onChange={e => setClientName(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slatewood-500 mb-1 block">Phone</label>
                  <Input placeholder="Phone" value={clientPhone} onChange={e => setClientPhone(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slatewood-500 mb-1 block">Email</label>
                <Input placeholder="Email" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} required />
              </div>
              <Button type="submit" disabled={loading || !slot} className="w-full bg-brick-700 hover:bg-brick-800">
                {loading ? "Booking..." : "Book Appointment"}
              </Button>
            </form>
          </div>
          <div className="rounded-2xl border border-cream-200 bg-brick-900 p-8 text-cream-100 shadow-lg flex flex-col justify-center">
            <div className="text-xs uppercase tracking-[0.2em] text-cream-100/60">The shop</div>
            <h2 className="mt-4 text-2xl font-semibold">Classic cuts. Modern rhythm.</h2>
            <p className="mt-3 text-sm text-cream-100/80">
              Our barbers keep the schedule tight and the details sharp. Pick a time that works and show up ready.
            </p>
            <div className="mt-6 rounded-xl border border-cream-100/10 bg-brick-800/60 p-4 text-sm text-cream-100/80">
              <div className="font-medium text-cream-100">Need to reschedule?</div>
              <p className="mt-1 text-xs text-cream-100/70">
                Call the shop at least 2 hours before your slot.
              </p>
            </div>
            <div className="mt-6 grid gap-3">
              <div className="rounded-lg border border-cream-100/10 bg-brick-800/40 px-4 py-3">
                <div className="text-xs uppercase tracking-wide text-cream-100/60">Hours</div>
                <div className="text-sm font-semibold text-cream-100">Mon–Sat • 9:00 AM – 6:00 PM</div>
              </div>
              <div className="rounded-lg border border-cream-100/10 bg-brick-800/40 px-4 py-3">
                <div className="text-xs uppercase tracking-wide text-cream-100/60">Location</div>
                <div className="text-sm font-semibold text-cream-100">Downtown Barber Studio</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}
