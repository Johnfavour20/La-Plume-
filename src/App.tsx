/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Feather,
  X,
  Check,
  Target,
  Zap,
  Lock,
  Trophy,
  Bot,
  Mic,
  Video,
  Award,
  UserPlus,
  BookOpen,
  TrendingUp,
  CheckCircle,
  Flame,
  Clock,
  Globe,
  HelpCircle,
  Send,
  Share2,
  Twitter,
  Instagram,
  Youtube,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Book,
  Menu,
  GraduationCap
} from "lucide-react";

// Types
interface PainPoint {
  title: string;
  desc: string;
}

interface SolutionFeature {
  icon: string;
  title: string;
  desc: string;
}

interface HowStep {
  number: string;
  icon: any;
  title: string;
  desc: string;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  country: string;
  xp: number;
  isCurrentUser?: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function App() {
  // --- STATE ---
  const [timeLeft, setTimeLeft] = useState({ days: 30, hours: 0, minutes: 0, seconds: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Gamification State
  const [xp, setXp] = useState(380);
  const [streak, setStreak] = useState(7);
  const [streakActiveDays, setStreakActiveDays] = useState([true, true, true, true, true, false, false]); // Mon-Sun
  const [isXpAnimating, setIsXpAnimating] = useState(false);
  const [unlockedBadges, setUnlockedBadges] = useState(["First Blitz"]);
  const [showBadgeNotification, setShowBadgeNotification] = useState<string | null>(null);

  // Le Blitz Stateful Question widget
  const [blitzOption, setBlitzOption] = useState<number | null>(null);
  const [blitzSubmitted, setBlitzSubmitted] = useState(false);
  const [blitzTimer, setBlitzTimer] = useState(15); // counts down from 15 in UI for micro-engagement
  const [blitzActive, setBlitzActive] = useState(true);

  // Registration Flow state
  const [regOpen, setRegOpen] = useState(false);
  const [regFormData, setRegFormData] = useState({
    name: "",
    email: "",
    country: "Nigeria 🇳🇬",
    examYear: "2026",
    phone: ""
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  // Leaderboard lists
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([
    { rank: 1, name: "Chidi Kalu", country: "Nigeria 🇳🇬", xp: 1450 },
    { rank: 2, name: "Ama Afriyie", country: "Ghana 🇬🇭", xp: 1320 },
    { rank: 3, name: "Kwame Boakye", country: "Ghana 🇬🇭", xp: 1280 },
    { rank: 4, name: "Funke Okeke", country: "Nigeria 🇳🇬", xp: 1190 },
    { rank: 5, name: "You", country: "Nigeria 🇳🇬", xp: 380, isCurrentUser: true }
  ]);

  // --- PERSISTENT COUNTDOWN TIMER ---
  useEffect(() => {
    let targetTime = localStorage.getItem("la_plume_target_time");
    if (!targetTime) {
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      const target = Date.now() + thirtyDaysInMs;
      localStorage.setItem("la_plume_target_time", target.toString());
      targetTime = target.toString();
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = parseInt(targetTime!) - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // --- STICKY NAV EVENT ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- MOCK LE BLITZ COUNTDOWN TIMER ---
  useEffect(() => {
    let tInterval: NodeJS.Timeout;
    if (blitzActive && !blitzSubmitted) {
      tInterval = setInterval(() => {
        setBlitzTimer((prev) => {
          if (prev <= 1) {
            return 15; // reset in loop for demo
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(tInterval);
  }, [blitzActive, blitzSubmitted]);

  // --- XP PROGRESS BAR MATH ---
  const level = Math.floor(xp / 200) + 1;
  const xpInCurrentLevel = xp % 200;
  const xpNeededForNextLevel = 200;
  const progressPercent = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

  // --- SOLVE PRACTICE QUESTION (INTEGRATED INTERACTIVITY) ---
  const handleSolvePractice = () => {
    if (xp >= 1000) return; // limit just for safety
    setIsXpAnimating(true);
    const bonus = 40;
    setXp((prev) => prev + bonus);
    
    // Update leaderboard
    setLeaderboard((prev) =>
      prev
        .map((u) => (u.isCurrentUser ? { ...u, xp: u.xp + bonus } : u))
        .sort((a, b) => b.xp - a.xp)
        .map((u, index) => ({ ...u, rank: index + 1 }))
    );

    // Simulate streak activation
    const updatedStreakDays = [...streakActiveDays];
    updatedStreakDays[5] = true; // Mark Saturday as active
    setStreakActiveDays(updatedStreakDays);
    setStreak(8);

    // Trigger badge unlock if not already
    if (!unlockedBadges.includes("Streak Master")) {
      setTimeout(() => {
        setUnlockedBadges((prev) => [...prev, "Streak Master"]);
        setShowBadgeNotification("Streak Master");
        setTimeout(() => setShowBadgeNotification(null), 4000);
      }, 800);
    }

    setTimeout(() => {
      setIsXpAnimating(false);
    }, 1000);
  };

  // --- LE BLITZ MOCK QUESTION SUBMIT ---
  const handleBlitzSubmit = () => {
    if (blitzOption === null) return;
    setBlitzSubmitted(true);
    setBlitzActive(false);

    if (blitzOption === 0) { // Option A is Subjonctif Présent (Correct)
      setIsXpAnimating(true);
      const bonus = 50;
      setXp((prev) => prev + bonus);

      // Update leaderboard
      setLeaderboard((prev) =>
        prev
          .map((u) => (u.isCurrentUser ? { ...u, xp: u.xp + bonus } : u))
          .sort((a, b) => b.xp - a.xp)
          .map((u, index) => ({ ...u, rank: index + 1 }))
      );

      // Unlock perfect mock badge
      if (!unlockedBadges.includes("Perfect Mock")) {
        setTimeout(() => {
          setUnlockedBadges((prev) => [...prev, "Perfect Mock"]);
          setShowBadgeNotification("Perfect Mock");
          setTimeout(() => setShowBadgeNotification(null), 4000);
        }, 800);
      }

      setTimeout(() => {
        setIsXpAnimating(false);
      }, 1000);
    }
  };

  // --- SUBMIT REGISTRATION ---
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFormData.name || !regFormData.email || !regFormData.phone) return;

    setIsRegistering(true);
    setTimeout(() => {
      // Create random ticket ID
      const rNum = Math.floor(1000 + Math.random() * 9000);
      setTicketNumber(`LP-CO1-${rNum}`);
      setIsRegistering(false);
      setIsRegistered(true);

      // Give registering bonus
      setXp((prev) => prev + 100);
    }, 1500);
  };

  // Reset Registration Flow
  const handleResetReg = () => {
    setRegFormData({
      name: "",
      email: "",
      country: "Nigeria 🇳🇬",
      examYear: "2026",
      phone: ""
    });
    setIsRegistered(false);
    setRegOpen(false);
  };

  // --- STATIC DATA ---
  const painPoints: PainPoint[] = [
    { title: "No structured study plan", desc: "Students try cramming years of syllabus in the last 48 hours without direction." },
    { title: "Past questions with no explanations", desc: "Standard books list correct letters (e.g. 'A') but never explain *why* it is right." },
    { title: "Zero oral and listening practice", desc: "WAEC requires oral expression, yet schools rarely provide mock audio exams." },
    { title: "Studying alone with no accountability", desc: "It's easy to lose motivation when you're the only one prepping in your circle." },
    { title: "Expensive tutors families can't afford", desc: "Private tutoring is locked behind hefty fees, shutting out thousands of bright students." },
    { title: "No way to track if you're actually improving", desc: "You go in blind, with no diagnostic scoring to point out your grammatical weaknesses." }
  ];

  const features: SolutionFeature[] = [
    { icon: "🎯", title: "30-Day Structured Bootcamp", desc: "A daily, step-by-step masterplan covering all WAEC themes from Grammar to Letter Writing." },
    { icon: "⚡", title: "Le Blitz — Timed Theory Challenges", desc: "11 intense questions in 15 minutes, training you to think fast and write flawlessly under pressure." },
    { icon: "🔒", title: "Friday Proctored Mock Exams", desc: "Simulate real exam halls with timed essays and strict score sheets sent to you." },
    { icon: "🏆", title: "Live National Leaderboard", desc: "Compete with peers across Nigeria, Ghana, and Anglophone Africa to climb the regional ranks." },
    { icon: "🤖", title: "AI-Powered Answer Validation", desc: "Instant feedback explaining your essay mistakes, verbs conjugation, and vocabulary missteps." },
    { icon: "🎙️", title: "Oral and Listening Practice", desc: "High-quality audio mocks and voice drills mimicking real WAEC oral assessment formats." },
    { icon: "🎥", title: "Expert Video Explanations", desc: "Walkthrough videos for every single tricky past question, recorded by master French teachers." },
    { icon: "📜", title: "Verified Completion Certificate", desc: "Earn a formal credential of French proficiency with a detailed sub-scores report upon finishing." }
  ];

  const howSteps: HowStep[] = [
    { number: "01", icon: UserPlus, title: "Register", desc: "Secure your spot in Cohort 1. Registration is completely free for basic level." },
    { number: "02", icon: BookOpen, title: "Learn", desc: "Complete daily bite-sized video exercises, oral drills, and essay modules." },
    { number: "03", icon: TrendingUp, title: "Compete", desc: "Fight through daily 'Le Blitz' and Friday mocks to push up the leaderboard." },
    { number: "04", icon: CheckCircle, title: "Conquer", desc: "Walk into the WAEC exam hall with absolute fluency, structural pride, and dominate." }
  ];

  const faqs: FAQItem[] = [
    {
      question: "Is La Plume free to join?",
      answer: "Yes! You can join the basic tier of Cohort 1 completely free, which gives you access to the entire Week 1 curriculum, basic quizzes, and our vibrant student community. To unlock the full 30-day curriculum, video lessons, expert feedback, mock exams, and certificates, you can upgrade to Premium at any time."
    },
    {
      question: "When does Cohort 1 start?",
      answer: "Cohort 1 kicks off exactly when our countdown ends! Once registered, you will receive prep modules to get ready. Materials open day-by-day to ensure everyone moves through the high-intensity syllabus together."
    },
    {
      question: "What exams does La Plume prepare me for?",
      answer: "La Plume is specifically engineered to prepare you for the WAEC (WASSCE) French examination, including both the Objective papers, the written Theory (Essays/Compositions/Letters/Translation), and the Oral listening/speaking tests."
    },
    {
      question: "Do I need to be online at specific times?",
      answer: "The daily video masterclasses and practices are pre-recorded so you can access them on your own schedule. However, 'Le Blitz' timed challenges happen at set intervals, and Friday Mock Exams are open on a strict, proctored window to simulate real conditions."
    },
    {
      question: "What if I miss a day of the bootcamp?",
      answer: "No worries! All lessons are archived on your student dashboard. You can easily catch up on missed modules. Keep in mind that maintaining your Daily Streak builds consistency, which is crucial for language retention!"
    },
    {
      question: "Is there a certificate at the end?",
      answer: "Yes, students who successfully complete at least 80% of the bootcamp curriculum and the final mock examinations earn a verified Certificate of Excellence in French WAEC Prep, with a detailed score breakdown perfect for college profiles."
    },
    {
      question: "Which African countries can join?",
      answer: "La Plume is built specifically for Anglophone West African countries offering the WAEC/WASSCE exams, which includes students across Nigeria, Ghana, Sierra Leone, Liberia, and the Gambia!"
    },
    {
      question: "How is La Plume different from past question booklets?",
      answer: "Standard question booklets only provide raw answer keys without context. La Plume offers structured daily progression, expert video breakdowns explaining grammatical rules, interactive listening/oral engines, and competitive gamification that keeps you practicing every single day."
    }
  ];

  const scrollFadeProps = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-text relative overflow-x-hidden">
      
      {/* BACKGROUND GRID (CUSTOM CSS IN index.css) */}
      <div className="absolute inset-0 hero-grid-bg opacity-40 pointer-events-none z-0" />
      
      {/* SHINY COLOURED GLOWS (No hardcoded colors, referencing CSS variables) */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[var(--color-primary)]/5 blur-[120px] pointer-events-none -translate-y-1/2 z-0" />
      <div className="absolute top-[20%] right-1/4 w-[300px] h-[300px] rounded-full bg-[var(--color-primary)]/5 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-1/5 w-[350px] h-[350px] rounded-full bg-[var(--color-primary)]/5 blur-[110px] pointer-events-none z-0" />

      {/* --- TOP BANNER --- */}
      <div className="relative z-50 bg-[var(--color-primary)]/10 border-b border-[var(--color-primary)]/20 py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-[var(--color-primary)]">
          <span className="animate-pulse">⚡</span>
          <span>Cohort 1 registration closes soon. Over 4,200 already joined. Secure your spot now!</span>
        </div>
      </div>

      {/* --- STICKY NAVBAR --- */}
      <nav
        id="navbar"
        className={`fixed top-10 left-0 right-0 z-40 transition-all duration-300 mx-auto max-w-6xl px-4 ${
          isScrolled 
            ? "translate-y-[-24px] bg-white/85 backdrop-blur-md py-3 border-b border-[var(--color-border)] shadow-md shadow-slate-200/50" 
            : "bg-transparent py-5 border-b border-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <div className="bg-[var(--color-primary)] p-2 rounded-lg text-[var(--color-bg)] group-hover:scale-105 transition-transform duration-300">
              <Feather className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-display font-bold text-xl md:text-2xl tracking-tight text-[var(--color-text-primary)]">
              La Plume
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-text-muted)]">
            <a href="#home" className="hover:text-[var(--color-text-primary)] transition-colors">Home</a>
            <a href="#how-it-works" className="hover:text-[var(--color-text-primary)] transition-colors">How It Works</a>
            <a href="#features" className="hover:text-[var(--color-text-primary)] transition-colors">Features</a>
            <a href="#pricing" className="hover:text-[var(--color-text-primary)] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[var(--color-text-primary)] transition-colors">FAQ</a>
          </div>

          {/* CTA Right */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setRegOpen(true)}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-bg)] font-bold px-6 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md shadow-[var(--color-primary)]/10 cursor-pointer text-sm"
            >
              Join Cohort 1
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors p-1"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 pt-4 border-t border-[var(--color-border)] flex flex-col gap-4 pb-4"
            >
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Home
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                How It Works
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Pricing
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                FAQ
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setRegOpen(true);
                }}
                className="bg-[var(--color-primary)] text-[var(--color-bg)] font-bold px-5 py-2.5 rounded-lg text-center text-sm"
              >
                Join Cohort 1
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <section
        id="home"
        className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center relative z-10 text-center"
      >
        {/* CSS LINE GRID BACKGROUND (Purely decorative overlay for safety) */}
        <div className="absolute inset-0 hero-grid-bg opacity-30 pointer-events-none" />

        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Announcement Banner Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 px-4 py-1.5 rounded-full mb-8"
          >
            <span className="text-[var(--color-primary)] text-xs md:text-sm font-semibold tracking-wide flex items-center gap-1.5 font-display">
              <span>⚡</span> Cohort 1 is now open. Limited spots available. Register today to secure your place.
            </span>
          </motion.div>

          {/* Bold Main Headline split across two lines */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-6xl md:text-8xl tracking-tight leading-none mb-6"
          >
            <span className="text-[var(--color-text-primary)] block">MASTER FRENCH.</span>
            <span className="text-[var(--color-primary)] block">DOMINATE WAEC.</span>
          </motion.h1>

          {/* Subheadline paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl leading-relaxed mb-10 font-sans px-2"
          >
            Join Africa's first French exam bootcamp. 30 days. One cohort. Thousands of students across Anglophone Africa. One goal — excellence.
          </motion.p>

          {/* Large Bold Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full sm:w-auto px-4"
          >
            <button
              onClick={() => setRegOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-bg)] font-bold text-base md:text-lg rounded-xl shadow-xl shadow-[var(--color-primary)]/10 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
            >
              Join Cohort 1 — Free
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[var(--color-border)] hover:border-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)]/5 text-[var(--color-text-primary)] font-bold text-base md:text-lg rounded-xl transition-all duration-300 text-center"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Globe Registered Stat */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[var(--color-text-muted)] text-sm md:text-base font-medium flex items-center gap-2 mb-16 bg-[var(--color-card)]/40 px-4 py-2 rounded-lg border border-[var(--color-border)]/50"
          >
            <span>🌍</span> <span><strong>4,200 students</strong> registered across 6 African countries</span>
          </motion.div>

          {/* COUNTDOWN TIMER */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="w-full max-w-xl mx-auto bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Top mini header */}
            <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-bold block mb-4 font-mono">
              Cohort 1 begins in:
            </span>

            {/* Timers Grid */}
            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-md mx-auto">
              <div className="flex flex-col items-center p-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
                <span className="font-display font-bold text-2xl md:text-4xl text-[var(--color-primary)]">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[10px] md:text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mt-1">Days</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
                <span className="font-display font-bold text-2xl md:text-4xl text-[var(--color-primary)]">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] md:text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mt-1">Hours</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
                <span className="font-display font-bold text-2xl md:text-4xl text-[var(--color-primary)]">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] md:text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mt-1">Mins</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
                <span className="font-display font-bold text-2xl md:text-4xl text-[var(--color-primary)]">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] md:text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mt-1">Secs</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- PROBLEM SECTION --- */}
      <motion.section
        {...scrollFadeProps}
        className="py-24 px-4 relative z-10 max-w-6xl mx-auto border-t border-[var(--color-border)]"
      >
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[var(--color-accent-red)] font-extrabold block mb-3 font-mono bg-[var(--color-accent-red)]/10 px-3 py-1.5 rounded-full w-max mx-auto">
            THE REALITY
          </span>
          <h2 className="font-display font-bold text-2xl md:text-4xl text-[var(--color-text-primary)] max-w-3xl mx-auto leading-snug">
            Most students fail WAEC French not because they're not smart — but because they never had the right preparation.
          </h2>
        </div>

        {/* 2x3 Grid of pain points */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {painPoints.map((item, index) => (
            <div
              key={index}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-accent-red)]/40 transition-all duration-300 flex items-start gap-4"
            >
              <div className="bg-[var(--color-accent-red)]/10 text-[var(--color-accent-red)] p-2 rounded-lg flex-shrink-0 mt-0.5">
                <X className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* --- SOLUTION SECTION --- */}
      <motion.section
        {...scrollFadeProps}
        id="features"
        className="py-24 px-4 relative z-10 max-w-6xl mx-auto border-t border-[var(--color-border)]"
      >
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-extrabold block mb-3 font-mono bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-full w-max mx-auto">
            THE LA PLUME DIFFERENCE
          </span>
          <h2 className="font-display font-bold text-2xl md:text-4xl text-[var(--color-text-primary)] max-w-3xl mx-auto leading-snug">
            Everything you need to walk into that exam hall ready.
          </h2>
        </div>

        {/* 4x2 grid of feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-primary)]/30 transition-all duration-300"
            >
              <span className="text-3xl block mb-4">{item.icon}</span>
              <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] font-sans leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* --- HOW IT WORKS --- */}
      <motion.section
        {...scrollFadeProps}
        id="how-it-works"
        className="py-24 px-4 relative z-10 max-w-6xl mx-auto border-t border-[var(--color-border)]"
      >
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-extrabold block mb-3 font-mono bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-full w-max mx-auto">
            YOUR JOURNEY
          </span>
          <h2 className="font-display font-bold text-2xl md:text-4xl text-[var(--color-text-primary)] max-w-3xl mx-auto leading-snug">
            Four steps to French excellence
          </h2>
        </div>

        {/* Horizontal rows connected by dotted line */}
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[2.25rem] left-[10%] right-[10%] h-0.5 border-t border-dashed border-[var(--color-border)] z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {howSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center group">
                  {/* Circle Container */}
                  <div className="w-16 h-16 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] group-hover:border-[var(--color-primary)] flex items-center justify-center relative mb-5 transition-all duration-300">
                    <StepIcon className="w-6 h-6 text-[var(--color-primary)]" />
                    
                    {/* Gold Badge Number */}
                    <span className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-[var(--color-bg)] font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] font-sans px-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* --- COHORT COUNTDOWN SECTION --- */}
      <motion.section
        {...scrollFadeProps}
        className="py-20 px-4 relative z-10 bg-[var(--color-card)] border-t border-b border-[var(--color-border)] text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-xl md:text-3xl text-[var(--color-primary)] uppercase tracking-widest mb-6 font-mono">
            Cohort 1 begins in:
          </h2>

          {/* Timers Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto mb-8">
            <div className="flex flex-col items-center p-3 sm:p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
              <span className="font-display font-bold text-xl sm:text-3xl text-[var(--color-primary)]">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mt-1">Days</span>
            </div>
            <div className="flex flex-col items-center p-3 sm:p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
              <span className="font-display font-bold text-xl sm:text-3xl text-[var(--color-primary)]">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mt-1">Hours</span>
            </div>
            <div className="flex flex-col items-center p-3 sm:p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
              <span className="font-display font-bold text-xl sm:text-3xl text-[var(--color-primary)]">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mt-1">Mins</span>
            </div>
            <div className="flex flex-col items-center p-3 sm:p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
              <span className="font-display font-bold text-xl sm:text-3xl text-[var(--color-primary)]">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mt-1">Secs</span>
            </div>
          </div>

          <p className="text-[var(--color-text-muted)] font-medium mb-8">
            🌍 4,200 students already registered
          </p>

          <button
            onClick={() => setRegOpen(true)}
            className="px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-bg)] font-bold text-base rounded-xl shadow-xl shadow-[var(--color-primary)]/10 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
          >
            Secure Your Spot Now
          </button>
        </div>
      </motion.section>

      {/* --- LE BLITZ SPOTLIGHT (INTERACTIVE WIDGET) --- */}
      <motion.section
        {...scrollFadeProps}
        className="py-24 px-4 relative z-10 max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Content Left */}
          <div>
            <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-extrabold block mb-3 font-mono bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-full w-max">
              FEATURE SPOTLIGHT
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-[var(--color-text-primary)] mb-6 leading-tight">
              Le Blitz. 11 questions. 15 minutes each. No mercy.
            </h2>
            <p className="text-sm md:text-base text-[var(--color-text-muted)] font-sans leading-relaxed mb-6">
              Language is built through rapid reflex. Le Blitz is our signature gamified module that tests your comprehension, grammar conjugation, and translation speed under strict conditions. 
            </p>
            <p className="text-sm md:text-base text-[var(--color-text-muted)] font-sans leading-relaxed mb-8">
              Every day at 4:00 PM, a new challenge launches. Answer fast, answer correctly, and climb the Leaderboard. Perfect scores feed your Daily Streak and unlock legendary achievement badges!
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">Real-time feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">Mock-exam simulation</span>
              </div>
            </div>
          </div>

          {/* Interactive Mock Exam UI Card Right */}
          <div className="relative">
            {/* Absolute badge overlay */}
            <div className="absolute -top-3 -right-3 bg-red-500 text-white font-mono text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider rotate-6 shadow-md z-20">
              Live Demo
            </div>

            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl relative z-10">
              {/* Card Header */}
              <div className="bg-[var(--color-bg)] px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-semibold">Le Blitz Quest</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-primary)]">
                  <Clock className="w-4 h-4 animate-spin-slow" />
                  <span className="font-mono text-sm font-bold">
                    {blitzSubmitted ? "00:00" : `00:${String(blitzTimer).padStart(2, "0")}`}
                  </span>
                </div>
              </div>

              {/* Progress Timer Bar */}
              <div className="w-full h-1.5 bg-[var(--color-border)]">
                <motion.div
                  className="h-full bg-gradient-to-right bg-[var(--color-primary)]"
                  style={{ width: blitzSubmitted ? "0%" : `${(blitzTimer / 15) * 100}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase font-mono text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded">
                    Question 03 of 11
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)] font-medium">Difficulty: Hard (WAEC standard)</span>
                </div>

                <p className="text-base font-display font-semibold text-[var(--color-text-primary)] mb-6 leading-relaxed">
                  Trouvez le mode correct du verbe souligné dans cette phrase : <br />
                  <span className="bg-[var(--color-border)] px-1.5 py-0.5 rounded text-[var(--color-primary)]">
                    &quot;Bien qu&#39;il <strong className="underline">soit</strong> fatigué, il a fini ses examens.&quot;
                  </span>
                </p>

                {/* Options list */}
                <div className="flex flex-col gap-3 mb-6">
                  {[
                    "A. Subjonctif Présent",
                    "B. Indicatif Présent",
                    "C. Conditionnel Présent",
                    "D. Subjonctif Imparfait"
                  ].map((option, idx) => {
                    const isSelected = blitzOption === idx;
                    const isCorrect = idx === 0;
                    return (
                      <button
                        key={idx}
                        disabled={blitzSubmitted}
                        onClick={() => setBlitzOption(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all duration-300 flex items-center justify-between ${
                          blitzSubmitted
                            ? isCorrect
                              ? "bg-green-50 border-green-500 text-green-700"
                              : isSelected
                                ? "bg-red-50 border-red-500 text-red-700"
                                : "bg-transparent border-[var(--color-border)] text-[var(--color-text-muted)]"
                            : isSelected
                              ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]"
                              : "bg-transparent border-[var(--color-border)] hover:bg-[var(--color-border)]/40 text-[var(--color-text-primary)]"
                        }`}
                      >
                        <span>{option}</span>
                        {blitzSubmitted && isCorrect && <Check className="w-4 h-4 text-green-400 flex-shrink-0" />}
                        {blitzSubmitted && isSelected && !isCorrect && <X className="w-4 h-4 text-red-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Submit/Feedback Area */}
                {!blitzSubmitted ? (
                  <button
                    onClick={handleBlitzSubmit}
                    disabled={blitzOption === null}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                      blitzOption !== null
                        ? "bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-hover)] cursor-pointer"
                        : "bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed"
                    }`}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border text-xs leading-relaxed ${
                      blitzOption === 0
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1 uppercase font-mono">
                      <span>{blitzOption === 0 ? "🎉 Correct! (+50 XP)" : "⚠️ Incorrect Response"}</span>
                    </div>
                    {blitzOption === 0 
                      ? "Conjunction 'bien que' (although) always triggers the subjunctive mood. 'Soit' is the subjonctif présent of 'être' for singular third person."
                      : "The conjunction 'bien que' (although) strictly governs the subjunctive mood. Therefore, the indicative mood is incorrect. The correct verb is 'soit' (A: Subjonctif Présent)."}
                    <button
                      onClick={() => {
                        setBlitzOption(null);
                        setBlitzSubmitted(false);
                        setBlitzTimer(15);
                        setBlitzActive(true);
                      }}
                      className="mt-3 block text-[var(--color-primary)] font-bold uppercase tracking-wider hover:underline"
                    >
                      Try Again
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

        </div>
      </motion.section>

      {/* --- XP AND GAMIFICATION SECTION (INTERACTIVE PREVIEW) --- */}
      <motion.section
        {...scrollFadeProps}
        className="py-24 px-4 relative z-10 max-w-6xl mx-auto border-t border-[var(--color-border)]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Dashboard Preview Card Left */}
          <div className="order-2 lg:order-1">
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl">
              
              {/* Dashboard Top Area */}
              <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg)]/50">
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--color-primary)] text-[var(--color-bg)] p-2 rounded-xl">
                    <GraduationCap className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-widest font-mono">Student Account</span>
                    <h3 className="font-display font-bold text-base text-[var(--color-text-primary)]">igboechejohn@gmail.com</h3>
                  </div>
                </div>
                
                {/* Streak Counter with Flame */}
                <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
                  <span className="font-mono font-bold text-sm text-amber-400">{streak} Days</span>
                </div>
              </div>

              {/* Dashboard Body */}
              <div className="p-6">
                
                {/* XP State Progress Indicator */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
                      Level {level} Elite Cadet <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                    </span>
                    <span className="font-mono text-xs text-[var(--color-text-muted)]">
                      <strong className="text-[var(--color-text-primary)]">{xpInCurrentLevel}</strong> / {xpNeededForNextLevel} XP
                    </span>
                  </div>
                  
                  {/* Progress Bar with React animation */}
                  <div className="w-full h-3 bg-[var(--color-bg)] rounded-full border border-[var(--color-border)] overflow-hidden">
                    <motion.div
                      className="h-full bg-[var(--color-primary)] rounded-full"
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                {/* Subcontent row */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  
                  {/* Achievement Badges */}
                  <div className="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)]">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-[var(--color-text-muted)] font-bold block mb-2">
                      Earned Badges
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      <div className="p-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full border border-[var(--color-primary)]/20" title="First Blitz completed">
                        <Zap className="w-4 h-4 fill-[var(--color-primary)]/20" />
                      </div>
                      {unlockedBadges.includes("Streak Master") && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="p-1.5 bg-orange-50 text-orange-600 rounded-full border border-orange-200"
                          title="Streak Master"
                        >
                          <Flame className="w-4 h-4 fill-orange-500/10" />
                        </motion.div>
                      )}
                      {unlockedBadges.includes("Perfect Mock") && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="p-1.5 bg-green-50 text-green-600 rounded-full border border-green-200"
                          title="Perfect Mock Score"
                        >
                          <Trophy className="w-4 h-4 fill-green-500/10" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Streak Calendar Tracker */}
                  <div className="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)]">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-[var(--color-text-muted)] font-bold block mb-2">
                      Weekly Streak
                    </span>
                    <div className="flex items-center justify-between gap-1">
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <span className="text-[9px] font-bold text-[var(--color-text-muted)] mb-1">{day}</span>
                          <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                              streakActiveDays[idx]
                                ? "bg-[var(--color-primary)]"
                                : "bg-[var(--color-border)]"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Leaderboard Table widget */}
                <div className="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)]">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-[var(--color-text-muted)] font-bold block mb-3">
                    Cohort 1 Live Regional Leaderboard
                  </span>
                  <div className="flex flex-col gap-2">
                    {leaderboard.map((user) => (
                      <div
                        key={user.rank}
                        className={`flex items-center justify-between text-xs p-2 rounded-lg ${
                          user.isCurrentUser
                            ? "bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold"
                            : "bg-transparent text-[var(--color-text-primary)]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[var(--color-text-muted)] w-4 text-center">{user.rank}</span>
                          <span className="font-medium">{user.name}</span>
                          <span className="text-[10px] opacity-80">{user.country}</span>
                        </div>
                        <span className="font-mono font-bold">{user.xp} XP</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practice Simulation Button */}
                <button
                  onClick={handleSolvePractice}
                  disabled={isXpAnimating}
                  className="w-full mt-5 bg-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] text-[var(--color-text-primary)] font-bold text-sm py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isXpAnimating ? "Calculating XP..." : "Solve Practice Question (+40 XP)"}</span>
                </button>

              </div>

            </div>
          </div>

          {/* Content Right */}
          <div className="order-1 lg:order-2">
            <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-extrabold block mb-3 font-mono bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-full w-max">
              GAMIFIED METRICS
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-[var(--color-text-primary)] mb-6 leading-tight">
              Learning that feels like winning
            </h2>
            <p className="text-sm md:text-base text-[var(--color-text-muted)] font-sans leading-relaxed mb-6">
              Study guides are boring. High-stakes competition is electric. La Plume wraps the strict WAEC curriculum in a premium game loop that keeps you addicted to studying French daily.
            </p>
            <p className="text-sm md:text-base text-[var(--color-text-muted)] font-sans leading-relaxed mb-8">
              Gain experience points, climb five difficulty ranks, unlock achievements, and compare scores on our live leaderboard against student pioneers from Lagos to Accra.
            </p>

            {/* Simulated Badge Unlock Alert Box */}
            <AnimatePresence>
              {showBadgeNotification && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-4 text-green-800"
                >
                  <div className="p-2 bg-green-100 text-green-700 rounded-xl">
                    <Trophy className="w-5 h-5 fill-green-500/10" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Badge Unlocked: {showBadgeNotification}!</h4>
                    <p className="text-xs text-green-700">You&#39;ve earned premium validation. Awesome job!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.section>

      {/* --- EXAM COVERAGE SECTION --- */}
      <motion.section
        {...scrollFadeProps}
        className="py-24 px-4 relative z-10 max-w-6xl mx-auto border-t border-[var(--color-border)]"
      >
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-extrabold block mb-3 font-mono bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-full w-max mx-auto">
            SYLLABUS COVERAGE
          </span>
          <h2 className="font-display font-bold text-2xl md:text-4xl text-[var(--color-text-primary)] max-w-3xl mx-auto leading-snug">
            We know the exam better than anyone.
          </h2>
        </div>

        {/* Visual Grid Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-primary)]/20 transition-all duration-300">
            <div className="bg-[var(--color-border)]/50 p-4 border-b border-[var(--color-border)]">
              <span className="font-mono text-xs text-[var(--color-primary)] font-bold uppercase tracking-widest">Paper 1</span>
              <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mt-1">Objective</h3>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>Grammar Concord rules</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>Idiomatic Vocabulary</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>Text comprehension</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-primary)]/20 transition-all duration-300">
            <div className="bg-[var(--color-border)]/50 p-4 border-b border-[var(--color-border)]">
              <span className="font-mono text-xs text-[var(--color-primary)] font-bold uppercase tracking-widest">Paper 2</span>
              <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mt-1">Theory</h3>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>Essay development</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>Formal Letter Writing</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>English-French Translation</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-primary)]/20 transition-all duration-300">
            <div className="bg-[var(--color-border)]/50 p-4 border-b border-[var(--color-border)]">
              <span className="font-mono text-xs text-[var(--color-primary)] font-bold uppercase tracking-widest">Paper 3</span>
              <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mt-1">Oral</h3>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>Audio listening mocks</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>Pronunciation diagnostics</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>Spoken conversation drills</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-primary)]/20 transition-all duration-300">
            <div className="bg-[var(--color-border)]/50 p-4 border-b border-[var(--color-border)]">
              <span className="font-mono text-xs text-[var(--color-primary)] font-bold uppercase tracking-widest">Paper 4</span>
              <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mt-1">Le Blitz</h3>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>High-pressure theory mocks</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>Conjugations and synonyms</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--color-text-muted)]">
                <Check className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>Time-management skills</span>
              </div>
            </div>
          </div>

        </div>
      </motion.section>

      {/* --- PRICING SECTION --- */}
      <motion.section
        {...scrollFadeProps}
        id="pricing"
        className="py-24 px-4 relative z-10 max-w-5xl mx-auto border-t border-[var(--color-border)]"
      >
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-extrabold block mb-3 font-mono bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-full w-max mx-auto">
            PRICING SCHEME
          </span>
          <h2 className="font-display font-bold text-2xl md:text-4xl text-[var(--color-text-primary)] max-w-3xl mx-auto leading-snug">
            Simple, honest pricing.
          </h2>
        </div>

        {/* Pricing Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          
          {/* FREE CARD */}
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-[var(--color-border)]/80 relative">
            <div>
              <span className="text-xs font-mono font-bold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">Basic Access</span>
              <h3 className="font-display font-bold text-2xl text-[var(--color-text-primary)] mb-4">Trial Cohort</h3>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-display font-extrabold text-[var(--color-text-primary)]">₦0</span>
                <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">/ Cohort</span>
              </div>

              <div className="border-t border-[var(--color-border)] pt-6 mb-8 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                  <Check className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Week 1 bootcamp modules</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                  <Check className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Basic grammar exercises</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                  <Check className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Community forum access</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-red-500/60 line-through">
                  <X className="w-4 h-4 text-red-500/40" />
                  <span>Interactive Le Blitz (Days 8-30)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-red-500/60 line-through">
                  <X className="w-4 h-4 text-red-500/40" />
                  <span>Friday Mock proctored sessions</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setRegOpen(true)}
              className="w-full py-4 bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 text-[var(--color-text-primary)] font-bold text-sm rounded-xl transition-all duration-300 text-center cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          {/* PREMIUM CARD */}
          <div className="bg-[var(--color-card)] border-2 border-[var(--color-primary)] rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative transform md:scale-[1.03] shadow-2xl shadow-[var(--color-primary)]/5">
            {/* Ribbon Badge */}
            <div className="absolute top-4 right-4 bg-[var(--color-primary)] text-[var(--color-bg)] text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
              Most Popular
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-2">Complete Prep</span>
              <h3 className="font-display font-bold text-2xl text-[var(--color-text-primary)] mb-4">The Premium Pass</h3>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-display font-extrabold text-[var(--color-text-primary)]">₦3,000</span>
                <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">/ Cohort</span>
              </div>

              <div className="border-t border-[var(--color-border)] pt-6 mb-8 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-primary)]">
                  <Check className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Full 30-day comprehensive syllabus</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-primary)]">
                  <Check className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Expert teacher video explanations</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-primary)]">
                  <Check className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Every Friday Mock Exam + proctored report</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-primary)]">
                  <Check className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Live national leaderboard privileges</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-primary)]">
                  <Check className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Verified digital Completion Certificate</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-primary)]">
                  <Check className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Shareable student scorecard for parents</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setRegOpen(true);
                setRegFormData((prev) => ({ ...prev, country: "Nigeria 🇳🇬" }));
              }}
              className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-bg)] font-bold text-sm rounded-xl transition-all duration-300 text-center shadow-lg shadow-[var(--color-primary)]/10 cursor-pointer"
            >
              Join Premium
            </button>
          </div>

        </div>
      </motion.section>

      {/* --- FAQ SECTION (ACCORDION STYLE) --- */}
      <motion.section
        {...scrollFadeProps}
        id="faq"
        className="py-24 px-4 relative z-10 max-w-3xl mx-auto border-t border-[var(--color-border)]"
      >
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-extrabold block mb-3 font-mono bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-full w-max mx-auto">
            FAQS
          </span>
          <h2 className="font-display font-bold text-2xl md:text-4xl text-[var(--color-text-primary)]">
            Frequently asked questions
          </h2>
        </div>

        {/* Accordions */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = faqOpen === index;
            return (
              <div
                key={index}
                className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-base md:text-lg text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0 ml-4" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm md:text-base text-[var(--color-text-muted)] font-sans leading-relaxed border-t border-[var(--color-border)]/40 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* --- FINAL CTA SECTION --- */}
      <motion.section
        {...scrollFadeProps}
        className="py-24 px-4 relative z-10 border-t border-[var(--color-border)] bg-[var(--color-card)]/30 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-[var(--color-text-primary)] mb-6 leading-tight max-w-3xl mx-auto">
            Your WAEC French result is decided before you enter the exam hall.
          </h2>
          <p className="text-base sm:text-lg text-[var(--color-text-muted)] max-w-xl mx-auto mb-10 font-sans">
            The preparation starts here.
          </p>

          <button
            onClick={() => setRegOpen(true)}
            className="px-10 py-5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-bg)] font-bold text-base md:text-lg rounded-xl shadow-xl shadow-[var(--color-primary)]/10 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer mb-6"
          >
            Join Cohort 1 — Register Free
          </button>

          <p className="text-xs font-semibold uppercase tracking-wider font-mono text-[var(--color-text-muted)]">
            🌍 Built in Africa. For Africa.
          </p>
        </div>
      </motion.section>

      {/* --- FOOTER --- */}
      <footer className="bg-[var(--color-bg)] border-t border-[var(--color-border)] relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            
            {/* Logo left */}
            <div className="flex items-center gap-2">
              <div className="bg-[var(--color-primary)] p-2 rounded-lg text-[var(--color-bg)]">
                <Feather className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-[var(--color-text-primary)]">
                La Plume
              </span>
            </div>

            {/* Links center */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-medium text-[var(--color-text-muted)]">
              <a href="#home" className="hover:text-[var(--color-text-primary)] transition-colors">About</a>
              <a href="#how-it-works" className="hover:text-[var(--color-text-primary)] transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-[var(--color-text-primary)] transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-[var(--color-text-primary)] transition-colors">FAQ</a>
              <a href="mailto:support@laplume.africa" className="hover:text-[var(--color-text-primary)] transition-colors">Contact</a>
            </div>

            {/* Social icons right */}
            <div className="flex items-center gap-4 text-[var(--color-text-muted)]">
              <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary)] transition-colors p-1.5 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)]">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary)] transition-colors p-1.5 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)]">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary)] transition-colors p-1.5 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)]">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary)] transition-colors p-1.5 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)]">
                <Video className="w-5 h-5" />
              </a>
            </div>

          </div>

          {/* Bottom copyright area */}
          <div className="border-t border-[var(--color-border)]/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[var(--color-text-muted)] font-mono">
            <span>© 2025 La Plume Africa. All rights reserved.</span>
            <span>Built in Africa 🌍</span>
          </div>
        </div>
      </footer>

      {/* --- REGISTRATION MODAL & ADMISSION SCORECARD GENERATOR --- */}
      <AnimatePresence>
        {regOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleResetReg}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-[var(--color-card)] border border-[var(--color-border)] w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              
              {/* Close Button */}
              <button
                onClick={handleResetReg}
                className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Success/Registered State (Scorecard ticket generation) */}
              {isRegistered ? (
                <div className="p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>

                  <h3 className="font-display font-bold text-2xl text-[var(--color-text-primary)] mb-2">
                    Congratulations, {regFormData.name.split(" ")[0]}!
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] max-w-xs mx-auto mb-6">
                    You are officially registered for La Plume Cohort 1. Below is your verified Admission Card.
                  </p>

                  {/* ADMISSION TICKET (Crafted layout) */}
                  <div className="w-full bg-[var(--color-bg)] border-2 border-dashed border-[var(--color-border)] rounded-2xl p-6 text-left relative overflow-hidden mb-8">
                    {/* Corner ticket punches */}
                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[var(--color-card)] rounded-full -translate-y-1/2 border-r border-[var(--color-border)]" />
                    <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[var(--color-card)] rounded-full -translate-y-1/2 border-l border-[var(--color-border)]" />

                    <div className="flex justify-between items-start border-b border-[var(--color-border)] pb-4 mb-4">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-primary)] font-bold">La Plume Admission Card</span>
                        <h4 className="font-display font-extrabold text-base text-[var(--color-text-primary)] mt-0.5">Cohort 1 Cadet</h4>
                      </div>
                      <span className="text-xl">{regFormData.country.split(" ").pop()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 font-mono text-xs mb-4">
                      <div>
                        <span className="text-[9px] text-[var(--color-text-muted)] block uppercase">Candidate Name</span>
                        <span className="font-semibold text-[var(--color-text-primary)] truncate block">{regFormData.name}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[var(--color-text-muted)] block uppercase">Ticket Code</span>
                        <span className="font-bold text-[var(--color-primary)] block">{ticketNumber}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[var(--color-text-muted)] block uppercase">Country Office</span>
                        <span className="font-semibold text-[var(--color-text-primary)] block">{regFormData.country}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[var(--color-text-muted)] block uppercase">Exam Target</span>
                        <span className="font-bold text-green-600 block">Grade A1 (WAEC {regFormData.examYear})</span>
                      </div>
                    </div>

                    <div className="border-t border-[var(--color-border)]/60 pt-3 flex items-center justify-between text-[10px] text-[var(--color-text-muted)] font-mono">
                      <span>Status: ACTIVE CADET</span>
                      <span>Level 1 (+100 XP Grant)</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                    <a
                      href={`https://api.whatsapp.com/send?text=I%20just%20secured%20my%20spot%20on%20La%20Plume%20-%20Africa's%20first%20French%20WAEC%20bootcamp!%20Join%20me%20here:%20https://laplume.africa`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-1/2 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share to WhatsApp</span>
                    </a>
                    <button
                      onClick={handleResetReg}
                      className="w-full sm:w-1/2 py-3 bg-[var(--color-border)] hover:bg-[var(--color-border)]/80 text-[var(--color-text-primary)] font-bold text-xs rounded-xl transition-all duration-300"
                    >
                      Back to Landing Page
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleRegisterSubmit} className="p-8">
                  <div className="mb-6 text-center">
                    <span className="inline-flex p-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full mb-3">
                      <GraduationCap className="w-6 h-6 stroke-[2]" />
                    </span>
                    <h3 className="font-display font-bold text-2xl text-[var(--color-text-primary)]">
                      Join Cohort 1
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] max-w-xs mx-auto mt-1">
                      Start your journey to absolute WAEC French excellence today.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-mono font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={regFormData.name}
                        onChange={(e) => setRegFormData({ ...regFormData, name: e.target.value })}
                        placeholder="e.g. John Ojo"
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)]/70 text-[var(--color-text-primary)] px-4 py-3 rounded-xl outline-none font-sans text-sm transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={regFormData.email}
                        onChange={(e) => setRegFormData({ ...regFormData, email: e.target.value })}
                        placeholder="e.g. candidate@domain.com"
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)]/70 text-[var(--color-text-primary)] px-4 py-3 rounded-xl outline-none font-sans text-sm transition-all duration-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                          Your Country
                        </label>
                        <select
                          value={regFormData.country}
                          onChange={(e) => setRegFormData({ ...regFormData, country: e.target.value })}
                          className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)]/70 text-[var(--color-text-primary)] px-3 py-3 rounded-xl outline-none font-sans text-sm transition-all duration-300 appearance-none"
                        >
                          <option value="Nigeria 🇳🇬">Nigeria 🇳🇬</option>
                          <option value="Ghana 🇬🇭">Ghana 🇬🇭</option>
                          <option value="Sierra Leone 🇸🇱">Sierra Leone 🇸🇱</option>
                          <option value="Liberia 🇱🇷">Liberia 🇱🇷</option>
                          <option value="Gambia 🇬🇲">Gambia 🇬🇲</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                          Exam Year
                        </label>
                        <select
                          value={regFormData.examYear}
                          onChange={(e) => setRegFormData({ ...regFormData, examYear: e.target.value })}
                          className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)]/70 text-[var(--color-text-primary)] px-3 py-3 rounded-xl outline-none font-sans text-sm transition-all duration-300 appearance-none"
                        >
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                        WhatsApp/Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={regFormData.phone}
                        onChange={(e) => setRegFormData({ ...regFormData, phone: e.target.value })}
                        placeholder="e.g. +234 812 3456"
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-primary)]/70 text-[var(--color-text-primary)] px-4 py-3 rounded-xl outline-none font-sans text-sm transition-all duration-300"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-bg)] font-bold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[var(--color-primary)]/10"
                  >
                    <span>{isRegistering ? "Registering Candidate..." : "Secure My Spot — Free"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-[10px] text-[var(--color-text-muted)] mt-4">
                    By submitting, you agree to join the official WAEC exam candidate database. Your data is encrypted and kept safe.
                  </p>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

