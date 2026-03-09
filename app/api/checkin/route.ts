import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper: Calculate consecutive streak
function calculateStreak(checkins: string[]): number {
  if (checkins.length === 0) return 0;

  const sorted = checkins.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = new Date().toISOString().split('T')[0];
  
  let streak = 0;
  let checkDate = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (sorted.includes(dateStr)) {
      streak++;
    } else {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

// 1. THIS PART HANDLES LOADING YOUR PROGRESS
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const filePath = path.join(process.cwd(), 'data.json');

  const fileData = fs.readFileSync(filePath, 'utf8');
  const db = JSON.parse(fileData);

  // If the user doesn't exist yet, give them an empty list
  if (!db[code!]) {
    return NextResponse.json({ checkins: [], slips: [], streak: 0 });
  }

  const userData = db[code!];
  const streak = calculateStreak(userData.checkins || []);

  return NextResponse.json({ ...userData, streak });
}

// 2. THIS PART HANDLES SAVING A NEW "STAYED STRONG" OR "SLIP" DAY
export async function POST(req: Request) {
  const { code, action } = await req.json(); // action: 'strong' | 'slip'
  const filePath = path.join(process.cwd(), 'data.json');

  const fileData = fs.readFileSync(filePath, 'utf8');
  const db = JSON.parse(fileData);

  if (!db[code]) {
    db[code] = { checkins: [], slips: [] };
  }
  if (!db[code].slips) db[code].slips = [];

  const today = new Date().toISOString().split('T')[0];

  if (action === 'strong') {
    // Remove from slips if present
    db[code].slips = db[code].slips.filter((d: string) => d !== today);
    if (!db[code].checkins.includes(today)) {
      db[code].checkins.push(today);
    }
  } else if (action === 'slip') {
    // Remove from checkins if present
    db[code].checkins = db[code].checkins.filter((d: string) => d !== today);
    if (!db[code].slips.includes(today)) {
      db[code].slips.push(today);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
  const streak = calculateStreak(db[code].checkins || []);
  return NextResponse.json({ ...db[code], streak });
}
