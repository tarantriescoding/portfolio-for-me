'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import type { SkillData } from '@/lib/types';

interface SkillsSectionProps {
  skills: SkillData[];
}

function SkillBar({ skill, index }: { skill: SkillData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {skill.icon && (
            <span className="text-lg" role="img" aria-label={skill.name}>
              {skill.icon}
            </span>
          )}
          <span className="text-zinc-200 text-sm font-medium">{skill.name}</span>
        </div>
        <span className="text-emerald-400 font-mono text-xs">{skill.level}%</span>
      </div>
      <div className="relative">
        <Progress
          value={skill.level}
          className="h-2 bg-zinc-800 [&_[data-slot=progress-indicator]]:bg-emerald-500 [&_[data-slot=progress-indicator]]:shadow-[0_0_10px_rgba(16,185,129,0.3)] [&_[data-slot=progress-indicator]]:transition-all [&_[data-slot=progress-indicator]]:duration-1000"
        />
      </div>
    </motion.div>
  );
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const categories = useMemo(() => {
    const cats = Array.from(new Set(skills.map((s) => s.category))).sort();
    return cats.length > 0 ? cats : ['All'];
  }, [skills]);

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filteredSkills = useMemo(() => {
    if (activeCategory === 'All') return skills;
    return skills.filter((s) => s.category === activeCategory);
  }, [skills, activeCategory]);

  if (skills.length === 0) return null;

  return (
    <section id="skills" className="py-20 px-4 md:px-8 lg:px-16 bg-black">
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
            <span className="text-emerald-400">#</span> Skills
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full" />
          <p className="text-zinc-500 mt-3 font-mono text-sm">
            $ ls ~/skills/
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="bg-zinc-900 border border-zinc-800 flex-wrap h-auto gap-1 p-1">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/50 text-zinc-400 font-mono text-xs px-3 py-1.5 border border-transparent rounded-md"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((cat) => (
              <TabsContent key={cat} value={cat}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
                  {(cat === 'All' ? skills : skills.filter((s) => s.category === cat))
                    .sort((a, b) => a.order - b.order)
                    .map((skill, i) => (
                      <SkillBar key={skill.id} skill={skill} index={i} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
