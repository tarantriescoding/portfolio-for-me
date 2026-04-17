'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AchievementData } from '@/lib/types';

interface AchievementsSectionProps {
  achievements: AchievementData[];
}

const categoryColors: Record<string, string> = {
  hackathon: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  award: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  certification: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
  publication: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
  competition: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  open_source: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
  scholarship: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
};

const categoryLabels: Record<string, string> = {
  hackathon: 'Hackathon',
  award: 'Award',
  certification: 'Certification',
  publication: 'Publication',
  competition: 'Competition',
  open_source: 'Open Source',
  scholarship: 'Scholarship',
};

function AchievementCard({
  achievement,
  index,
}: {
  achievement: AchievementData;
  index: number;
}) {
  const colorClass =
    categoryColors[achievement.category] ||
    'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  const label =
    categoryLabels[achievement.category] || achievement.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="bg-zinc-900/50 border-zinc-800 hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 group h-full">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="shrink-0 text-3xl mt-0.5 group-hover:scale-110 transition-transform duration-300">
              {achievement.icon || '🏆'}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-white font-semibold text-sm group-hover:text-emerald-400 transition-colors leading-tight">
                  {achievement.title}
                </h3>
                {achievement.credentialUrl && (
                  <a
                    href={achievement.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-1 text-zinc-500 hover:text-emerald-400 transition-colors"
                    title="View Credential"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {achievement.description && (
                <p className="text-zinc-500 text-xs leading-relaxed mb-3 line-clamp-2">
                  {achievement.description}
                </p>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`text-xs font-mono border ${colorClass}`}
                >
                  {label}
                </Badge>
                {achievement.date && (
                  <span className="text-zinc-600 text-xs font-mono">
                    {achievement.date}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AchievementsSection({
  achievements,
}: AchievementsSectionProps) {
  const sorted = useMemo(
    () => [...achievements].sort((a, b) => a.order - b.order),
    [achievements]
  );

  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-20 px-4 md:px-8 lg:px-16 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono">
            <span className="text-emerald-400">#</span> Achievements
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full" />
          <p className="text-zinc-500 mt-3 font-mono text-sm">
            $ ls ~/achievements/
          </p>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((achievement, i) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
