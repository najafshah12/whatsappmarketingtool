"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, BadgeCheck, KeyRound, Mail, ShieldCheck } from "lucide-react";

async function post(path: string, body: unknown) {
  const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Could not continue.");
  return data;
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "code">("login");
  const [username, setUsername] = useState("abis");
  const [password, setPassword] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      if (step === "login") {
        const result = await post("/api/auth/login", { username, password });
        setChallengeId(result.challengeId); setEmailHint(result.emailHint || "your admin email"); setStep("code");
      } else {
        const result = await post("/api/auth/verify", { challengeId, code });
        router.replace(result.mustChangePassword ? "/account/password" : "/"); router.refresh();
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Could not sign in."); }
    finally { setBusy(false); }
  }

  return <main className="auth-shell"><div className="auth-glow auth-glow-one"/><div className="auth-glow auth-glow-two"/>
    <section className="auth-card">
      <div className="auth-brand"><Image className="auth-brand-mark" src="/reachpulse-mark.png" alt="ReachPulse logo" width={56} height={42}/><div><b>ReachPulse</b><small>AMPLIFYING YOUR REACH</small></div></div>
      <div className="auth-art"><div className="auth-orbit orbit-one"/><div className="auth-orbit orbit-two"/><div className="auth-art-icon"><ShieldCheck size={34}/></div><span className="auth-float float-a"><Mail size={16}/></span><span className="auth-float float-b"><BadgeCheck size={16}/></span></div>
      <div className="auth-copy"><span className="eyebrow">REACHPULSE WORKSPACE</span><h1>{step === "login" ? "Welcome back, Abis." : "One quick check."}</h1><p>{step === "login" ? "Sign in to pick up where your campaigns left off." : <>We sent a six-digit verification code to <b>{emailHint}</b>. It expires in 10 minutes.</>}</p></div>
      <form className="auth-form" onSubmit={submit}>
        {step === "login" ? <><label className="auth-label">Login ID<div className="auth-input"><span>@</span><input autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required /></div></label><label className="auth-label">Password<div className="auth-input"><KeyRound size={16}/><input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" /></div></label></> : <label className="auth-label">Email verification code<div className="auth-input"><Mail size={16}/><input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} required placeholder="6 digit code" /></div></label>}
        {error && <div className="auth-error" role="alert">{error}</div>}
        <button className="auth-submit" disabled={busy}>{busy ? "Please wait…" : step === "login" ? <>Continue securely <ArrowRight size={17}/></> : <>Verify and sign in <ArrowRight size={17}/></>}</button>
        {step === "code" && <button type="button" className="auth-back" onClick={() => { setStep("login"); setCode(""); setError(""); }}>Back to login</button>}
      </form>
      <div className="auth-foot"><ShieldCheck size={14}/> Protected with email verification</div>
    </section><footer className="auth-caption">REACHPULSE <span>·</span> AMPLIFYING YOUR REACH</footer>
  </main>;
}
