"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Select } from "@/ui/Select";
import { Button } from "@/ui/Button";
import { Loading } from "@/ui/Loading";
import { useToast } from "@/ui/useToast";
import { Toast } from "@/ui/Toast";
import { PageHeader } from "@/ui/PageHeader";
import { FilterBar } from "@/ui/FilterBar";
import { DataTable } from "@/ui/DataTable";

export default function AgendaPage() {
  const { data: session } = useSession();
  const todayDate = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(() => todayDate);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [barberId, setBarberId] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredAppointments = appointments.filter((appointment) => {
    if (!searchTerm) return true;
    const searchValue = searchTerm.toLowerCase();
    const combinedFields = `${appointment.clientName} ${appointment.clientEmail} ${appointment.clientPhone}`.toLowerCase();
    return combinedFields.includes(searchValue);
  });

  const columns = [
    { key: "client", label: "Client" },
    { key: "contact", label: "Contact" },
    { key: "time", label: "Time" },
    { key: "service", label: "Service" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", className: "text-right" },
  ];

  const tableData = filteredAppointments.map((appointment: any) => ({
    client: (
      <div>
        <div className="font-semibold text-slatewood-900">{appointment.clientName}</div>
        <div className="text-xs text-slatewood-500">#{appointment.id.slice(0, 6)}</div>
      </div>
    ),
    contact: (
      <div className="text-sm text-slatewood-700">
        <div>{appointment.clientEmail}</div>
        <div className="text-xs text-slatewood-500">{appointment.clientPhone}</div>
      </div>
    ),
    time: (
      <div className="text-sm text-slatewood-700">
        {new Date(appointment.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    ),
    service: <div className="text-sm text-slatewood-700">{appointment.serviceId}</div>,
    status: <div className="text-sm text-slatewood-700">{appointment.status}</div>,
    actions: (
      <div className="flex justify-end gap-2">
        {appointment.status === "BOOKED" && (
          <>
            <Button onClick={() => updateStatus(appointment.id, "DONE")} className="bg-brick-700 hover:bg-brick-800">
              Mark Done
            </Button>
            <Button onClick={() => updateStatus(appointment.id, "CANCELLED")} className="bg-chrome-600 hover:bg-chrome-700">
              Cancel
            </Button>
          </>
        )}
      </div>
    ),
  }));

  return (
    <div>
      <PageHeader
        title="Agenda"
        subtitle="Review upcoming appointments and update statuses."
      />
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search client, email, phone"
        dateValue={date}
        onDateChange={setDate}
        onClear={() => {
          setSearchTerm("");
          setDate(todayDate);
          setBarberId("");
        }}
      >
        {isAdmin && (
          <Select value={barberId} onChange={e => setBarberId(e.target.value)}>
            <option value="">All Barbers</option>
            {barbers.map((barber: any) => (
              <option key={barber.id} value={barber.id}>{barber.name}</option>
            ))}
          </Select>
        )}
      </FilterBar>
      {loading && <Loading />}
      <DataTable
        columns={columns}
        data={tableData}
        loading={loading}
        emptyMessage="No appointments found for this date."
      />
      <Toast toasts={toasts} />
    </div>
  );
}
