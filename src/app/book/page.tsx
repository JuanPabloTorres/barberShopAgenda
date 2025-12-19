"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../components/ui/useToast";
import { Toast } from "../../components/ui/Toast";
import { Loading } from "../../components/ui/Loading";

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
    <div className="max-w-md mx-auto mt-8 bg-white rounded shadow p-6">
      <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select value={barberId} onChange={e => setBarberId(e.target.value)} required>
          <option value="">Select Barber</option>
          {barbers.map((b: any) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </Select>
        <Select value={serviceId} onChange={e => setServiceId(e.target.value)} required>
          <option value="">Select Service</option>
          {services.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name} (${(s.price/100).toFixed(2)})</option>
          ))}
        </Select>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} required min={new Date().toISOString().split("T")[0]} />
        {loading && <Loading />}
        {slots.length > 0 && (
          <Select value={slot} onChange={e => setSlot(e.target.value)} required>
            <option value="">Select Time Slot</option>
            {slots.map((s: any, i: number) => (
              <option key={i} value={`${s.startTime}-${s.endTime}`}>{s.startTime} - {s.endTime}</option>
            ))}
          </Select>
        )}
        <Input placeholder="Your Name" value={clientName} onChange={e => setClientName(e.target.value)} required />
        <Input placeholder="Phone" value={clientPhone} onChange={e => setClientPhone(e.target.value)} required />
        <Input placeholder="Email" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} required />
        <Button type="submit" disabled={loading || !slot}>Book Appointment</Button>
      </form>
      <Toast toasts={toasts} />
    </div>
  );
}
