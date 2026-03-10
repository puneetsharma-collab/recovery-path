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

interface DiaryEntry {
  date: string;
  resistanceLevel: number;
  notes: string;
}

interface UserData {
  password?: string;
  checkins: string[];
  slips: string[];
  freezesUsed: string[];
  missedDays: string[];
  diaryEntries: DiaryEntry[];
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

function todayString() {
  return new Date().toISOString().split('T')[0];
}

function getFilePath() {
  return path.join(process.cwd(), 'data.json');
}

function readDb() {
  const filePath = getFilePath();

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw || '{}');
}

function writeDb(db: Record<string, UserData>) {
  fs.writeFileSync(getFilePath(), JSON.stringify(db, null, 2));
}

function uniqueDates(arr: string[]) {
  return Array.from(new Set(arr)).sort();
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function getDatesBetween(startExclusive: string, endExclusive: string) {
  const dates: string[] = [];
  let cursor = addDays(startExclusive, 1);

  while (cursor < endExclusive) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return dates;
}

function calculateLegacyStreak(checkins: string[], freezesUsed: string[] = []) {
  if (!checkins.length && !freezesUsed.length) return 0;

  let streak = 0;
  let cursor = todayString();

  for (let i = 0; i < 365; i++) {
    if (checkins.includes(cursor)) {
      streak += 1;
    } else if (freezesUsed.includes(cursor)) {
      // protected missed day, streak continues but does not increase
    } else {
      break;
    }
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function getAvatarStage(level: 1 | 2, day: number, completedJourney: boolean): AvatarStage {
  if (completedJourney) return 'fit';

  if (level === 1) {
    if (day <= 1) return 'drowsy';
    if (day <= 3) return 'waking';
    if (day <= 6) return 'steady';
    return 'strong';
  }

  if (day <= 2) return 'strong';
  if (day <= 5) return 'radiant';
  return 'fit';
}

function normalizeUser(raw: any): UserData {
  const checkins = uniqueDates(raw?.checkins || []);
  const freezesUsed = uniqueDates(raw?.freezesUsed || []);
  const slips = uniqueDates(raw?.slips || []);
  const diaryEntries = Array.isArray(raw?.diaryEntries) ? raw.diaryEntries : [];
  const legacyStreak = calculateLegacyStreak(checkins, freezesUsed);

  const inferredLevel: 1 | 2 = raw?.currentLevel
    ? raw.currentLevel
    : legacyStreak > 7
      ? 2
      : 1;

  const inferredPathDay =
    typeof raw?.currentPathDay === 'number'
      ? raw.currentPathDay
      : legacyStreak === 0
        ? 0
        : legacyStreak > 7
          ? Math.min(7, legacyStreak - 7)
          : Math.min(7, legacyStreak);

  const completedJourney =
    typeof raw?.completedJourney === 'boolean'
      ? raw.completedJourney
      : legacyStreak >= 14;

  const avatarStage: AvatarStage =
    raw?.avatarStage || getAvatarStage(inferredLevel, inferredPathDay, completedJourney);

  return {
    password: raw?.password,
    checkins,
    slips,
    freezesUsed,
    missedDays: uniqueDates(raw?.missedDays || []),
    diaryEntries,
    currentStreak:
      typeof raw?.currentStreak === 'number' ? raw.currentStreak : legacyStreak,
    freezePoints:
      typeof raw?.freezePoints === 'number'
        ? raw.freezePoints
        : legacyStreak >= 3
          ? 1
          : 0,
    currentLevel: inferredLevel,
    currentPathDay: inferredPathDay,
    shrineVisits:
      typeof raw?.shrineVisits === 'number'
        ? raw.shrineVisits
        : legacyStreak >= 14
          ? 2
          : legacyStreak >= 7
            ? 1
            : 0,
    totalStrongDays:
      typeof raw?.totalStrongDays === 'number'
        ? raw.totalStrongDays
        : checkins.length,
    completedJourney,
    avatarStage,
    lastActionDate: raw?.lastActionDate || null,
  };
}

function resetCurrentRun(user: UserData) {
  user.currentStreak = 0;
  user.currentPathDay = 0;
}

function moveToNextLevelIfNeeded(user: UserData) {
  if (user.currentLevel === 1 && user.currentPathDay === 7) {
    user.currentLevel = 2;
    user.currentPathDay = 0;
    user.freezePoints = 0;
  }
}

function reconcileMissedDays(user: UserData, today: string) {
  if (!user.lastActionDate) return;

  const missingDates = getDatesBetween(user.lastActionDate, today);

  for (const missedDate of missingDates) {
    if (user.freezePoints > 0) {
      user.freezePoints -= 1;
      if (!user.freezesUsed.includes(missedDate)) {
        user.freezesUsed.push(missedDate);
      }
    } else {
      if (!user.missedDays.includes(missedDate)) {
        user.missedDays.push(missedDate);
      }
      if (!user.slips.includes(missedDate)) {
        user.slips.push(missedDate);
      }
      resetCurrentRun(user);
    }

    user.lastActionDate = missedDate;
  }
}

function buildResponse(user: UserData) {
  const checkpointReached = user.currentPathDay >= 3;
  const shrineReached = user.currentPathDay >= 7;

  user.avatarStage = getAvatarStage(
    user.currentLevel,
    user.currentPathDay,
    user.completedJourney
  );

  return {
    ...user,
    streak: user.currentStreak,
    freezes: user.freezePoints,
    level: user.currentLevel,
    levelDay: user.currentPathDay,
    checkpointReached,
    shrineReached,
    totalSteps: user.totalStrongDays,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing user code' }, { status: 400 });
  }

  const db = readDb();

  if (!db[code]) {
    return NextResponse.json({
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
      streak: 0,
      freezes: 0,
      level: 1,
      levelDay: 0,
      checkpointReached: false,
      shrineReached: false,
      totalSteps: 0,
    });
  }

  const user = normalizeUser(db[code]);
  reconcileMissedDays(user, todayString());
  db[code] = user;
  writeDb(db);

  return NextResponse.json(buildResponse(user));
}

export async function POST(req: Request) {
  const { code, action, resistanceLevel, notes } = await req.json();

  if (!code || !action) {
    return NextResponse.json({ error: 'Missing code or action' }, { status: 400 });
  }

  const db = readDb();
  const existing = db[code] || {};
  const user = normalizeUser(existing);
  const today = todayString();

  reconcileMissedDays(user, today);

  if (action === 'strong') {
    moveToNextLevelIfNeeded(user);

    user.slips = user.slips.filter((d) => d !== today);
    user.missedDays = user.missedDays.filter((d) => d !== today);
    user.freezesUsed = user.freezesUsed.filter((d) => d !== today);

    const alreadyCheckedInToday = user.checkins.includes(today);

    if (!alreadyCheckedInToday) {
      user.checkins.push(today);
      user.checkins = uniqueDates(user.checkins);

      user.currentStreak += 1;
      user.totalStrongDays += 1;

      if (user.currentPathDay < 7) {
        user.currentPathDay += 1;
      }

      if (user.currentPathDay === 3 && user.freezePoints < 1) {
        user.freezePoints = 1;
      }

      if (user.currentPathDay === 7) {
        user.shrineVisits += 1;

        if (user.currentLevel === 2) {
          user.completedJourney = true;
        }
      }
    }

    user.diaryEntries = user.diaryEntries.filter((entry) => entry.date !== today);
    user.diaryEntries.push({
      date: today,
      resistanceLevel:
        typeof resistanceLevel === 'number' ? resistanceLevel : 0,
      notes: typeof notes === 'string' ? notes : '',
    });

    user.lastActionDate = today;
  } else if (action === 'slip') {
    user.checkins = user.checkins.filter((d) => d !== today);
    user.freezesUsed = user.freezesUsed.filter((d) => d !== today);

    if (!user.slips.includes(today)) {
      user.slips.push(today);
    }

    resetCurrentRun(user);
    user.lastActionDate = today;
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  user.avatarStage = getAvatarStage(
    user.currentLevel,
    user.currentPathDay,
    user.completedJourney
  );

  db[code] = user;
  writeDb(db);

  return NextResponse.json(buildResponse(user));
}
