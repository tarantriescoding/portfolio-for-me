'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ExperienceData } from '@/lib/types';

interface ExperienceSectionProps {
  experience: ExperienceData[];
}

function parseTechStack(techStack: string): string[] {
  try {
    const parsed = JSON.parse(techStack);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return techStack ? techStack.split(',').map((t) => t.trim()) : [];
  }
}

function formatDuration(start: string, end: string, current: boolean): string {
  const startDate = new Date(start);
  const endDate = current ? new Date() : new Date(end);
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years}y ${remainingMonths}m`;
}

function ExperienceTimelineItem({
  entry,
  index,
  isLast,
}: {
  entry: ExperienceData;
  index: number;
  isLast: boolean;
}) {
  const techs = useMemo(() => parseTechStack(entry.techStack), [entry.techStack]);
  const duration = formatDuration(entry.startDate, entry.endDate, entry.current);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative pl-8 pb-10"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-px bg-gradient-to-b from-emerald-500 to-cyan-500/20 shadow-[0_0_6px_rgba(16,185,129,0.3)]" />
      )}

      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 ${
          entry.current
            ? 'bg-emerald-500/20 border-2 border-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.5)] animate-pulse'
            : 'bg-zinc-900 border-2 border-zinc-600'
        }`}
      >
        {entry.current ? (
          <Zap className="w-3 h-3 text-emerald-400" />
        ) : (
          <Briefcase className="w-3 h-3 text-zinc-500" />
        )}
      </div>

      {/* Content Card */}
      <div
        className={`holo-card bg-zinc-900/30 backdrop-blur-sm border rounded-lg p-5 transition-all duration-300 group hover:shadow-lg hover:scale-[1.02] ${
          entry.current
            ? 'border-emerald-500/30 hover:shadow-emerald-500/15 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
            : 'border-emerald-500/10 hover:border-emerald-500/20 hover:shadow-emerald-500/10'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="text-white font-semibold text-base group-hover:text-emerald-400 transition-colors">
              {entry.position}
            </h3>
            <p className="text-emerald-400/70 font-mono text-sm mt-0.5">
              {entry.company}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {entry.current && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono text-xs shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                Current
              </Badge>
            )}
            <Badge
              variant="outline"
              className="border-emerald-500/10 text-zinc-400 bg-zinc-800/30 backdrop-blur-sm font-mono text-xs"
            >
              <Calendar className="w-3 h-3 mr-1" />
              {duration}
            </Badge>
          </div>
        </div>

        {entry.description && (
          <p className="text-zinc-400 text-sm leading-relaxed mb-3">
            {entry.description}
          </p>
        )}

        {techs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {techs.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-xs font-mono border-emerald-500/10 text-zinc-400 bg-zinc-800/30 backdrop-blur-sm"
              >
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  const sorted = useMemo(
    () => [...experience].sort((a, b) => b.order - a.order),
    [experience]
  );

  if (experience.length === 0) return null;

  return (
    <section id="experience" className="py-20 px-4 md:px-8 lg:px-16 bg-transparent relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono neon-text">
            <span className="text-emerald-400">#</span> Experience
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <p className="text-zinc-500 mt-3 font-mono text-sm">
            $ cat ~/experience.log
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {sorted.map((entry, i) => (
            <ExperienceTimelineItem
              key={entry.id}
              entry={entry}
              index={i}
              isLast={i === sorted.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
