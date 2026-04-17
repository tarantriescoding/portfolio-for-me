'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Github,
  Linkedin,
  Twitter,
  Download,
  FolderGit2,
  Hexagon,
  Cpu,
  Wifi,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProfileData } from '@/lib/types';

interface HeroSectionProps {
  profile: ProfileData | null;
}

// Typing effect hook
function useTypingEffect(text: string, speed = 50, startDelay = 500) {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  useEffect(() => {
    if (!started || !text) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, started]);

  return displayText;
}

// Hexagonal grid background for hero
function HexGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.04 }}>
        <defs>
          <pattern id="hex-grid" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
            <path
              d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
              fill="none"
              stroke="#10b981"
              strokeWidth="0.5"
            />
            <path
              d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34"
              fill="none"
              stroke="#10b981"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-grid)" />
      </svg>

      {/* Animated scanning circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[600px] h-[600px] rounded-full border border-emerald-500/5 animate-ping" style={{ animationDuration: '4s' }} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[400px] h-[400px] rounded-full border border-emerald-500/8 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[200px] h-[200px] rounded-full border border-emerald-500/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
      </div>

      {/* Radial glow orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/8 rounded-full blur-[100px] animate-glow-pulse" />
      <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/4 rounded-full blur-[120px]" />

      {/* Floating tech decorations */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute top-20 right-20 opacity-10"
      >
        <Hexagon className="w-32 h-32 text-emerald-400" />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-32 left-16 opacity-8"
      >
        <Cpu className="w-24 h-24 text-cyan-400" />
      </motion.div>
    </div>
  );
}

// HUD-style corner frame
function HudFrame() {
  return (
    <div className="absolute inset-8 pointer-events-none hidden lg:block">
      {/* Top-left corner */}
      <div className="absolute top-0 left-0 w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-500/40 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-emerald-500/40 to-transparent" />
        <span className="absolute top-2 left-2 text-[9px] font-mono text-emerald-500/30">SYS.ONLINE</span>
      </div>
      {/* Top-right corner */}
      <div className="absolute top-0 right-0 w-16 h-16">
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-emerald-500/40 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-emerald-500/40 to-transparent" />
        <span className="absolute top-2 right-2 text-[9px] font-mono text-emerald-500/30 flex items-center gap-1">
          <Wifi className="w-2.5 h-2.5" /> CONNECTED
        </span>
      </div>
      {/* Bottom-left corner */}
      <div className="absolute bottom-0 left-0 w-16 h-16">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-500/40 to-transparent" />
        <div className="absolute bottom-0 left-0 h-full w-[1px] bg-gradient-to-t from-emerald-500/40 to-transparent" />
        <span className="absolute bottom-2 left-2 text-[9px] font-mono text-emerald-500/30">V.2.0.25</span>
      </div>
      {/* Bottom-right corner */}
      <div className="absolute bottom-0 right-0 w-16 h-16">
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-emerald-500/40 to-transparent" />
        <div className="absolute bottom-0 right-0 h-full w-[1px] bg-gradient-to-t from-emerald-500/40 to-transparent" />
      </div>
    </div>
  );
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const name = profile?.name || 'Developer';
  const title = profile?.title || 'AI/ML Enthusiast';
  const greeting = ` > Hello World, I'm ${name}`;

  const typedGreeting = useTypingEffect(greeting, 40, 300);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const scrollToProjects = useCallback(() => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <HexGrid />
      <HudFrame />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-center gap-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest"
        >
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </span>
          <span className="text-zinc-800">|</span>
          <span>Neural Core Active</span>
          <span className="text-zinc-800">|</span>
          <span>AI/ML Ready</span>
        </motion.div>

        {/* Terminal greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="inline-block bg-zinc-900/60 border border-zinc-700/50 rounded-lg px-6 py-3 font-mono text-sm backdrop-blur-sm tech-corners glow-border">
            <span className="text-emerald-400">{typedGreeting}</span>
            <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse align-middle" />
          </div>
        </motion.div>

        {/* Name with neon gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-500 bg-clip-text text-transparent neon-text"
        >
          {name}
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl sm:text-2xl md:text-3xl text-zinc-300 mb-6 font-mono"
        >
          <span className="text-emerald-500/60">$</span> {title}
        </motion.p>

        {/* Bio tagline */}
        {profile?.bio && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-zinc-400 max-w-2xl mx-auto mb-10 text-base md:text-lg leading-relaxed"
          >
            {profile.bio}
          </motion.p>
        )}

        {/* CTA Buttons */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            <Button
              onClick={scrollToProjects}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 text-base font-mono shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95"
            >
              <FolderGit2 className="w-4 h-4 mr-2" />
              View Projects
            </Button>
            {profile?.resumeUrl && (
              <Button
                asChild
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-800/50 px-6 py-3 text-base font-mono transition-all hover:scale-105 active:scale-95"
              >
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </a>
              </Button>
            )}
          </motion.div>
        )}

        {/* Social Links */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-4"
          >
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all hover:scale-110"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {profile?.twitter && (
              <a
                href={profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
          </motion.div>
        )}
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-zinc-600 text-xs font-mono tracking-wider">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-emerald-500/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
