'use client';

import {
  FolderKanban,
  Code2,
  FileText,
  Mail,
  GraduationCap,
  Briefcase,
  Trophy,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardStats } from '@/lib/types';

interface DashboardViewProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

const statCards = [
  {
    key: 'totalProjects' as const,
    label: 'Total Projects',
    icon: FolderKanban,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    key: 'totalSkills' as const,
    label: 'Total Skills',
    icon: Code2,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    key: 'totalEducation' as const,
    label: 'Education',
    icon: GraduationCap,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    key: 'totalExperience' as const,
    label: 'Experience',
    icon: Briefcase,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    key: 'totalAchievements' as const,
    label: 'Achievements',
    icon: Trophy,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
];

export function DashboardView({ stats, loading }: DashboardViewProps) {
  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Overview of your portfolio content
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.key} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats[card.key]}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Blog & Messages row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Blog Posts
            </CardTitle>
            <div className="rounded-lg p-2 bg-emerald-400/10">
              <FileText className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.publishedBlogPosts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalBlogPosts - stats.publishedBlogPosts} unpublished
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width:
                      stats.totalBlogPosts > 0
                        ? `${(stats.publishedBlogPosts / stats.totalBlogPosts) * 100}%`
                        : '0%',
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {stats.totalBlogPosts > 0
                  ? Math.round((stats.publishedBlogPosts / stats.totalBlogPosts) * 100)
                  : 0}
                % published
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages
            </CardTitle>
            <div className="rounded-lg p-2 bg-blue-400/10">
              <Mail className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-foreground">
                {stats.totalMessages}
              </div>
              {stats.unreadMessages > 0 && (
                <Badge className="bg-emerald-600 text-white border-0">
                  {stats.unreadMessages} new
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.unreadMessages > 0
                ? `${stats.unreadMessages} unread of ${stats.totalMessages} total`
                : 'All messages read'}
            </p>
            {stats.totalMessages > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{
                      width: `${(stats.unreadMessages / stats.totalMessages) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {stats.unreadMessages} unread
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
