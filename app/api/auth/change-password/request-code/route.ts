import { NextResponse } from "next/server";
import { currentSession } from "@/lib/auth";
import { startEmailChallenge } from "@/lib/auth-challenge";

export async function POST() {
  if (!await currentSession()) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  try {
    const challengeId = await startEmailChallenge("change-password");
    return NextResponse.json({ challengeId, emailHint: process.env.ADMIN_EMAIL?.replace(/^(.{1,2}).*(@.*)$/, "$1•••$2") });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not send the verification email." }, { status: 503 });
  }
}
