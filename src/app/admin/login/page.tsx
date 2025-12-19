"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { useToast } from "@/ui/useToast";
import { Toast } from "@/ui/Toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toasts, showToast } = useToast();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
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
      setErrorMessage("Invalid credentials. Please try again.");
      showToast("Invalid credentials.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 px-4 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm md:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-brick-900 p-8 text-cream-100">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-cream-100/60">Barber Agenda</div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight">
              Manage your chairs, bookings, and day in one clean dashboard.
            </h1>
            <p className="mt-3 text-sm text-cream-100/80">
              Sign in to review today&apos;s agenda, update services, and keep the shop running on time.
            </p>
          </div>
          <div className="mt-8 rounded-lg border border-cream-100/10 bg-brick-800/60 p-4 text-sm text-cream-100/80">
            <div className="font-medium text-cream-100">Welcome back</div>
            <p className="mt-1 text-xs text-cream-100/70">
              Use your admin or barber credentials to access the dashboard.
            </p>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center bg-white p-8 md:p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-slatewood-900">Sign in</h2>
            <p className="mt-1 text-sm text-slatewood-600">Enter your credentials to continue.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              {errorMessage && (
                <div className="rounded-md border border-leather-200 bg-leather-100 px-3 py-2 text-xs text-leather-700">
                  {errorMessage}
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full bg-brick-700 hover:bg-brick-800">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}
