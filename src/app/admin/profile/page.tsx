"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "../../../components/ui/Button";
import { Icons } from "@/ui/icons";
import { Input } from "../../../components/ui/Input";
import { useToast } from "../../../components/ui/useToast";
import { Toast } from "../../../components/ui/Toast";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toasts, showToast } = useToast();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(
      session?.role === "ADMIN" ? "/api/admin/profile" : "/api/barber/profile",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password: password || undefined }),
      }
    );
    setLoading(false);
    if (res.ok) {
      showToast("Profile updated", "success");
      update();
      setPassword("");
    } else {
      showToast("Failed to update profile", "error");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded shadow p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <Input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <Input
          placeholder="New Password (optional)"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button type="submit" disabled={loading} className="flex items-center gap-1">
          <Icons.edit className="w-4 h-4" aria-hidden="true" />
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
      <Toast toasts={toasts} />
    </div>
  );
}
