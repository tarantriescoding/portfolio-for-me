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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProfileData } from '@/lib/types';

interface HeroSectionProps {
  profile: ProfileData | null;
}

// Matrix-like background grid dots
function MatrixGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="#10b981" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-emerald-600/8 rounded-full blur-[100px] animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
    </div>
  );
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
      className="relative min-h-screen flex items-center justify-center bg-gray-950 overflow-hidden"
    >
      <MatrixGrid />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
        {/* Terminal greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="inline-block bg-zinc-900/80 border border-zinc-800 rounded-lg px-6 py-3 font-mono text-sm">
            <span className="text-emerald-400">{typedGreeting}</span>
            <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse align-middle" />
          </div>
        </motion.div>

        {/* Name with gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent"
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
          <span className="text-zinc-500">$</span> {title}
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
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 text-base font-mono shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all"
            >
              <FolderGit2 className="w-4 h-4 mr-2" />
              View Projects
            </Button>
            {profile?.resumeUrl && (
              <Button
                asChild
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-800/50 px-6 py-3 text-base font-mono transition-all"
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
                className="p-3 rounded-lg border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {profile?.twitter && (
              <a
                href={profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
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
        <span className="text-zinc-600 text-xs font-mono">scroll down</span>
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
