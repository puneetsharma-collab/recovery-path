import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data.json');

async function readDB() {
  const raw = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeDB(db: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

function today() {
  return new Date().toISOString().split('T')[0];
}

export async function POST(req: Request) {
  const { code } = await req.json();
  const db = await readDB();

  const user = db.users.find((u: any) => u.code === code);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const t = today();
  if (!user.checkins.includes(t)) {
    user.checkins.push(t);
  }

  await writeDB(db);

  return NextResponse.json({ success: true, checkins: user.checkins });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  const db = await readDB();
  const user = db.users.find((u: any) => u.code === code);

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ checkins: user.checkins });
}
