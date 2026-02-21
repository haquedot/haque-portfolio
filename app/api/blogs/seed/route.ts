import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { authenticateRequest } from "@/lib/auth";
import { blogPosts } from "@/constants/blog";

export const dynamic = "force-dynamic";

// POST /api/blogs/seed - Seed database with existing hardcoded blog posts
export async function POST(req: NextRequest) {
  try {
    const payload = authenticateRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    let imported = 0;
    let skipped = 0;

    for (const post of blogPosts) {
      const existing = await BlogPost.findOne({ slug: post.slug });
      if (existing) {
        skipped++;
        continue;
      }

      await BlogPost.create({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author || "Haque",
        authorBio: post.authorBio,
        authorImage: post.authorImage,
        date: new Date(post.date),
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined,
        image: post.image,
        tags: post.tags,
        readTime: post.readTime,
        views: post.views || 0,
        likes: post.likes || 0,
        series: post.series,
        featured: post.featured || false,
        published: true, // Import as published since they were live on site
      });
      imported++;
    }

    return NextResponse.json({
      success: true,
      message: `Imported ${imported} posts, skipped ${skipped} duplicates`,
      imported,
      skipped,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
