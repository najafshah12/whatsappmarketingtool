import { randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { hashVerificationCode } from "@/lib/auth";

type Purpose = "login" | "change-password";
type ChallengeRecord = { email: string; purpose: Purpose; hash: string; expiresAt: number; attempts: number };

function challengeKey(id: string) { return `auth.verification.${id}`; }

export async function startEmailChallenge(purpose: Purpose) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const email = process.env.ADMIN_EMAIL;
  if (!apiKey || !from || !email) throw new Error("Email verification is not configured. Set RESEND_API_KEY, RESEND_FROM_EMAIL, and ADMIN_EMAIL.");

  const rateKey = `auth.email-rate.${purpose}`;
  const now = Date.now();
  const rateRow = await prisma.setting.findUnique({ where: { key: rateKey }, select: { value: true } });
  let rate: { windowStartedAt: number; lastSentAt: number; count: number } = { windowStartedAt: now, lastSentAt: 0, count: 0 };
  if (rateRow) {
    try { rate = JSON.parse(rateRow.value) as typeof rate; } catch { /* Reset malformed local rate state. */ }
  }
  if (now - rate.lastSentAt < 60_000) throw new Error("Please wait one minute before requesting another verification code.");
  if (now - rate.windowStartedAt >= 24 * 60 * 60_000) rate = { windowStartedAt: now, lastSentAt: 0, count: 0 };
  if (rate.count >= 6) throw new Error("Too many verification emails were requested today. Try again tomorrow.");

  const id = randomUUID();
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const record: ChallengeRecord = { email, purpose, hash: hashVerificationCode(id, code), expiresAt: Date.now() + 10 * 60_000, attempts: 0 };
  await prisma.setting.create({ data: { key: challengeKey(id), value: JSON.stringify(record) } });

  const subject = purpose === "login" ? "Your Abis workspace verification code" : "Confirm your password change";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject,
      text: `Your verification code is ${code}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    await prisma.setting.delete({ where: { key: challengeKey(id) } }).catch(() => undefined);
    throw new Error("The verification email could not be sent. Check your email provider settings.");
  }
  const nextRate = JSON.stringify({ ...rate, lastSentAt: now, count: rate.count + 1 });
  await prisma.setting.upsert({ where: { key: rateKey }, create: { key: rateKey, value: nextRate }, update: { value: nextRate } });
  return id;
}

export async function verifyEmailChallenge(id: string, code: string, purpose: Purpose) {
  const key = challengeKey(id);
  const row = await prisma.setting.findUnique({ where: { key } });
  if (!row) return false;
  let record: ChallengeRecord;
  try { record = JSON.parse(row.value) as ChallengeRecord; } catch { await prisma.setting.delete({ where: { key } }).catch(() => undefined); return false; }
  if (record.purpose !== purpose || record.expiresAt < Date.now() || record.attempts >= 5) {
    await prisma.setting.delete({ where: { key } }).catch(() => undefined);
    return false;
  }
  const supplied = hashVerificationCode(id, code);
  const expectedBuffer = Buffer.from(record.hash, "hex");
  const suppliedBuffer = Buffer.from(supplied, "hex");
  if (expectedBuffer.length !== suppliedBuffer.length || !timingSafeEqual(expectedBuffer, suppliedBuffer)) {
    record.attempts += 1;
    await prisma.setting.update({ where: { key }, data: { value: JSON.stringify(record) } });
    return false;
  }
  await prisma.setting.delete({ where: { key } });
  return true;
}
