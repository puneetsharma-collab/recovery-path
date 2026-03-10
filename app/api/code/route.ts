import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type AvatarStage =
  | 'drowsy'
  | 'waking'
  | 'steady'
  | 'strong'
  | 'radiant'
  | 'fit';

interface UserData {
  password: string;
  checkins: string[];
  slips: string[];
  freezesUsed: string[];
  missedDays: string[];
  diaryEntries: {
    date: string;
    resistanceLevel: number;
    notes: string;
  }[];
  currentStreak: number;
  freezePoints: number;
  currentLevel: 1 | 2;
  currentPathDay: number;
  shrineVisits: number;
  totalStrongDays: number;
  completedJourney: boolean;
  avatarStage: AvatarStage;
  lastActionDate: string | null;
}

function getFilePath() {
  return path.join(process.cwd(), 'data.json');
}

function ensureDbFile() {
  const filePath = getFilePath();

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
  }

  return filePath;
}

function readDb(): Record<string, UserData> {
  const filePath = ensureDbFile();
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw || '{}');
}

function writeDb(db: Record<string, UserData>) {
  fs.writeFileSync(getFilePath(), JSON.stringify(db, null, 2));
}

function createNewUser(password: string): UserData {
  return {
    password,
    checkins: [],
    slips: [],
    freezesUsed: [],
    missedDays: [],
    diaryEntries: [],
    currentStreak: 0,
    freezePoints: 0,
    currentLevel: 1,
    currentPathDay: 0,
    shrineVisits: 0,
    totalStrongDays: 0,
    completedJourney: false,
    avatarStage: 'drowsy',
    lastActionDate: null,
  };
}

export async function POST(req: Request) {
  const { userId, password, isLogin } = await req.json();

  if (!userId || !password) {
    return NextResponse.json(
      { error: 'User ID and password are required' },
      { status: 400 }
    );
  }

  const cleanUserId = String(userId).trim().toLowerCase();
  const cleanPassword = String(password).trim();

  if (cleanUserId.length < 3) {
    return NextResponse.json(
      { error: 'User ID must be at least 3 characters' },
      { status: 400 }
    );
  }

  if (cleanPassword.length < 4) {
    return NextResponse.json(
      { error: 'Password must be at least 4 characters' },
      { status: 400 }
    );
  }

  const db = readDb();

  if (isLogin) {
    if (!db[cleanUserId]) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 404 }
      );
    }

    if (db[cleanUserId].password !== cleanPassword) {
      return NextResponse.json(
        { error: 'Wrong password' },
        { status: 401 }
      );
    }

    return NextResponse.json({ userId: cleanUserId });
  }

  if (db[cleanUserId]) {
    return NextResponse.json(
      { error: 'That ID is already taken' },
      { status: 400 }
    );
  }

  db[cleanUserId] = createNewUser(cleanPassword);
  writeDb(db);

  return NextResponse.json({ userId: cleanUserId });
}
