'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ClipboardList,
  ChevronRight,
  ShieldCheck,
  Brain,
  Sparkles,
} from 'lucide-react';

const questions = [
  {
    id: 1,
    text: 'How strong were your urges this week?',
    options: [
      { label: 'Very mild', score: 0 },
      { label: 'Manageable', score: 1 },
      { label: 'Strong', score: 2 },
      { label: 'Overwhelming', score: 3 },
    ],
  },
  {
    id: 2,
    text: 'How often did you pause before acting on an urge?',
    options: [
      { label: 'Almost always', score: 0 },
      { label: 'Often', score: 1 },
      { label: 'Sometimes', score: 2 },
      { label: 'Almost never', score: 3 },
    ],
  },
  {
    id: 3,
    text: 'How consistent were you with your daily check-ins?',
    options: [
      { label: 'Very consistent', score: 0 },
      { label: 'Mostly consistent', score: 1 },
      { label: 'Off and on', score: 2 },
      { label: 'Barely consistent', score: 3 },
    ],
  },
  {
    id: 4,
    text: 'How quickly did you recover after difficult moments?',
    options: [
      { label: 'Very quickly', score: 0 },
      { label: 'Reasonably quickly', score: 1 },
      { label: 'Slowly', score: 2 },
      { label: 'I stayed stuck', score: 3 },
    ],
  },
  {
    id: 5,
    text: 'How hopeful do you feel about your recovery right now?',
    options: [
      { label: 'Very hopeful', score: 0 },
      { label: 'Cautiously hopeful', score: 1 },
      { label: 'Uncertain', score: 2 },
      { label: 'Discouraged', score: 3 },
    ],
  },
];

type ResultBand = {
  title: string;
  tone: string;
  badgeClass: string;
  desc: string;
  tip: string;
};

function getResult(totalScore: number): ResultBand {
  if (totalScore <= 4) {
    return {
      title: 'Strong and Steady',
      tone: 'You are building real control day by day.',
      badgeClass: 'bg-emerald-100 text-emerald-700',
      desc: 'Your habits are becoming more intentional, and your responses look grounded.',
      tip: 'Keep protecting your routine and do not get overconfident.',
    };
  }

  if (totalScore <= 9) {
    return {
      title: 'Recovering Well',
      tone: 'You are making progress, but you still need structure.',
      badgeClass: 'bg-amber-100 text-amber-700',
      desc: 'There is visible growth here, though some situations are still shaky.',
      tip: 'Use your check-ins more consistently and lean on the urge rescue screen earlier.',
    };
  }

  return {
    title: 'Needs Extra Support',
    tone: 'This week looked heavy, but it is still workable.',
    badgeClass: 'bg-rose-100 text-rose-700',
    desc: 'Your recovery system needs tightening, not abandonment.',
    tip: 'Simplify the process: daily honesty, fewer triggers, faster recovery after slips.',
  };
}

export default function TrialsPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('recovery_user_id');
    const savedPass = localStorage.getItem('recovery_password');

    if (savedId && savedPass) {
      setIsAuthorized(true);
    } else {
      window.location.href = '/';
    }
  }, []);

  const totalScore = useMemo(
    () => answers.reduce((sum, val) => sum + val, 0),
    [answers]
  );

  const result = useMemo(() => getResult(totalScore), [totalScore]);

  function handleAnswer(score: number) {
    const updated = [...answers, score];
    setAnswers(updated);

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  }

  function restartAssessment() {
    setCurrentStep(0);
    setAnswers([]);
    setFinished(false);
  }

  if (!isAuthorized) return null;

  if (finished) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#EEF8FB] via-[#FFF9EF] to-[#FFF4E7] p-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <Link
            href="/"
            className="w-11 h-11 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-500"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="bg-white rounded-[36px] border border-slate-100 shadow-xl p-6 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-500 flex items-center justify-center mx-auto">
                <ClipboardList size={34} />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-700">
                Weekly reflection
              </p>

              <h1 className="text-3xl font-black text-slate-900">
                Your recovery snapshot
              </h1>

              <p className="text-slate-600">
                This is not a verdict. It is just feedback for your next week.
              </p>
            </div>

            <div className="bg-[#FFF9EC] border border-amber-100 rounded-[28px] p-5 space-y-4">
              <div className="text-center">
                <span className={`inline-flex px-4 py-2 rounded-full text-sm font-black ${result.badgeClass}`}>
                  {result.title}
                </span>
              </div>

              <div className="text-center space-y-2">
                <p className="text-lg font-black text-slate-900">{result.tone}</p>
                <p className="text-sm text-slate-600">{result.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Score
                  </p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {totalScore}/15
                  </p>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Questions
                  </p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {questions.length}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">
                  Best next move
                </p>
                <p className="text-sm font-semibold text-slate-700">{result.tip}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/" className="block">
                <button className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white py-5 rounded-[24px] font-black text-lg shadow-lg transition-all">
                  Return to Journey
                </button>
              </Link>

              <button
                onClick={restartAssessment}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-5 rounded-[24px] font-bold text-lg transition-all"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const question = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#EEF8FB] via-[#FFF9EF] to-[#FFF4E7] p-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-11 h-11 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-500"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm flex-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
              Reflection tool
            </p>
            <p className="text-sm font-black text-slate-900">
              Weekly recovery assessment
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[36px] border border-slate-100 shadow-xl p-6 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-cyan-100 text-cyan-600 flex items-center justify-center mx-auto">
              <Brain size={34} />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-700">
              Question {currentStep + 1} of {questions.length}
            </p>

            <h1 className="text-3xl font-black text-slate-900">
              Check your recovery pattern
            </h1>

            <p className="text-slate-600">
              Answer honestly. This works best when you do not try to impress yourself.
            </p>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-[#F8FBFD] border border-slate-100 rounded-[28px] p-5 text-center">
            <h2 className="text-2xl font-black text-slate-900 leading-snug">
              {question.text}
            </h2>
          </div>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option.score)}
                className="w-full bg-white hover:bg-amber-50 border border-slate-100 hover:border-amber-200 rounded-[24px] p-5 text-left transition-all flex items-center justify-between"
              >
                <span className="font-bold text-slate-800">{option.label}</span>
                <ChevronRight size={18} className="text-slate-300" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-2 text-emerald-500">
              <ShieldCheck size={18} />
            </div>
            <p className="text-xs font-bold text-slate-700 leading-snug">
              Honest input
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-2 text-amber-500">
              <Sparkles size={18} />
            </div>
            <p className="text-xs font-bold text-slate-700 leading-snug">
              Better feedback
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
