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

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [searchTerm, setSearchTerm] = useState("");
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
    { key: "actions", label: "Actions", className: "text-right" },
  ];

  const filteredBarbers = barbers.filter((barber: any) => {
    if (!searchTerm) return true;
    const searchValue = searchTerm.toLowerCase();
    return `${barber.name} ${barber.email}`.toLowerCase().includes(searchValue);
  });

  const data = filteredBarbers.map((barber: any) => ({
    ...barber,
    isActive: barber.isActive ? "Yes" : "No",
    actions: (
      <div className="flex justify-end gap-2">
        <Button onClick={() => openEdit(barber)} className="bg-brick-700 hover:bg-brick-800 flex items-center gap-1">
          <Icons.edit className="w-4 h-4" aria-hidden="true" /> Edit
        </Button>
        {barber.isActive && (
          <Button onClick={() => openDisable(barber)} className="bg-chrome-600 hover:bg-chrome-700 flex items-center gap-1">
            <Icons.delete className="w-4 h-4" aria-hidden="true" /> Disable
          </Button>
        )}
      </div>
    ),
  }));

  return (
    <div>
      <PageHeader
        title="Barbers"
        subtitle="Manage barbers, access levels, and active status."
        actions={
          <Button onClick={openCreate} className="bg-brick-700 hover:bg-brick-800 flex items-center gap-1">
            <Icons.add className="w-4 h-4" aria-hidden="true" /> Create Barber
          </Button>
        }
      />
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search barber or email"
        onClear={() => setSearchTerm("")}
      />
      <DataTable columns={columns} data={data} loading={loading} emptyMessage="No barbers found." />
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={selectedBarber ? "Edit Barber" : "Create Barber"}
      >
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
          <Button type="submit" disabled={loading} className="bg-brick-700 hover:bg-brick-800">
            {loading ? "Saving..." : "Save"}
          </Button>
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
