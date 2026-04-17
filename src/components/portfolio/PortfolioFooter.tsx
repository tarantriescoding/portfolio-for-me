'use client';

import { Github, Linkedin, Twitter, Terminal, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { ProfileData } from '@/lib/types';

interface PortfolioFooterProps {
  profile: ProfileData | null;
}

export default function PortfolioFooter({ profile }: PortfolioFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm">
              <Terminal className="w-4 h-4" />
              <span>{profile?.name ? profile.name.split(' ')[0] : 'Portfolio'}</span>
              <span className="text-zinc-600">~$</span>
            </div>
            <p className="text-zinc-600 text-xs font-mono">
              &copy; {currentYear} {profile?.name || 'Developer'}. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-500 hover:text-emerald-400 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-500 hover:text-emerald-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile?.twitter && (
              <a
                href={profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-500 hover:text-emerald-400 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Built with */}
          <div className="flex items-center gap-1.5 text-zinc-600 text-xs font-mono">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>using Next.js</span>
          </div>
        </div>

        <Separator className="my-6 bg-zinc-800/50" />

        <div className="text-center">
          <p className="text-zinc-700 text-xs font-mono">
            &lt;/&gt; with{' '}
            <span className="text-emerald-500/50">emerald</span> vibes
          </p>
        </div>
      </div>
    </footer>
  );
}
