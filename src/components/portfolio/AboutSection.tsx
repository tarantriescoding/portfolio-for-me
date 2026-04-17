'use client';

import { motion } from 'framer-motion';
import { MapPin, FolderGit2, Cpu, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { ProfileData } from '@/lib/types';

interface AboutSectionProps {
  profile: ProfileData | null;
  totalProjects: number;
  totalSkills: number;
}

const stats = [
  { icon: FolderGit2, label: 'Projects', color: 'text-emerald-400' },
  { icon: Cpu, label: 'Skills', color: 'text-cyan-400' },
  { icon: GraduationCap, label: 'B.Tech CSE', color: 'text-emerald-400' },
];

export default function AboutSection({
  profile,
  totalProjects,
  totalSkills,
}: AboutSectionProps) {
  const name = profile?.name || 'Developer';
  const title = profile?.title || 'AI/ML Enthusiast';
  const bio = profile?.bio || 'A passionate developer exploring the world of technology.';
  const location = profile?.location || 'India';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const statValues = [totalProjects, totalSkills, null];

  return (
    <section id="about" className="py-20 px-4 md:px-8 lg:px-16 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono neon-text">
            <span className="text-emerald-400">#</span> About Me
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Avatar Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2 flex justify-center md:justify-end"
          >
            <Card className="holo-card tech-corners bg-zinc-900/30 backdrop-blur-sm border-emerald-500/10 p-6 w-full max-w-xs hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-0 flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20">
                    <AvatarImage src={profile?.avatarUrl || undefined} alt={name} />
                    <AvatarFallback className="bg-zinc-800/50 text-emerald-400 text-2xl font-mono">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-zinc-900 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">{name}</h3>
                <p className="text-emerald-400 font-mono text-sm mt-1">{title}</p>
                {location && (
                  <div className="flex items-center gap-1 text-zinc-500 text-sm mt-2">
                    <MapPin className="w-3 h-3" />
                    {location}
                  </div>
                )}
                <Separator className="my-4 bg-emerald-500/10" />
                <div className="w-full space-y-3">
                  {stats.map((stat, i) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between px-2"
                    >
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        {stat.label}
                      </div>
                      <span className="text-emerald-400 font-mono font-bold text-sm shadow-[0_0_6px_rgba(16,185,129,0.4)]">
                        {statValues[i] !== null ? statValues[i] : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bio Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-3"
          >
            <Card className="holo-card bg-zinc-900/30 backdrop-blur-sm border-emerald-500/10">
              <CardContent className="p-6 md:p-8">
                <div className="font-mono text-sm text-emerald-600 mb-4">
                  <span className="text-emerald-400">$</span> cat about.md
                </div>
                <p className="text-zinc-300 leading-relaxed text-base md:text-lg whitespace-pre-line">
                  {bio}
                </p>
                <Separator className="my-6 bg-emerald-500/10" />
                <div className="font-mono text-sm text-emerald-600">
                  <span className="text-emerald-400">$</span> echo &quot;Always learning, always building.&quot;
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
