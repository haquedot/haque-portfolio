import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function buildQuery(id: string) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ slug: id }, { _id: id }] };
  }
  return { slug: id };
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    await connectToDatabase();
    const { id } = await context.params;
    const query = buildQuery(id);

    const post = await BlogPost.findOneAndUpdate(
      query,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, views: post.views });
  } catch (error) {
    console.error("Error updating blog views:", error);
    return NextResponse.json(
      { error: "Unable to update views" },
      { status: 500 }
    );
  }
}
