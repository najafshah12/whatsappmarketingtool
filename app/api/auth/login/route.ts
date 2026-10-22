import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { startEmailChallenge } from "@/lib/auth-challenge";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (typeof username !== "string" || typeof password !== "string") return NextResponse.json({ error: "Enter your login ID and password." }, { status: 400 });
    const configuredUsername = process.env.ADMIN_USERNAME;
    const initialHash = process.env.ADMIN_PASSWORD_HASH;
    const savedHash = await prisma.setting.findUnique({ where: { key: "auth.password_hash" }, select: { value: true } });
    const passwordHash = savedHash?.value ?? initialHash;
    if (!configuredUsername || !passwordHash || !process.env.AUTH_SESSION_SECRET) return NextResponse.json({ error: "Login is not configured on this server yet." }, { status: 503 });
    const matches = username.trim().toLowerCase() === configuredUsername.trim().toLowerCase() && await verifyPassword(password, passwordHash);
    if (!matches) return NextResponse.json({ error: "Login ID or password is incorrect." }, { status: 401 });
    const challengeId = await startEmailChallenge("login");
    return NextResponse.json({ challengeId, emailHint: process.env.ADMIN_EMAIL?.replace(/^(.{1,2}).*(@.*)$/, "$1•••$2") });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start email verification.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
