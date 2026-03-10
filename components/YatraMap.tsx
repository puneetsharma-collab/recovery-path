'use client';

import React from 'react';
import { 
  Compass, 
  Mountain, 
  Map as MapIcon, 
  Flag, 
  Sunrise, 
  Milestone, 
  Trophy 
} from 'lucide-react';

interface YatraMapProps {
  currentStreak: number;
}

const milestones = [
  { id: 1, name: 'Base Camp', day: 1, icon: Compass },
  { id: 2, name: 'Forest of Silence', day: 7, icon: Sunrise },
  { id: 3, name: 'Valley of Patience', day: 14, icon: Milestone },
  { id: 4, name: 'High Pass', day: 21, icon: Mountain },
  { id: 5, name: 'River of Reflection', day: 28, icon: MapIcon },
  { id: 6, name: 'Sanctuary of Peace', day: 35, icon: Flag },
  { id: 7, name: 'The Peak', day: 42, icon: Trophy },
];

export default function YatraMap({ currentStreak }: YatraMapProps) {
  return (
    <div className="bg-white rounded-[32px] shadow-lg shadow-gold/5 border border-slate-100 p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">The Sacred Path</h3>
        <div className="px-4 py-1 bg-saffron/10 rounded-full">
          <span className="text-xs font-bold text-saffron uppercase tracking-widest">
            Level {Math.floor(currentStreak / 7) + 1}
          </span>
        </div>
      </div>

      <div className="relative flex flex-col items-center">
        {/* The Path (Dotted Line) */}
        <div className="absolute top-0 bottom-0 w-0.5 border-l-2 border-dashed border-slate-200 left-1/2 -translate-x-1/2 z-0" />

        <div className="space-y-12 w-full relative z-10">
          {milestones.map((m, idx) => {
            const isUnlocked = currentStreak >= m.day;
            const isNext = !isUnlocked && (idx === 0 || currentStreak >= milestones[idx - 1].day);
            const Icon = m.icon;

            return (
              <div key={m.id} className="flex items-center gap-6 group">
                {/* Milestone Icon Container */}
                <div className="relative">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                    ${isUnlocked 
                      ? 'bg-saffron text-white shadow-lg shadow-saffron/20 scale-110' 
                      : isNext 
                        ? 'bg-white border-2 border-saffron text-saffron animate-pulse' 
                        : 'bg-slate-50 border-2 border-slate-100 text-slate-300'}
                  `}>
                    <Icon size={24} />
                  </div>
                  {isUnlocked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Milestone Info */}
                <div className="flex-1">
                  <h4 className={`font-black text-sm uppercase tracking-wide transition-colors ${isUnlocked ? 'text-slate-900' : 'text-slate-400'}`}>
                    {m.name}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {isUnlocked ? 'Reached' : `Unlocks at Day ${m.day}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
