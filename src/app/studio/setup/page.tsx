"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// One-time admin setup. Requires the setup code below.
// REMOVE this route after the admin account is created.
const SETUP_CODE = "NUUN-SETUP-7X2K9";

export default function StudioSetupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (code !== SETUP_CODE) {
      setStatus("Wrong setup code.");
      return;
    }
    if (password.length < 6) {
      setStatus("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) {
      setStatus("Error: " + error.message);
      return;
    }
    if (data.user && !data.session) {
      setOk(true);
      setStatus("Account created. Check your email to confirm, then sign in at /studio/login.");
    } else {
      setOk(true);
      setStatus("Account created & signed in. Go to /studio/login (or /studio/dashboard).");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/[0.03] border border-white/[0.08] rounded-3xl p-10">
        <h1 className="text-2xl font-black text-white mb-1">Admin Setup</h1>
        <p className="text-white/40 text-sm mb-8">Create the Studio admin account (one-time).</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/70 block mb-1.5">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nuun.so"
              className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFD400]/50 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 block mb-1.5">New Password</label>
            <input
              type="text" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="min 6 characters"
              className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFD400]/50 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 block mb-1.5">Setup Code</label>
            <input
              type="text" required value={code} onChange={(e) => setCode(e.target.value)}
              placeholder="setup code"
              className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFD400]/50 text-sm"
            />
          </div>

          {status && (
            <div className={`p-3 rounded-xl text-sm border ${ok ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
              {status}
            </div>
          )}

          <button
            type="submit" disabled={busy}
            className="w-full h-12 bg-[#FFD400] text-[#0A0A0A] rounded-xl font-bold disabled:opacity-50 hover:bg-[#FFD400]/90 transition-all"
          >
            {busy ? "Creating…" : "Create Admin Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
