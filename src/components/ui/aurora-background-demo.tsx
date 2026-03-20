"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";

import { ArrowRight, BrainCircuit } from "lucide-react";

export default function AuroraBackgroundDemo() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-6 items-center justify-center px-4"
      >
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-10 h-10 md:w-16 md:h-16 text-indigo-500 animate-pulse" />
          <div className="text-4xl md:text-8xl font-black dark:text-white text-center tracking-tighter">
            Quiz Agent
          </div>
        </div>
        <div className="font-light text-lg md:text-3xl dark:text-neutral-300 py-2 max-w-2xl text-center">
          Supercharge your learning with <span className="text-indigo-400 font-semibold italic">AI-powered</span> adaptive quizzes generated from your materials.
        </div>
        <button className="group relative bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-8 py-4 font-bold text-lg hover:scale-105 transition-all flex items-center gap-2 overflow-hidden">
          <span className="relative z-10 text-white dark:text-black">Start Quiz Now</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10 text-white dark:text-black" />
          <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
        </button>
      </motion.div>
    </AuroraBackground>
  );
}
