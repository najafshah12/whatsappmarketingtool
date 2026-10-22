"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, KeyRound, Mail, ShieldCheck } from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [challengeId, setChallengeId] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  async function sendCode() {
    setError(""); setBusy(true);
    try { const response = await fetch("/api/auth/change-password/request-code", { method: "POST" }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not send a code."); setChallengeId(data.challengeId); setEmailHint(data.emailHint || "your admin email"); setSent(true); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not send a code."); } finally { setBusy(false); }
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (password !== confirm) { setError("The two passwords do not match."); return; }
    setBusy(true);
    try { const response = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ challengeId, code, password }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not update password."); router.replace("/"); router.refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not update password."); } finally { setBusy(false); }
  }
  return <main className="auth-shell"><div className="auth-glow auth-glow-one"/><div className="auth-glow auth-glow-two"/><section className="auth-card auth-card-password"><div className="auth-brand"><Image className="auth-brand-mark" src="/reachpulse-mark.png" alt="ReachPulse logo" width={56} height={42}/><div><b>ReachPulse</b><small>AMPLIFYING YOUR REACH</small></div></div><div className="auth-art password-art"><div className="auth-orbit orbit-one"/><div className="auth-orbit orbit-two"/><div className="auth-art-icon"><KeyRound size={31}/></div></div><div className="auth-copy"><span className="eyebrow">{sent ? "EMAIL CHECK" : "FIRST SIGN IN"}</span><h1>{sent ? "Choose a new password." : "Secure your account."}</h1><p>{sent ? <>Enter the code sent to <b>{emailHint}</b> and choose a new password with at least 12 characters.</> : "For your safety, change the temporary password before opening your workspace."}</p></div>
    {!sent ? <div className="auth-form"><button className="auth-submit" disabled={busy} onClick={sendCode}>{busy ? "Sending…" : <>Email me a verification code <ArrowRight size={17}/></>}</button>{error && <div className="auth-error" role="alert">{error}</div>}</div> : <form className="auth-form" onSubmit={submit}><label className="auth-label">Verification code<div className="auth-input"><Mail size={16}/><input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} required placeholder="6 digit code" /></div></label><label className="auth-label">New password<div className="auth-input"><KeyRound size={16}/><input type="password" autoComplete="new-password" minLength={12} value={password} onChange={e => setPassword(e.target.value)} required placeholder="At least 12 characters" /></div></label><label className="auth-label">Confirm new password<div className="auth-input"><KeyRound size={16}/><input type="password" autoComplete="new-password" minLength={12} value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Type it again" /></div></label>{error && <div className="auth-error" role="alert">{error}</div>}<button className="auth-submit" disabled={busy}>{busy ? "Saving…" : <>Save password and continue <ArrowRight size={17}/></>}</button></form>}
    <div className="auth-foot"><ShieldCheck size={14}/> Password is stored securely as a one-way hash</div></section><footer className="auth-caption">REACHPULSE <span>·</span> AMPLIFYING YOUR REACH</footer></main>;
}
