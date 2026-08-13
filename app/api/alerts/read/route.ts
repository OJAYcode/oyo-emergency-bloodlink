import { NextResponse } from "next/server";import { currentUser } from "@/lib/auth";import { markAlertsRead } from "@/lib/store";
export async function POST(req:Request){const u=await currentUser();if(u?.hospitalId)await markAlertsRead(u.hospitalId);return NextResponse.redirect(new URL('/alerts',req.url))}
