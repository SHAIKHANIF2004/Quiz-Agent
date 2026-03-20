"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, BrainCircuit, RefreshCw } from "lucide-react";

interface Question {
  question: string;
  type: "mcq" | "boolean";
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizViewProps {
  topic: string;
  initialQuestions: Question[];
  onRestart: () => void;
}

export default function QuizView({ topic, initialQuestions, onRestart }: QuizViewProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState("medium");
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;

  const handleAnswerSelect = async (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) setScore((s) => s + 1);

    // Call evaluate API in background to adjust difficulty
    try {
      const res = await fetch("/api/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentDifficulty: difficulty, isCorrect, streak }),
      });
      const data = await res.json();
      if (data.success) {
        setDifficulty(data.difficulty);
        setStreak(data.streak);
      }
    } catch (e) {
      console.error("Failed to evaluate answer:", e);
    }
  };

  const handleNext = async () => {
    if (currentIndex === questions.length - 1) {
      // Finished
      setCurrentIndex((curr) => curr + 1);
      return;
    }

    setIsLoadingNext(true);
    // Move to next question
    setCurrentIndex((curr) => curr + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsLoadingNext(false);
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center gap-6">
          <BrainCircuit className="w-20 h-20 text-indigo-500" />
          <h2 className="text-4xl font-black text-slate-800 dark:text-white">Quiz Completed!</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            You scored <span className="font-bold text-indigo-500 text-3xl">{score}</span> out of {questions.length} on the topic of "{topic}".
          </p>
          <button
            onClick={onRestart}
            className="mt-4 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg transition-colors flex items-center gap-2 shadow-xl"
          >
            <RefreshCw className="w-5 h-5" /> Let's try another topic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto relative z-10">
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-300 bg-white/30 dark:bg-black/30 px-4 py-2 rounded-full backdrop-blur-md">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <div className="flex gap-4 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white/30 dark:bg-black/30 px-4 py-2 rounded-full backdrop-blur-md">
          <span>Streak: {streak} 🔥</span>
          <span>
            Diff: <span className="capitalize text-indigo-600 dark:text-indigo-400">{difficulty}</span>
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-white/20 shadow-2xl"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-8 leading-tight">
            {currentQuestion.question}
          </h3>

          <div className="flex flex-col gap-4">
            {(currentQuestion.type === "mcq" ? currentQuestion.options! : ["True", "False"]).map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectTarget = option === currentQuestion.correctAnswer;

              let buttonStyle = "bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border-transparent text-left";
              if (isAnswered) {
                if (isCorrectTarget) {
                  buttonStyle = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200 text-left";
                } else if (isSelected) {
                  buttonStyle = "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200 text-left";
                } else {
                  buttonStyle = "bg-white/20 dark:bg-white/5 opacity-50 text-slate-500 border-transparent text-left";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className={`w-full p-4 md:p-6 rounded-2xl border-2 transition-all font-medium text-lg flex justify-between items-center ${buttonStyle}`}
                >
                  <span className="flex-1">{option}</span>
                  {isAnswered && isCorrectTarget && <CheckCircle2 className="w-7 h-7 text-green-500 flex-shrink-0 ml-4" />}
                  {isAnswered && isSelected && !isCorrectTarget && <XCircle className="w-7 h-7 text-red-500 flex-shrink-0 ml-4" />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-8 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/80 dark:bg-indigo-900/30 backdrop-blur-md overflow-hidden"
              >
                <div className="font-bold mb-2 text-indigo-800 dark:text-indigo-300 uppercase tracking-widest text-sm">Explanation</div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                  {currentQuestion.explanation}
                </p>
                <button
                  onClick={handleNext}
                  disabled={isLoadingNext}
                  className="mt-8 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  {isLoadingNext ? "Loading..." : "Next Question"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
