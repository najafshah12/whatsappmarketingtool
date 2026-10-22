import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api";

type WebhookChange = { value?: { statuses?: any[]; messages?: any[]; contacts?: any[] } };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token && token === process.env.WA_WEBHOOK_VERIFY_TOKEN && challenge) return new Response(challenge, { status: 200 });
  return new Response("Webhook verification failed", { status: 403 });
}

export async function POST(req: Request) {
  const secret = process.env.WA_APP_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook signature secret is not configured" }, { status: 503 });
  const raw = await req.text();
  const supplied = req.headers.get("x-hub-signature-256") ?? "";
  const expected = "sha256=" + createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(supplied); const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });

  try {
    const body = JSON.parse(raw);
    const changes: WebhookChange[] = (body.entry ?? []).flatMap((entry: any) => (entry.changes ?? []));
    let received = 0;
    for (const change of changes) {
      const value = change.value ?? {};
      for (const status of value.statuses ?? []) {
        if (!status.id || !["sent", "delivered", "read", "failed"].includes(status.status)) continue;
        const record = await prisma.message.findFirst({ where: { providerId: status.id } });
        if (!record) continue;
        const timestamp = status.timestamp ? new Date(Number(status.timestamp) * 1000) : new Date();
        await prisma.$transaction([prisma.message.update({ where: { id: record.id }, data: { status: status.status, error: status.errors?.[0]?.title ?? null } }), prisma.messageEvent.create({ data: { messageId: record.id, status: status.status, timestamp, payload: status } })]);
        if (record.campaignId) {
          const counts = await prisma.message.groupBy({ by: ["status"], where: { campaignId: record.campaignId }, _count: { _all: true } });
          const values = Object.fromEntries(counts.map(row => [row.status, row._count._all]));
          await prisma.campaign.update({ where: { id: record.campaignId }, data: { delivered: (values.delivered ?? 0) + (values.read ?? 0), read: values.read ?? 0, failed: values.failed ?? 0 } });
        }
      }

      for (const incoming of value.messages ?? []) {
        if (!incoming.id || !incoming.from || await prisma.conversationMessage.findUnique({ where: { providerId: incoming.id }, select: { id: true } })) continue;
        const contactInfo = (value.contacts ?? []).find((contact: any) => contact.wa_id === incoming.from);
        const contact = await prisma.contact.upsert({ where: { phone: `+${incoming.from}` }, update: {}, create: { name: contactInfo?.profile?.name || `+${incoming.from}`, phone: `+${incoming.from}` } });
        const time = incoming.timestamp ? new Date(Number(incoming.timestamp) * 1000) : new Date();
        const bodyText = incoming.text?.body ?? incoming.button?.text ?? incoming.interactive?.button_reply?.title ?? incoming.interactive?.list_reply?.title ?? `[${incoming.type ?? "unsupported"} message]`;
        const conversation = await prisma.conversation.upsert({ where: { contactId: contact.id }, update: { lastMessageAt: time, unreadCount: { increment: 1 }, status: "open" }, create: { contactId: contact.id, lastMessageAt: time, unreadCount: 1 } });
        await prisma.conversationMessage.create({ data: { conversationId: conversation.id, direction: "inbound", body: bodyText, providerId: incoming.id, sentAt: time, status: "received" } });
        received++;
      }
    }
    return NextResponse.json({ received: true, inboundMessages: received });
  } catch (error) { if (error instanceof SyntaxError) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); return apiError(error); }
}
