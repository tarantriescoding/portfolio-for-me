'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Menu, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import type { ProfileData } from '@/lib/types';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

interface PortfolioNavProps {
  profile: ProfileData | null;
}

export default function PortfolioNav({ profile }: PortfolioNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-950/95 backdrop-blur-md border-b border-zinc-800 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-lg hover:text-emerald-300 transition-colors"
        >
          <Terminal className="w-5 h-5" />
          <span className="hidden sm:inline">
            {profile?.name ? profile.name.split(' ')[0] : 'Portfolio'}
          </span>
          <span className="text-zinc-500 hidden sm:inline">~$</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="px-3 py-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors font-mono rounded-md hover:bg-zinc-800/50"
            >
              <span className="text-zinc-600 mr-1">&gt;</span>
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop Social + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile?.twitter && (
              <a
                href={profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-zinc-400 hover:text-emerald-400"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-gray-950 border-zinc-800 w-72"
            >
              <SheetHeader>
                <SheetTitle className="text-emerald-400 font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Navigation
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 mt-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className="px-4 py-3 text-left text-zinc-300 hover:text-emerald-400 hover:bg-zinc-800/50 transition-colors font-mono text-sm rounded-md"
                    >
                      <span className="text-emerald-600 mr-2">&gt;</span>
                      {link.label}
                    </button>
                  </SheetClose>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-6 px-4">
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-emerald-400 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-emerald-400 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {profile?.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-emerald-400 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
