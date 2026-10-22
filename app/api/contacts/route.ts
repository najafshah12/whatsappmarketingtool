import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api";
const schema = z.object({ name:z.string().trim().min(1).max(100), phone:z.string().trim().regex(/^\+?[1-9]\d{7,14}$/, "Enter a valid international phone number"), email:z.string().email().optional().or(z.literal("")), groupName:z.string().optional(), tags:z.array(z.string()).optional() });
export async function GET(req: Request) { try { const url = new URL(req.url); const q=url.searchParams.get("q")??""; const contacts=await prisma.contact.findMany({where:q?{OR:[{name:{contains:q,mode:"insensitive"}},{phone:{contains:q}},{email:{contains:q,mode:"insensitive"}}]}:{},orderBy:{createdAt:"desc"},take:200}); return NextResponse.json(contacts); } catch(e){return apiError(e);} }
export async function POST(req: Request) { try { const body=schema.parse(await req.json()); const contact=await prisma.contact.create({data:{...body,email:body.email||null}}); await prisma.auditLog.create({data:{action:"contact.created",entity:"contact",entityId:contact.id}}); return NextResponse.json(contact,{status:201}); } catch(e){ if(e instanceof z.ZodError) return NextResponse.json({error:e.issues[0]?.message??"Invalid contact"},{status:400}); return apiError(e); } }
