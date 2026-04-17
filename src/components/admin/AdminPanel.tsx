'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Shield } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { DashboardView } from './DashboardView';
import { ProfileEditor } from './ProfileEditor';
import { SkillsManager } from './SkillsManager';
import { ProjectsManager } from './ProjectsManager';
import { EducationManager } from './EducationManager';
import { ExperienceManager } from './ExperienceManager';
import { BlogManager } from './BlogManager';
import { MessagesManager } from './MessagesManager';
import type {
  ProfileData,
  SkillData,
  ProjectData,
  EducationData,
  ExperienceData,
  BlogPostData,
  DashboardStats,
} from '@/lib/types';

interface AdminPanelProps {
  profile: ProfileData | null;
}

export function AdminPanel({ profile }: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(profile);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [education, setEducation] = useState<EducationData[]>([]);
  const [experience, setExperience] = useState<ExperienceData[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      setStats(data);
    } catch {
      toast.error('Failed to load dashboard stats');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [skillsRes, projectsRes, eduRes, expRes, blogRes, profileRes] = await Promise.all([
        fetch('/api/skills'),
        fetch('/api/projects'),
        fetch('/api/education'),
        fetch('/api/experience'),
        fetch('/api/blog'),
        fetch('/api/profile'),
      ]);

      const [skillsData, projectsData, eduData, expData, blogData, profileNew] = await Promise.all([
        skillsRes.json(),
        projectsRes.json(),
        eduRes.json(),
        expRes.json(),
        blogRes.json(),
        profileRes.json(),
      ]);

      setSkills(Array.isArray(skillsData) ? skillsData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setEducation(Array.isArray(eduData) ? eduData : []);
      setExperience(Array.isArray(expData) ? expData : []);
      setBlogPosts(Array.isArray(blogData) ? blogData : []);
      if (profileNew && !Array.isArray(profileNew)) {
        setProfileData(profileNew);
      }
    } catch {
      // Silently handle - individual managers will fetch their own data
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchAllData();
  }, [fetchStats, fetchAllData]);

  const refreshStats = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  const handleProfileSaved = () => {
    fetchAllData();
    refreshStats();
  };

  const handleDataUpdated = () => {
    fetchAllData();
    refreshStats();
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView stats={stats} loading={statsLoading} />;
      case 'profile':
        return <ProfileEditor profile={profileData} onSaved={handleProfileSaved} />;
      case 'skills':
        return <SkillsManager skills={skills} onUpdated={handleDataUpdated} />;
      case 'projects':
        return <ProjectsManager projects={projects} onUpdated={handleDataUpdated} />;
      case 'education':
        return <EducationManager education={education} onUpdated={handleDataUpdated} />;
      case 'experience':
        return <ExperienceManager experience={experience} onUpdated={handleDataUpdated} />;
      case 'blog':
        return <BlogManager posts={blogPosts} onUpdated={handleDataUpdated} />;
      case 'messages':
        return <MessagesManager />;
      default:
        return <DashboardView stats={stats} loading={statsLoading} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-zinc-900/30 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="hidden lg:block" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => window.location.hash = ''}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 lg:p-8 pt-14 lg:pt-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
