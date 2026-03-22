"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { LogIn, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserButton() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn, openUserProfile } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded) {
    return (
      <div className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/20 dark:bg-white/10 animate-pulse" />
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50" ref={menuRef}>
      {isSignedIn && user ? (
        <>
          {/* Avatar button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-indigo-400/70 hover:ring-indigo-500 hover:scale-105 active:scale-95 transition-all shadow-lg"
            aria-label="User menu"
          >
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName ?? "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {(
                    user.firstName?.[0] ??
                    user.emailAddresses?.[0]?.emailAddress?.[0] ??
                    "U"
                  ).toUpperCase()}
                </span>
              </div>
            )}
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 rounded-2xl bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden"
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                    {user.fullName ?? "Quiz Agent User"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user.emailAddresses?.[0]?.emailAddress}
                  </p>
                </div>

                {/* Actions */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      openUserProfile();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Manage Account
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* Signed-out: minimal icon button */
        <button
          onClick={() => openSignIn()}
          className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 flex items-center justify-center shadow-lg hover:shadow-indigo-500/40 transition-all ring-2 ring-indigo-400/50"
          aria-label="Sign in"
        >
          <LogIn className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  );
}
