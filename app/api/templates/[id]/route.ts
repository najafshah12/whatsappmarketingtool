import { NextResponse } from "next/server"; import { prisma } from "@/lib/prisma"; import { apiError } from "@/lib/api";
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){try{const{id}=await params;const {status}=await req.json();if(!["draft","pending","approved","rejected"].includes(status))return NextResponse.json({error:"Invalid status"},{status:400});return NextResponse.json(await prisma.template.update({where:{id},data:{status}}))}catch(e){return apiError(e)}}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){try{const{id}=await params;await prisma.template.delete({where:{id}});return NextResponse.json({ok:true})}catch(e){return apiError(e)}}

