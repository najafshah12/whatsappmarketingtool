import { NextResponse } from "next/server"; import { prisma } from "@/lib/prisma"; import { apiError } from "@/lib/api";
export async function GET(){try{const [contacts,campaigns,messages,failed,recent]=await Promise.all([prisma.contact.count(),prisma.campaign.count(),prisma.message.count({where:{status:{in:["sent","delivered","read"]}}}),prisma.message.count({where:{status:"failed"}}),prisma.campaign.findMany({orderBy:{createdAt:"desc"},take:5})]);return NextResponse.json({contacts,campaigns,messages,failed,recent})}catch(e){return apiError(e)}}

