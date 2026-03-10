'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scroll, Award, ShieldCheck, ChevronRight, History } from 'lucide-react';

const questions = [
  {
    id: 1,
    text: "How often has your mind wandered toward old shadows this week?",
    options: ["Rarely", "Occasionally", "Frequently", "Constantly"],
    scores: [0, 10, 20, 30]
  },
  {
    id: 2,
    text: "Have you faced trials of will and remained steady?",
    options: ["Always", "Most of the time", "Rarely", "I succumbed"],
    scores: [0, 10, 20, 30]
  },
  {
    id: 3,
    text: "Do you feel the weight of the journey becoming lighter?",
    options: ["Yes, much lighter", "A little lighter", "No change", "It feels heavier"],
    scores: [0, 10, 20, 30]
  },
  {
    id: 4,
    text: "Is your daily sadhana becoming a natural rhythm?",
    options: ["Completely", "Getting there", "Not yet", "I struggle with it"],
    scores: [0, 10, 20, 30]
  },
  {
    id: 5,
    text: "How clear is your vision of the Peak today?",
    options: ["Crystal clear", "A bit hazy", "Obscured", "I've lost sight"],
    scores: [0, 10, 20, 30]
  }
];

export default function TrialsPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('recovery_user_id');
    if (savedId) setIsAuthorized(true);
    else window.location.href = '/';
  }, []);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (currentStep < questions.length - 1) setCurrentStep(currentStep + 1);
    else setShowResult(true);
  };

  const getRank = () => {
    const totalScore = answers.reduce((a, b) => a + b, 0);
    const maxScore = questions.length * 30;
    const percentage = (totalScore / maxScore) * 100;
    
    if (percentage < 30) return { title: "Sage", color: "text-amber-700", desc: "Your will is like a mountain, immovable and serene." };
    if (percentage < 70) return { title: "Determined Pilgrim", color: "text-orange-700", desc: "You walk with purpose, overcoming the shadows of the path." };
    return { title: "Novice Traveler", color: "text-slate-700", desc: "The journey is new, but your heart is set on the Peak." };
  };

  if (!isAuthorized) return null;

  if (showResult) {
    const rank = getRank();
    return (
      <main className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#F5F5DC] rounded-sm shadow-2xl p-12 relative border-8 border-[#D2B48C] border-double animate-in zoom-in-95 duration-700">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-12 bg-[#8B4513] rounded-t-full shadow-lg"></div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-12 bg-[#8B4513] rounded-b-full shadow-lg"></div>
          
          <div className="text-center space-y-10">
            <div className="space-y-2">
              <Scroll size={48} className="mx-auto text-[#8B4513] opacity-40" />
              <h1 className="text-3xl font-serif font-black text-[#5D4037] uppercase tracking-widest">Trial of Will</h1>
              <div className="w-24 h-0.5 bg-[#8B4513]/20 mx-auto"></div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold text-[#8B4513] uppercase tracking-[0.3em]">Your Attained Rank</p>
              <div className={`text-4xl font-serif font-black ${rank.color} drop-shadow-sm`}>{rank.title}</div>
              <p className="text-[#5D4037] text-sm font-medium leading-relaxed italic px-4">"{rank.desc}"</p>
            </div>

            <Link href="/dashboard" className="block">
              <button className="w-full bg-[#8B4513] text-[#FDFCF0] py-4 rounded-sm font-serif font-bold uppercase tracking-widest hover:bg-[#5D4037] transition-all shadow-xl">
                Return to Path
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const q = questions[currentStep];

  return (
    <main className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#F5F5DC] rounded-sm shadow-2xl p-10 md:p-14 relative border-8 border-[#D2B48C] border-double animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-12">
          <div className="flex justify-between items-center border-b border-[#8B4513]/10 pb-6">
            <span className="text-[10px] font-serif font-bold text-[#8B4513] uppercase tracking-[0.2em]">Trial {currentStep + 1} of {questions.length}</span>
            <Scroll size={20} className="text-[#8B4513] opacity-30" />
          </div>
          
          <h2 className="text-2xl font-serif font-black text-[#5D4037] leading-tight text-center italic">"{q.text}"</h2>

          <div className="space-y-4">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(q.scores[idx])}
                className="w-full text-center p-5 border border-[#8B4513]/20 bg-[#FDFCF0]/50 hover:bg-[#FDFCF0] hover:border-[#8B4513]/40 transition-all font-serif font-bold text-[#5D4037] italic group relative overflow-hidden"
              >
                <span className="relative z-10">{opt}</span>
                <div className="absolute inset-0 bg-[#8B4513]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
