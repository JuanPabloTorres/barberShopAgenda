"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useToast } from "../../../components/ui/useToast";
import { Toast } from "../../../components/ui/Toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toasts, showToast } = useToast();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      showToast("Login successful!", "success");
      router.replace("/admin/agenda");
    } else {
      showToast("Invalid credentials.", "error");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white rounded shadow p-6">
      <h1 className="text-2xl font-bold mb-4">Admin/Barber Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
      </form>
      <Toast toasts={toasts} />
    </div>
  );
}
