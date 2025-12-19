"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/ui/DataTable";
import { Button } from "@/ui/Button";
import { Icons } from "@/ui/icons";
import { Modal } from "@/ui/Modal";
import { ConfirmDialog } from "@/ui/ConfirmDialog";
import { Input } from "@/ui/Input";
import { useToast } from "@/ui/useToast";
import { Toast } from "@/ui/Toast";
import { PageHeader } from "@/ui/PageHeader";
import { FilterBar } from "@/ui/FilterBar";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [form, setForm] = useState({ name: "", price: "", durationMin: "" });
  const [searchTerm, setSearchTerm] = useState("");
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
    { key: "actions", label: "Actions", className: "text-right" },
  ];

  const filteredServices = services.filter((service: any) => {
    if (!searchTerm) return true;
    return service.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const data = filteredServices.map((service: any) => ({
    ...service,
    price: `$${(service.price/100).toFixed(2)}`,
    isActive: service.isActive ? "Yes" : "No",
    actions: (
      <div className="flex justify-end gap-2">
        <Button onClick={() => openEdit(service)} className="bg-brick-700 hover:bg-brick-800 flex items-center gap-1">
          <Icons.edit className="w-4 h-4" aria-hidden="true" /> Edit
        </Button>
        {service.isActive === true && (
          <Button onClick={() => openDisable(service)} className="bg-chrome-600 hover:bg-chrome-700 flex items-center gap-1">
            <Icons.delete className="w-4 h-4" aria-hidden="true" /> Disable
          </Button>
        )}
      </div>
    ),
  }));

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle="Manage services, pricing, and durations."
        actions={
          <Button onClick={openCreate} className="bg-brick-700 hover:bg-brick-800 flex items-center gap-1">
            <Icons.add className="w-4 h-4" aria-hidden="true" /> Create Service
          </Button>
        }
      />
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search services"
        onClear={() => setSearchTerm("")}
      />
      <DataTable columns={columns} data={data} loading={loading} emptyMessage="No services found." />
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={selectedService ? "Edit Service" : "Create Service"}
      >
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
          <Button type="submit" disabled={loading} className="bg-brick-700 hover:bg-brick-800">
            {loading ? "Saving..." : "Save"}
          </Button>
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
