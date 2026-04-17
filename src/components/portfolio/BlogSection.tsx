'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
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
import type { BlogPostData } from '@/lib/types';

interface BlogSectionProps {
  posts: BlogPostData[];
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function BlogCard({ post, index }: { post: BlogPostData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="holo-card bg-zinc-900/30 backdrop-blur-sm border-emerald-500/10 overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 hover:scale-[1.02] h-full flex flex-col">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-44 overflow-hidden bg-zinc-800/50">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${post.coverImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent" />
          </div>
        )}

        <CardHeader className="flex-1">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono mb-2">
            <Calendar className="w-3 h-3 text-emerald-500/50" />
            {formatDate(post.createdAt)}
          </div>
          <CardTitle className="text-white text-base group-hover:text-emerald-400 transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
          {post.excerpt && (
            <CardDescription className="text-zinc-400 text-sm leading-relaxed mt-2 line-clamp-3">
              {post.excerpt}
            </CardDescription>
          )}
        </CardHeader>

        <CardFooter>
          <Button
            asChild
            variant="ghost"
            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 font-mono text-xs p-0 h-auto"
          >
            <a href={`/blog/${post.slug}`}>
              Read More
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const publishedPosts = useMemo(
    () => posts.filter((p) => p.published).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [posts]
  );

  if (publishedPosts.length === 0) return null;

  return (
    <section id="blog" className="py-20 px-4 md:px-8 lg:px-16 bg-transparent relative z-10">
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
            <span className="text-emerald-400">#</span> Blog
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <p className="text-zinc-500 mt-3 font-mono text-sm">
            $ ls ~/blog/
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedPosts.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
