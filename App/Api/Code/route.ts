import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const { userId, password, isLogin } = await req.json();
  const filePath = path.join(process.cwd(), 'data.json');
  const db = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (isLogin) {
    // LOGIN MODE
    if (!db[userId]) return NextResponse.json({ error: 'User ID not found' }, { status: 404 });
    if (db[userId].password !== password) return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
    return NextResponse.json({ userId });
  } else {
    // JOIN MODE
    if (db[userId]) return NextResponse.json({ error: 'That ID is already taken!' }, { status: 400 });
    if (password.length < 4) return NextResponse.json({ error: 'Password must be 4+ characters' }, { status: 400 });

    db[userId] = { password: password, checkins: [] };
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    return NextResponse.json({ userId });
  }
}
