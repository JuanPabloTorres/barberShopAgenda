"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "../../../components/ui/DataTable";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { Input } from "../../../components/ui/Input";
import { useToast } from "../../../components/ui/useToast";
import { Toast } from "../../../components/ui/Toast";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [form, setForm] = useState({ name: "", price: "", durationMin: "" });
  const { toasts, showToast } = useToast();

  function fetchServices() {
    setLoading(true);
    fetch("/api/admin/services")
      .then(r => r.json())
      .then(d => setServices(d.services || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchServices();
  }, []);

  function openCreate() {
    setForm({ name: "", price: "", durationMin: "" });
    setSelectedService(null);
    setShowModal(true);
  }

  function openEdit(service: any) {
    setForm({ name: service.name, price: (service.price/100).toString(), durationMin: service.durationMin.toString() });
    setSelectedService(service);
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const method = selectedService ? "PUT" : "POST";
    const url = selectedService ? `/api/admin/services/${selectedService.id}` : "/api/admin/services";
    const body = {
      name: form.name,
      price: Math.round(Number(form.price) * 100),
      durationMin: Number(form.durationMin),
      isActive: true,
    };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (res.ok) {
      showToast("Service saved", "success");
      setShowModal(false);
      fetchServices();
    } else {
      showToast("Failed to save service", "error");
    }
  }

  function openDisable(service: any) {
    setSelectedService(service);
    setShowConfirm(true);
  }

  async function handleDisable() {
    setLoading(true);
    const res = await fetch(`/api/admin/services/${selectedService.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });
    setLoading(false);
    setShowConfirm(false);
    if (res.ok) {
      showToast("Service disabled", "success");
      fetchServices();
    } else {
      showToast("Failed to disable service", "error");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "price", label: "Price" },
    { key: "durationMin", label: "Duration (min)" },
    { key: "isActive", label: "Active" },
    { key: "actions", label: "Actions" },
  ];

  const data = services.map((s: any) => ({
    ...s,
    price: `$${(s.price/100).toFixed(2)}`,
    isActive: s.isActive ? "Yes" : "No",
    actions: (
      <div className="flex gap-2">
        <Button onClick={() => openEdit(s)} className="bg-amber-500 hover:bg-amber-600">Edit</Button>
        {s.isActive === true && (
          <Button onClick={() => openDisable(s)} className="bg-red-500 hover:bg-red-600">Disable</Button>
        )}
      </div>
    ),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Services</h1>
      <Button onClick={openCreate} className="mb-4">Create Service</Button>
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
            placeholder="Price (USD)"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            required
          />
          <Input
            placeholder="Duration (minutes)"
            type="number"
            min="1"
            value={form.durationMin}
            onChange={e => setForm(f => ({ ...f, durationMin: e.target.value }))}
            required
          />
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        </form>
      </Modal>
      <ConfirmDialog
        open={showConfirm}
        onConfirm={handleDisable}
        onCancel={() => setShowConfirm(false)}
        message="Are you sure you want to disable this service?"
      />
      <Toast toasts={toasts} />
    </div>
  );
}
