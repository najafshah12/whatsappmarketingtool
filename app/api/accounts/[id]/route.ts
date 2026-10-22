import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const { id } = await params; const { status } = await req.json(); if (!['connected', 'disconnected', 'attention'].includes(status)) return NextResponse.json({ error: "Invalid account status." }, { status: 400 }); return NextResponse.json(await prisma.whatsAppAccount.update({ where: { id }, data: { status } })); }
  catch (error) { return apiError(error); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const { id } = await params; await prisma.whatsAppAccount.delete({ where: { id } }); return NextResponse.json({ ok: true }); }
  catch (error) { return apiError(error); }
}
