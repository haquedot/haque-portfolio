import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { authenticateRequest } from "@/lib/auth";

// Force dynamic to prevent Next.js from caching this route
export const dynamic = "force-dynamic";

// GET /api/blogs - Get all blogs (public: published only, admin: all)
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const all = searchParams.get("all"); // admin flag to get all posts

    // Check if admin request
    const adminPayload = all === "true" ? authenticateRequest(req) : null;
    const isAdmin = !!adminPayload;

    const filter: any = {};
    if (!isAdmin) {
      filter.published = true;
    }
    if (tag) {
      filter.tags = tag;
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog post (admin only)
export async function POST(req: NextRequest) {
  try {
    const payload = authenticateRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    const {
      title,
      slug,
      excerpt,
      content,
      author,
      authorBio,
      authorImage,
      image,
      tags,
      readTime,
      series,
      featured,
      published,
    } = body;

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        { error: "Title, slug, excerpt, and content are required" },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = await BlogPost.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 409 }
      );
    }

    const post = await BlogPost.create({
      title,
      slug,
      excerpt,
      content,
      author: author || "Haque",
      authorBio,
      authorImage,
      image,
      tags: tags || [],
      readTime: readTime || Math.ceil(content.split(/\s+/).length / 200),
      series,
      featured: featured || false,
      published: published || false,
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
