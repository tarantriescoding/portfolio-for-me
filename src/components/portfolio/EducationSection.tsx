'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { EducationData } from '@/lib/types';

interface EducationSectionProps {
  education: EducationData[];
}

function TimelineItem({
  entry,
  index,
  isLast,
}: {
  entry: EducationData;
  index: number;
  isLast: boolean;
}) {
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
        <div className="absolute left-[11px] top-8 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 to-zinc-800" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-zinc-900 border-2 border-emerald-500 flex items-center justify-center z-10">
        <GraduationCap className="w-3 h-3 text-emerald-400" />
      </div>

      {/* Content Card */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 hover:border-emerald-500/20 transition-all duration-300 group hover:shadow-lg hover:shadow-emerald-500/5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="text-white font-semibold text-base group-hover:text-emerald-400 transition-colors">
              {entry.degree}
            </h3>
            {entry.field && (
              <p className="text-emerald-400/70 font-mono text-sm mt-0.5">
                {entry.field}
              </p>
            )}
          </div>
          <Badge
            variant="outline"
            className="border-zinc-700 text-zinc-400 bg-zinc-800/50 font-mono text-xs w-fit shrink-0"
          >
            <Calendar className="w-3 h-3 mr-1" />
            {entry.startYear} — {entry.endYear}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-400 text-sm mb-2">
          <Building2 className="w-3.5 h-3.5 text-zinc-500" />
          {entry.institution}
        </div>

        {entry.grade && (
          <div className="flex items-center gap-1.5 text-sm">
            <Award className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-zinc-300 font-mono">{entry.grade}</span>
          </div>
        )}

        {entry.description && (
          <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
            {entry.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function EducationSection({ education }: EducationSectionProps) {
  const sorted = useMemo(
    () => [...education].sort((a, b) => b.order - a.order),
    [education]
  );

  if (education.length === 0) return null;

  return (
    <section id="education" className="py-20 px-4 md:px-8 lg:px-16 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono">
            <span className="text-emerald-400">#</span> Education
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full" />
          <p className="text-zinc-500 mt-3 font-mono text-sm">
            $ cat ~/education.log
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {sorted.map((entry, i) => (
            <TimelineItem
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
