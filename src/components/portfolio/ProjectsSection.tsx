'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Star } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ProjectData } from '@/lib/types';

interface ProjectsSectionProps {
  projects: ProjectData[];
}

function parseTechStack(techStack: string): string[] {
  try {
    const parsed = JSON.parse(techStack);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return techStack ? techStack.split(',').map((t) => t.trim()) : [];
  }
}

function ProjectCard({
  project,
  index,
}: {
  project: ProjectData;
  index: number;
}) {
  const techs = useMemo(() => parseTechStack(project.techStack), [project.techStack]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className={`bg-zinc-900/50 border-zinc-800 overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1 ${
          project.featured
            ? 'ring-1 ring-emerald-500/20'
            : ''
        }`}
      >
        {/* Image */}
        {project.imageUrl && (
          <div className="relative h-48 overflow-hidden bg-zinc-800">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${project.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
            {project.featured && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono text-xs">
                  <Star className="w-3 h-3 mr-1 fill-emerald-400" />
                  Featured
                </Badge>
              </div>
            )}
          </div>
        )}

        {!project.imageUrl && project.featured && (
          <div className="px-6 pt-4">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono text-xs">
              <Star className="w-3 h-3 mr-1 fill-emerald-400" />
              Featured
            </Badge>
          </div>
        )}

        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg group-hover:text-emerald-400 transition-colors">
            {project.title}
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm leading-relaxed">
            {project.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 pb-2">
          <div className="flex flex-wrap gap-1.5">
            {techs.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-xs font-mono border-zinc-700 text-zinc-400 bg-zinc-800/50"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="gap-2">
          {project.githubUrl && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-800/50 font-mono text-xs"
            >
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="w-3.5 h-3.5 mr-1.5" />
                Code
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-800/50 font-mono text-xs"
            >
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Live
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.order - b.order),
    [projects]
  );

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-20 px-4 md:px-8 lg:px-16 bg-gray-950">
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
            <span className="text-emerald-400">#</span> Projects
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full" />
          <p className="text-zinc-500 mt-3 font-mono text-sm">
            $ ls ~/projects/
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
