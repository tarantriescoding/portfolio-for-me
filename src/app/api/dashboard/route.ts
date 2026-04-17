import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [
      totalProjects,
      totalSkills,
      totalBlogPosts,
      publishedBlogPosts,
      totalEducation,
      totalExperience,
      totalAchievements,
      unreadMessages,
      totalMessages,
    ] = await Promise.all([
      db.project.count(),
      db.skill.count(),
      db.blogPost.count(),
      db.blogPost.count({ where: { published: true } }),
      db.education.count(),
      db.experience.count(),
      db.achievement.count(),
      db.contactMessage.count({ where: { isRead: false } }),
      db.contactMessage.count(),
    ]);

    return NextResponse.json({
      totalProjects,
      totalSkills,
      totalBlogPosts,
      publishedBlogPosts,
      totalEducation,
      totalExperience,
      totalAchievements,
      unreadMessages,
      totalMessages,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
