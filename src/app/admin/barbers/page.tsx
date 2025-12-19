"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "../../../components/ui/DataTable";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { Input } from "../../../components/ui/Input";
import { useToast } from "../../../components/ui/useToast";
import { Toast } from "../../../components/ui/Toast";

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { toasts, showToast } = useToast();

  function fetchBarbers() {
    setLoading(true);
    fetch("/api/admin/barbers")
      .then(r => r.json())
      .then(d => setBarbers(d.barbers || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchBarbers();
  }, []);

  function openCreate() {
    setForm({ name: "", email: "", password: "" });
    setSelectedBarber(null);
    setShowModal(true);
  }

  function openEdit(barber: any) {
    setForm({ name: barber.name, email: barber.email, password: "" });
    setSelectedBarber(barber);
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const method = selectedBarber ? "PUT" : "POST";
    const url = selectedBarber ? `/api/admin/barbers/${selectedBarber.id}` : "/api/admin/barbers";
    const body = selectedBarber
      ? { name: form.name, isActive: true }
      : { ...form };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (res.ok) {
      showToast("Barber saved", "success");
      setShowModal(false);
      fetchBarbers();
    } else {
      showToast("Failed to save barber", "error");
    }
  }

  function openDisable(barber: any) {
    setSelectedBarber(barber);
    setShowConfirm(true);
  }

  async function handleDisable() {
    setLoading(true);
    const res = await fetch(`/api/admin/barbers/${selectedBarber.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });
    setLoading(false);
    setShowConfirm(false);
    if (res.ok) {
      showToast("Barber disabled", "success");
      fetchBarbers();
    } else {
      showToast("Failed to disable barber", "error");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "isActive", label: "Active" },
    { key: "actions", label: "Actions" },
  ];

  const data = barbers.map((b: any) => ({
    ...b,
    isActive: b.isActive ? "Yes" : "No",
    actions: (
      <div className="flex gap-2">
        <Button onClick={() => openEdit(b)} className="bg-amber-500 hover:bg-amber-600">Edit</Button>
        {b.isActive === "Yes" && (
          <Button onClick={() => openDisable(b)} className="bg-red-500 hover:bg-red-600">Disable</Button>
        )}
      </div>
    ),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Barbers</h1>
      <Button onClick={openCreate} className="mb-4">Create Barber</Button>
      <DataTable columns={columns} data={data} />
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            disabled={!!selectedBarber}
          />
          {!selectedBarber && (
            <Input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          )}
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        </form>
      </Modal>
      <ConfirmDialog
        open={showConfirm}
        onConfirm={handleDisable}
        onCancel={() => setShowConfirm(false)}
        message="Are you sure you want to disable this barber?"
      />
      <Toast toasts={toasts} />
    </div>
  );
}
