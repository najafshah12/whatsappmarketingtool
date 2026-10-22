import { NextResponse } from "next/server";
import { createSessionToken, sessionCookieName } from "@/lib/auth";
import { verifyEmailChallenge } from "@/lib/auth-challenge";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { challengeId, code } = await req.json();
    if (typeof challengeId !== "string" || typeof code !== "string" || !/^\d{6}$/.test(code)) return NextResponse.json({ error: "Enter the six-digit code from your email." }, { status: 400 });
    if (!await verifyEmailChallenge(challengeId, code, "login")) return NextResponse.json({ error: "That code is invalid or expired." }, { status: 401 });
    const changedPassword = await prisma.setting.findUnique({ where: { key: "auth.password_hash" }, select: { key: true } });
    const response = NextResponse.json({ ok: true, mustChangePassword: !changedPassword });
    response.cookies.set(sessionCookieName, createSessionToken(process.env.ADMIN_USERNAME!, !changedPassword), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12,
    });
    return response;
  } catch { return NextResponse.json({ error: "Could not verify the code." }, { status: 503 }); }
}
