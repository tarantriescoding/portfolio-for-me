'use client';

import { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Shield, Loader2 } from 'lucide-react';
import { AdminPanel } from '@/components/admin/AdminPanel';
import PortfolioNav from '@/components/portfolio/PortfolioNav';
import HeroSection from '@/components/portfolio/HeroSection';
import AboutSection from '@/components/portfolio/AboutSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import EducationSection from '@/components/portfolio/EducationSection';
import ExperienceSection from '@/components/portfolio/ExperienceSection';
import BlogSection from '@/components/portfolio/BlogSection';
import ContactSection from '@/components/portfolio/ContactSection';
import PortfolioFooter from '@/components/portfolio/PortfolioFooter';
import type {
  ProfileData,
  SkillData,
  ProjectData,
  EducationData,
  ExperienceData,
  BlogPostData,
} from '@/lib/types';

function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav skeleton */}
      <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-8">
        <Skeleton className="h-6 w-32 bg-zinc-800" />
        <div className="hidden lg:flex gap-4">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-16 bg-zinc-800" />
          ))}
        </div>
      </div>
      {/* Hero skeleton */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-72 mx-auto bg-zinc-800" />
          <Skeleton className="h-14 w-80 mx-auto bg-zinc-800" />
          <Skeleton className="h-6 w-96 mx-auto bg-zinc-800" />
          <Skeleton className="h-12 w-48 mx-auto bg-zinc-800 mt-8" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [education, setEducation] = useState<EducationData[]>([]);
  const [experience, setExperience] = useState<ExperienceData[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>([]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, skillsRes, projectsRes, eduRes, expRes, blogRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/skills'),
        fetch('/api/projects'),
        fetch('/api/education'),
        fetch('/api/experience'),
        fetch('/api/blog'),
      ]);

      const [profileData, skillsData, projectsData, eduData, expData, blogData] = await Promise.all([
        profileRes.json(),
        skillsRes.json(),
        projectsRes.json(),
        eduRes.json(),
        expRes.json(),
        blogRes.json(),
      ]);

      setProfile(Array.isArray(profileData) ? null : profileData);
      setSkills(Array.isArray(skillsData) ? skillsData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setEducation(Array.isArray(eduData) ? eduData : []);
      setExperience(Array.isArray(expData) ? expData : []);
      setBlogPosts(Array.isArray(blogData) ? blogData : []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Listen for admin panel back navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdmin(true);
      } else if (window.location.hash === '') {
        setIsAdmin(false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash === '#admin') {
      setIsAdmin(true);
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const switchToAdmin = () => {
    window.location.hash = '#admin';
    setIsAdmin(true);
  };

  const switchToPortfolio = () => {
    window.location.hash = '';
    setIsAdmin(false);
  };

  // Admin panel mode
  if (isAdmin) {
    return <AdminPanel profile={profile} />;
  }

  // Loading state
  if (loading) {
    return <PortfolioSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Navigation */}
      <PortfolioNav profile={profile} />

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection profile={profile} />
        <AboutSection profile={profile} totalProjects={projects.length} totalSkills={skills.length} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <EducationSection education={education} />
        <ExperienceSection experience={experience} />
        <BlogSection posts={blogPosts} />
        <ContactSection profile={profile} />
      </main>

      {/* Footer */}
      <PortfolioFooter profile={profile} />

      {/* Floating Admin Toggle Button */}
      <Button
        onClick={switchToAdmin}
        size="sm"
        className="fixed bottom-6 right-6 z-50 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/50 shadow-lg transition-all group"
        title="Admin Panel"
      >
        <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
      </Button>
    </div>
  );
}
