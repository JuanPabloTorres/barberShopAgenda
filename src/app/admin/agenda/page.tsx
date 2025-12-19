"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { Loading } from "../../../components/ui/Loading";
import { useToast } from "../../../components/ui/useToast";
import { Toast } from "../../../components/ui/Toast";

export default function AgendaPage() {
  const { data: session } = useSession();
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [barberId, setBarberId] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toasts, showToast } = useToast();

  const isAdmin = session?.role === "ADMIN";

  useEffect(() => {
    if (isAdmin) {
      fetch("/api/public/barbers").then(r => r.json()).then(d => setBarbers(d.barbers));
    }
  }, [isAdmin]);

  useEffect(() => {
    setLoading(true);
    let url = isAdmin ? `/api/admin/appointments?date=${date}` : `/api/barber/appointments?date=${date}`;
    if (isAdmin && barberId) url += `&barberId=${barberId}`;
    fetch(url)
      .then(r => r.json())
      .then(d => setAppointments(d.appointments || []))
      .finally(() => setLoading(false));
  }, [date, barberId, isAdmin]);

  async function updateStatus(id: string, status: "DONE" | "CANCELLED") {
    setLoading(true);
    const url = isAdmin ? `/api/admin/appointments/${id}` : `/api/barber/appointments/${id}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    if (res.ok) {
      showToast("Status updated", "success");
      setAppointments((prev) => prev.map(a => a.id === id ? { ...a, status } : a));
    } else {
      showToast("Failed to update status", "error");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Agenda</h1>
      <div className="flex gap-2 mb-4 items-end">
        <label className="block">
          <span className="text-sm font-medium">Date</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="rounded border px-2 py-1 ml-2" />
        </label>
        {isAdmin && (
          <Select value={barberId} onChange={e => setBarberId(e.target.value)}>
            <option value="">All Barbers</option>
            {barbers.map((b: any) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </Select>
        )}
      </div>
      {loading && <Loading />}
      <div className="space-y-4">
        {appointments.length === 0 && !loading && (
          <div className="text-gray-500">No appointments found.</div>
        )}
        {appointments.map((a: any) => (
          <div key={a.id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold text-lg">{a.clientName}</div>
              <div className="text-gray-600 text-sm">{a.clientEmail} | {a.clientPhone}</div>
              <div className="text-gray-700 mt-1">{new Date(a.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {a.status}</div>
              <div className="text-gray-700 text-sm">Service: {a.serviceId}</div>
            </div>
            {a.status === "BOOKED" && (
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button onClick={() => updateStatus(a.id, "DONE")}>Mark Done</Button>
                <Button onClick={() => updateStatus(a.id, "CANCELLED")}>Cancel</Button>
              </div>
            )}
          </div>
        ))}
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}
