export interface ProfileData {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  resumeUrl: string;
  github: string;
  linkedin: string;
  twitter: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillData {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  techStack: string; // JSON string
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface EducationData {
  id: string;
  degree: string;
  institution: string;
  field: string;
  startYear: string;
  endYear: string;
  grade: string;
  description: string;
  logoUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceData {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  techStack: string; // JSON string
  logoUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessageData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  totalEducation: number;
  totalExperience: number;
  unreadMessages: number;
  totalMessages: number;
}
