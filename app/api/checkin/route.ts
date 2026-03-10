import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper: Calculate consecutive streak
function calculateStreak(checkins: string[], freezesUsed: string[] = []): number {
  if (checkins.length === 0) return 0;

  const sorted = checkins.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = new Date().toISOString().split('T')[0];
  
  let streak = 0;
  let checkDate = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (sorted.includes(dateStr)) {
      streak++;
    } else if (freezesUsed.includes(dateStr)) {
      // Freeze was used on this day, so streak continues but doesn't increase
      // Do nothing, just skip
    } else {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

// Helper: Calculate freezes based on streak
function calculateFreezes(streak: number): number {
  if (streak >= 6) return 2;
  if (streak >= 3) return 1;
  return 0;
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
    return NextResponse.json({ checkins: [], slips: [], streak: 0, freezes: 0, freezesUsed: [], diaryEntries: [] });
  }

  const userData = db[code!];
  const freezesUsed = userData.freezesUsed || [];
  const streak = calculateStreak(userData.checkins || [], freezesUsed);
  const freezes = calculateFreezes(streak);

  return NextResponse.json({ ...userData, streak, freezes, freezesUsed });
}

// 2. THIS PART HANDLES SAVING A NEW "STAYED STRONG" OR "SLIP" DAY
export async function POST(req: Request) {
  const { code, action, resistanceLevel, notes } = await req.json(); // action: 'strong' | 'slip'
  const filePath = path.join(process.cwd(), 'data.json');

  const fileData = fs.readFileSync(filePath, 'utf8');
  const db = JSON.parse(fileData);

  if (!db[code]) {
    db[code] = { checkins: [], slips: [], freezesUsed: [], diaryEntries: [] };
  }
  if (!db[code].slips) db[code].slips = [];
  if (!db[code].freezesUsed) db[code].freezesUsed = [];
  if (!db[code].diaryEntries) db[code].diaryEntries = [];

  const today = new Date().toISOString().split('T')[0];

  if (action === 'strong') {
    // Remove from slips if present
    db[code].slips = db[code].slips.filter((d: string) => d !== today);
    // Remove from freezes used if present
    db[code].freezesUsed = db[code].freezesUsed.filter((d: string) => d !== today);
    if (!db[code].checkins.includes(today)) {
      db[code].checkins.push(today);
    }
    
    // Save diary entry if provided
    if (resistanceLevel !== undefined || notes) {
      // Remove any existing entry for today
      db[code].diaryEntries = db[code].diaryEntries.filter((d: any) => d.date !== today);
      // Add new entry
      db[code].diaryEntries.push({
        date: today,
        resistanceLevel: resistanceLevel || 0,
        notes: notes || ''
      });
    }
  } else if (action === 'slip') {
    // Remove from checkins if present
    db[code].checkins = db[code].checkins.filter((d: string) => d !== today);
    
    // Calculate current streak before slip
    const currentStreak = calculateStreak(db[code].checkins || [], db[code].freezesUsed || []);
    const earnedFreezes = calculateFreezes(currentStreak);
    const usedFreezes = (db[code].freezesUsed || []).length;
    const availableFreezes = earnedFreezes - usedFreezes;

    // If user has available freezes, use one instead of breaking streak
    if (availableFreezes > 0) {
      db[code].freezesUsed.push(today);
      // Streak continues because freeze protects it
    } else {
      // No freezes available, mark as slip
      if (!db[code].slips.includes(today)) {
        db[code].slips.push(today);
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
  const freezesUsed = db[code].freezesUsed || [];
  const streak = calculateStreak(db[code].checkins || [], freezesUsed);
  const freezes = calculateFreezes(streak);
  return NextResponse.json({ ...db[code], streak, freezes, freezesUsed });
}
