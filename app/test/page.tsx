'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const questions = [
  {
    id: 1,
    text: "How often do you find yourself thinking about the addiction throughout the day?",
    options: ["Rarely", "Occasionally", "Frequently", "Constantly"],
    scores: [0, 10, 20, 30]
  },
  {
    id: 2,
    text: "Have you tried to quit or cut down but failed?",
    options: ["Never", "Once or twice", "Multiple times", "I've lost count"],
    scores: [0, 10, 20, 30]
  },
  {
    id: 3,
    text: "Do you find yourself needing more 'intensity' or time to get the same satisfaction?",
    options: ["No", "Slightly", "Significantly", "Absolutely"],
    scores: [0, 10, 20, 30]
  },
  {
    id: 4,
    text: "Does it interfere with your work, studies, or relationships?",
    options: ["Not at all", "Occasionally", "Often", "Severely"],
    scores: [0, 10, 20, 30]
  },
  {
    id: 5,
    text: "Do you use it to escape from stress, sadness, or loneliness?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
    scores: [0, 10, 20, 30]
  }
];

export default function AddictionTest() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('recovery_user_id');
    const savedPass = localStorage.getItem('recovery_password');
    if (savedId && savedPass) {
      setIsAuthorized(true);
    } else {
      window.location.href = '/';
    }
  }, []);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateResult = () => {
    const totalScore = answers.reduce((a, b) => a + b, 0);
    const maxScore = questions.length * 30;
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    let level = "Low";
    let color = "text-emerald-500";
    if (percentage > 70) {
      level = "Severe";
      color = "text-rose-600";
    } else if (percentage > 40) {
      level = "Moderate";
      color = "text-orange-500";
    }

    return { percentage, level, color };
  };

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-blue-200 rounded-full"></div>
          <p className="text-slate-400 font-bold animate-bounce">Resuming Session...</p>
        </div>
      </main>
    );
  }

  if (showResult) {
    const { percentage, level, color } = calculateResult();
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-xl p-10 text-center space-y-8">
          <h1 className="text-3xl font-black text-slate-900">Your Results</h1>
          <div className="space-y-2">
            <div className={`text-6xl font-black ${color}`}>{percentage}%</div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Dependency Level: {level}</p>
          </div>
          
          <div className="bg-slate-50 rounded-3xl p-6 text-left space-y-4">
            <h3 className="font-bold text-slate-800">Statistics Breakdown</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Psychological Impact</span>
                <span className="font-bold">{Math.min(100, percentage + 5)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Behavioral Habit Strength</span>
                <span className="font-bold">{percentage}%</span>
              </div>
              <div className="flex justify-between">
                <span>Recovery Readiness</span>
                <span className="font-bold">{100 - percentage}%</span>
              </div>
            </div>
          </div>

          <Link href="/">
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all">
              Back to Home
            </button>
          </Link>
        </div>
      </main>
    );
  }

  const question = questions[currentStep];

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-xl p-10 space-y-8">
        <div className="space-y-2">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">Question {currentStep + 1} of {questions.length}</div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">{question.text}</h2>
        </div>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(question.scores[idx])}
              className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-slate-700"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
