import { cookies } from "next/headers";
import { getStore } from "./store";
import type { User } from "./types";
import { scryptSync, timingSafeEqual } from "node:crypto";
const SESSION="bloodlink_session";
export async function currentUser():Promise<User|undefined>{ const id=(await cookies()).get(SESSION)?.value; if(!id)return; const store=await getStore();return store.users.find(u=>u.id===id&&u.active); }
export async function requireUser(){const user=await currentUser(); if(!user) throw new Error("UNAUTHENTICATED"); return user;}
export function sessionCookie(id:string){return {name:SESSION,value:id,options:{httpOnly:true,sameSite:"lax" as const,path:"/",maxAge:60*60*12}}}
export async function passwordMatches(password:string, passwordHash:string){ const [salt,key]=passwordHash.split(":"); if(!salt||!key)return false; const derived=scryptSync(password,salt,64).toString("hex"); return timingSafeEqual(Buffer.from(derived,"hex"),Buffer.from(key,"hex")); }
