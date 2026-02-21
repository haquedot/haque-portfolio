import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { authenticateRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/blogs/[id] - Get a single blog post
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    // Try finding by slug first, then by _id
    let post = await BlogPost.findOne({ slug: id }).lean();
    if (!post) {
      post = await BlogPost.findById(id).lean();
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If post is not published, only admin can view
    if (!post.published) {
      const payload = authenticateRequest(req);
      if (!payload) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id] - Update a blog post (admin only)
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const payload = authenticateRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await context.params;
    const body = await req.json();

    // Check for slug conflict
    if (body.slug) {
      const existing = await BlogPost.findOne({
        slug: body.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return NextResponse.json(
          { error: "A blog post with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Auto-calculate read time if content changed
    if (body.content && !body.readTime) {
      body.readTime = Math.ceil(body.content.split(/\s+/).length / 200);
    }

    body.updatedAt = new Date();

    const post = await BlogPost.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error("Error updating blog:", error);
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

// DELETE /api/blogs/[id] - Delete a blog post (admin only)
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const payload = authenticateRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await context.params;

    const post = await BlogPost.findByIdAndDelete(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
