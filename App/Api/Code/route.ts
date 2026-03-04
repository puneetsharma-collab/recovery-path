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

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST() {
  const db = await readDB();

  let code;
  do {
    code = generateCode();
  } while (db.users.find((u: any) => u.code === code));

  db.users.push({
    code,
    checkins: []
  });

  await writeDB(db);

  return NextResponse.json({ code });
}
