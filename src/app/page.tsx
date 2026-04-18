'use client';

import { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminPanel } from '@/components/admin/AdminPanel';
import AdminLogin from '@/components/admin/AdminLogin';
import PortfolioNav from '@/components/portfolio/PortfolioNav';
import HeroSection from '@/components/portfolio/HeroSection';
import AboutSection from '@/components/portfolio/AboutSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import AchievementsSection from '@/components/portfolio/AchievementsSection';
import EducationSection from '@/components/portfolio/EducationSection';
import ExperienceSection from '@/components/portfolio/ExperienceSection';
import BlogSection from '@/components/portfolio/BlogSection';
import ContactSection from '@/components/portfolio/ContactSection';
import PortfolioFooter from '@/components/portfolio/PortfolioFooter';
import { SciFiBackground } from '@/components/portfolio/SciFiBackground';
import type {
  ProfileData,
  SkillData,
  ProjectData,
  AchievementData,
  EducationData,
  ExperienceData,
  BlogPostData,
} from '@/lib/types';

function TechDivider() {
  return (
    <div className="relative py-0">
      <div className="tech-divider" />
    </div>
  );
}

function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav skeleton */}
      <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-8">
        <Skeleton className="h-6 w-32 bg-zinc-800" />
        <div className="hidden lg:flex gap-4">
          {[...Array(8)].map((_, i) => (
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [education, setEducation] = useState<EducationData[]>([]);
  const [experience, setExperience] = useState<ExperienceData[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>([]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, skillsRes, projectsRes, achRes, eduRes, expRes, blogRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/skills'),
        fetch('/api/projects'),
        fetch('/api/achievements'),
        fetch('/api/education'),
        fetch('/api/experience'),
        fetch('/api/blog'),
      ]);

      const [profileData, skillsData, projectsData, achData, eduData, expData, blogData] = await Promise.all([
        profileRes.json(),
        skillsRes.json(),
        projectsRes.json(),
        achRes.json(),
        eduRes.json(),
        expRes.json(),
        blogRes.json(),
      ]);

      setProfile(Array.isArray(profileData) ? null : profileData);
      setSkills(Array.isArray(skillsData) ? skillsData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setAchievements(Array.isArray(achData) ? achData : []);
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

  // Check session auth on mount
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Hash-based admin navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        if (isAuthenticated) {
          setIsAdmin(true);
        } else {
          setShowLogin(true);
        }
      } else if (window.location.hash === '') {
        setIsAdmin(false);
        setShowLogin(false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash === '#admin') {
      if (isAuthenticated) {
        setIsAdmin(true);
      } else {
        setShowLogin(true);
      }
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  // Hidden admin shortcut: Ctrl+Shift+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        if (isAuthenticated) {
          window.location.hash = '#admin';
          setIsAdmin(true);
        } else {
          setShowLogin(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      window.location.hash = '#admin';
      setIsAdmin(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    setIsAdmin(true);
    window.location.hash = '#admin';
  };

  const handleLoginCancel = () => {
    setShowLogin(false);
    window.location.hash = '';
  };

  // Login screen
  if (showLogin && !isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  // Admin panel mode
  if (isAdmin && isAuthenticated) {
    return <AdminPanel profile={profile} />;
  }

  // Loading state
  if (loading) {
    return <PortfolioSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col relative">
      {/* Sci-Fi Global Background */}
      <SciFiBackground />

      {/* Navigation */}
      <PortfolioNav profile={profile} />

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <HeroSection profile={profile} />
        <TechDivider />
        <AboutSection profile={profile} totalProjects={projects.length} totalSkills={skills.length} />
        <TechDivider />
        <SkillsSection skills={skills} />
        <TechDivider />
        <ProjectsSection projects={projects} />
        <TechDivider />
        <AchievementsSection achievements={achievements} />
        <TechDivider />
        <EducationSection education={education} />
        <TechDivider />
        <ExperienceSection experience={experience} />
        <TechDivider />
        <BlogSection posts={blogPosts} />
        <TechDivider />
        <ContactSection profile={profile} />
      </main>

      {/* Footer */}
      <PortfolioFooter profile={profile} />
    </div>
  );
}
