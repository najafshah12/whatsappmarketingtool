"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import Link from "next/link";

async function post(path: string, body: unknown) {
  const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Could not continue.");
  return data;
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const result = await post("/api/auth/login", { username, password });
      router.replace(result.mustChangePassword ? "/account/password" : "/"); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not sign in."); }
    finally { setBusy(false); }
  }

  return <main className="auth-shell"><div className="auth-glow auth-glow-one"/><div className="auth-glow auth-glow-two"/>
    <section className="auth-card">
      <div className="auth-brand"><Image className="auth-brand-mark" src="/reachpulse-mark.png" alt="RBS logo" width={56} height={42}/><div><b>RBS</b><small>BUSINESS WORKSPACE</small></div></div>
      <div className="auth-art"><div className="auth-orbit orbit-one"/><div className="auth-orbit orbit-two"/><div className="auth-art-icon"><span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -1 }}>RBS</span></div></div>
      <div className="auth-copy"><span className="eyebrow">RBS WORKSPACE</span><h1>Welcome Back</h1><p>Sign in to continue to your workspace.</p></div>
      <form className="auth-form" onSubmit={submit}>
        <label className="auth-label">Email or admin login ID<div className="auth-input"><span>@</span><input autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required placeholder="you@example.com" /></div></label><label className="auth-label">Password<div className="auth-input"><KeyRound size={16}/><input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" /></div></label>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <button className="auth-submit" disabled={busy}>{busy ? "Please wait…" : <>Sign in <ArrowRight size={17}/></>}</button>
      </form>
      <p className="auth-copy" style={{ textAlign: "center", marginTop: 18 }}>New agency? <Link href="/register">Create an agency account</Link></p>
      <div className="auth-foot"><ShieldCheck size={14}/> Protected with secure password sign-in</div>
      <nav aria-label="Legal information" style={{ display: "flex", justifyContent: "center", gap: 15, marginTop: 14, fontSize: 10 }}><Link href="/privacy" style={{ color: "#4e7e92" }}>Privacy</Link><Link href="/terms" style={{ color: "#4e7e92" }}>Terms</Link><Link href="/data-deletion" style={{ color: "#4e7e92" }}>Data deletion</Link></nav>
    </section><footer className="auth-caption">RBS <span>·</span> BUSINESS WORKSPACE</footer>
  </main>;
}
