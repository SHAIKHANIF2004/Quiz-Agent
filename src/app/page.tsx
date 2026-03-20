"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ArrowRight, BrainCircuit, Sparkles, Loader2 } from "lucide-react";
import QuizView from "@/components/quiz-view";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizData, setQuizData] = useState<any[] | null>(null);

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty: "medium", numQuestions: 10 }),
      });
      const data = await res.json();
      if (data.success && data.quiz) {
        setQuizData(data.quiz);
      } else {
        alert(data.error || "Failed to generate quiz.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AuroraBackground>
      <div className="w-full max-w-5xl mx-auto px-4 z-10 py-12 flex flex-col min-h-screen justify-center">
        {!quizData ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center gap-8 w-full"
          >
            <div className="flex items-center gap-3">
              <BrainCircuit className="w-12 h-12 md:w-16 md:h-16 text-indigo-500 animate-pulse" />
              <div className="text-5xl md:text-7xl font-black dark:text-white text-center tracking-tighter">
                Quiz Agent
              </div>
            </div>

            <div className="font-light text-xl md:text-3xl dark:text-neutral-300 text-center max-w-2xl px-4">
              Supercharge your learning with{" "}
              <span className="text-indigo-500 dark:text-indigo-400 font-semibold italic">
                AI-powered
              </span>{" "}
              adaptive quizzes.
            </div>

            <form
              onSubmit={handleStartQuiz}
              className="w-full max-w-xl mt-8 flex flex-col items-center gap-6 px-4"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic (e.g. Quantum Physics, History of Rome)"
                  className="w-full px-6 py-5 text-lg rounded-full border-2 border-indigo-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md focus:border-indigo-500 focus:outline-none focus:ring-4 ring-indigo-500/20 text-slate-800 dark:text-white placeholder:text-slate-500 shadow-2xl transition-all"
                  required
                />
                <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-indigo-400 w-6 h-6 animate-pulse" />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="group relative bg-slate-900 dark:bg-white rounded-full w-full md:w-auto text-white dark:text-black px-10 py-5 font-bold text-lg hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 transition-all flex items-center justify-center gap-3 overflow-hidden shadow-2xl"
              >
                <span className="relative z-10 text-white dark:text-black">
                  {isGenerating ? "Generating Magic..." : "Generate Quiz"}
                </span>
                {isGenerating ? (
                  <Loader2 className="w-6 h-6 animate-spin relative z-10 text-white dark:text-black" />
                ) : (
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10 text-white dark:text-black" />
                )}
                {!isGenerating && (
                  <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <QuizView
            topic={topic}
            initialQuestions={quizData}
            onRestart={() => {
              setQuizData(null);
              setTopic("");
            }}
          />
        )}
      </div>
    </AuroraBackground>
  );
}
