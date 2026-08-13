import { neon } from "@neondatabase/serverless";
import data from "@/data/sample-store.json";
import { randomBytes, scryptSync } from "node:crypto";

let bootstrapped = false;
const groups: Record<string,string> = { "A+":"A_POS","A-":"A_NEG","B+":"B_POS","B-":"B_NEG","AB+":"AB_POS","AB-":"AB_NEG","O+":"O_POS","O-":"O_NEG" };
const secure=(password:string)=>{const salt=randomBytes(16).toString("hex");return `${salt}:${scryptSync(password,salt,64).toString("hex")}`};

export async function ensureDemoDatabase() {
 if (bootstrapped) return;
 const url=process.env.POSTGRES_URL||process.env.DATABASE_URL;
 if(!url) throw new Error("Database is not configured.");
 const sql=neon(url);
 await sql`CREATE TABLE IF NOT EXISTS hospitals (id TEXT PRIMARY KEY,name TEXT NOT NULL,location TEXT NOT NULL,area TEXT NOT NULL,phone TEXT NOT NULL,email TEXT UNIQUE NOT NULL,type TEXT NOT NULL,active BOOLEAN NOT NULL DEFAULT true)`;
 await sql`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,role TEXT NOT NULL,hospital_id TEXT REFERENCES hospitals(id),active BOOLEAN NOT NULL DEFAULT true)`;
 await sql`CREATE TABLE IF NOT EXISTS blood_inventory (id TEXT PRIMARY KEY,hospital_id TEXT NOT NULL REFERENCES hospitals(id),blood_group TEXT NOT NULL,quantity INTEGER NOT NULL CHECK(quantity>=0),reserved INTEGER NOT NULL DEFAULT 0 CHECK(reserved>=0 AND reserved<=quantity),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),UNIQUE(hospital_id,blood_group))`;
 await sql`CREATE TABLE IF NOT EXISTS blood_requests (id TEXT PRIMARY KEY DEFAULT ('REQ-'||replace(to_char(NOW(),'YYYYMMDDHH24MISSMS'),'.','')||'-'||substr(md5(random()::text),1,5)),requesting_hospital_id TEXT NOT NULL REFERENCES hospitals(id),supplying_hospital_id TEXT REFERENCES hospitals(id),blood_group TEXT NOT NULL,quantity INTEGER NOT NULL CHECK(quantity>0),urgency TEXT NOT NULL,note TEXT NOT NULL,contact_person TEXT NOT NULL,contact_phone TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'PENDING',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
 await sql`CREATE TABLE IF NOT EXISTS alerts (id TEXT PRIMARY KEY DEFAULT ('AL-'||substr(md5(random()::text),1,12)),hospital_id TEXT NOT NULL REFERENCES hospitals(id),request_id TEXT NOT NULL REFERENCES blood_requests(id),read BOOLEAN NOT NULL DEFAULT false,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
 await sql`CREATE TABLE IF NOT EXISTS inventory_logs (id TEXT PRIMARY KEY DEFAULT ('LOG-'||substr(md5(random()::text),1,12)),action TEXT NOT NULL,detail TEXT NOT NULL,hospital_id TEXT REFERENCES hospitals(id),user_id TEXT REFERENCES users(id),object_id TEXT,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
 const existing=await sql`SELECT id FROM hospitals LIMIT 1`;
 if(!existing.length){
  for(const h of data.hospitals)await sql`INSERT INTO hospitals(id,name,location,area,phone,email,type,active) VALUES (${h.id},${h.name},${h.location},${h.area},${h.phone},${h.email},${h.type},${h.active}) ON CONFLICT(id) DO NOTHING`;
  for(const u of data.users)await sql`INSERT INTO users(id,name,email,password_hash,role,hospital_id,active) VALUES (${u.id},${u.name},${u.email},${secure(u.passwordHash)},${u.role},${u.hospitalId??null},${u.active}) ON CONFLICT(id) DO NOTHING`;
  for(const i of data.inventory)await sql`INSERT INTO blood_inventory(id,hospital_id,blood_group,quantity,reserved,updated_at) VALUES (${i.id},${i.hospitalId},${groups[i.bloodGroup]},${i.quantity},${i.reserved},${i.updatedAt}) ON CONFLICT(id) DO NOTHING`;
  for(const r of data.requests)await sql`INSERT INTO blood_requests(id,requesting_hospital_id,supplying_hospital_id,blood_group,quantity,urgency,note,contact_person,contact_phone,status,created_at,updated_at) VALUES (${r.id},${r.requestingHospitalId},${r.supplyingHospitalId??null},${groups[r.bloodGroup]},${r.quantity},${r.urgency},${r.note},${r.contactPerson},${r.contactPhone},${r.status},${r.createdAt},${r.updatedAt}) ON CONFLICT(id) DO NOTHING`;
  for(const a of data.alerts)await sql`INSERT INTO alerts(id,hospital_id,request_id,read,created_at) VALUES (${a.id},${a.hospitalId},${a.requestId},${a.read},${a.createdAt}) ON CONFLICT(id) DO NOTHING`;
  for(const l of data.logs)await sql`INSERT INTO inventory_logs(id,action,detail,hospital_id,user_id,object_id,created_at) VALUES (${l.id},${l.action},${l.detail},${l.hospitalId??null},${l.userId??null},${l.objectId??null},${l.createdAt}) ON CONFLICT(id) DO NOTHING`;
 }
 bootstrapped=true;
}
