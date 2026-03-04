import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 1. THIS PART HANDLES LOADING YOUR PROGRESS
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const filePath = path.join(process.cwd(), 'data.json');

  const fileData = fs.readFileSync(filePath, 'utf8');
  const db = JSON.parse(fileData);

  // If the user doesn't exist yet, give them an empty list
  if (!db[code!]) {
    return NextResponse.json({ checkins: [] });
  }

  return NextResponse.json(db[code!]);
}

// 2. THIS PART HANDLES SAVING A NEW "STAYED STRONG" DAY
export async function POST(req: Request) {
  const { code } = await req.json();
  const filePath = path.join(process.cwd(), 'data.json');

  // Open the logbook
  const fileData = fs.readFileSync(filePath, 'utf8');
  const db = JSON.parse(fileData);

  // If this is a brand new user, create their spot in the book
  if (!db[code]) {
    db[code] = { checkins: [] };
  }

  // Get today's date (e.g., "2026-03-05")
  const today = new Date().toISOString().split('T')[0];

  // Only add the date if they haven't checked in already today
  if (!db[code].checkins.includes(today)) {
    db[code].checkins.push(today);
    // Save the logbook back to the disk
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
  }

  // Send back the updated list so the screen shows "1 Day", "2 Days", etc.
  return NextResponse.json(db[code]);
}
