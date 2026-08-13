import { cookies } from "next/headers";
import { getStore } from "./store";
import type { User } from "./types";
const SESSION="bloodlink_session";
export async function currentUser():Promise<User|undefined>{ const id=(await cookies()).get(SESSION)?.value; if(!id)return; const store=await getStore();return store.users.find(u=>u.id===id&&u.active); }
export async function requireUser(){const user=await currentUser(); if(!user) throw new Error("UNAUTHENTICATED"); return user;}
export function sessionCookie(id:string){return {name:SESSION,value:id,options:{httpOnly:true,sameSite:"lax" as const,path:"/",maxAge:60*60*12}}}
