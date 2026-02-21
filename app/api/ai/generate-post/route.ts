import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const payload = authenticateRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in environment variables" },
        { status: 500 }
      );
    }

    const { title } = await req.json();

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json(
        { error: "Please provide a title (at least 3 characters)" },
        { status: 400 }
      );
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const userPrompt = `You are an expert technical blog writer. I need you to write a complete, high-quality, long-form blog post.

Blog post title: "${title.trim()}"

Write the FULL blog post and return it as a JSON object with these fields:

1. "title" - the blog post title (use the one I gave, cleaned up if needed)
2. "slug" - URL-friendly slug derived from the title (lowercase, hyphens, no special chars)
3. "excerpt" - a compelling 1-2 sentence summary, around 150-200 characters
4. "content" - the FULL blog post body in Markdown format. This MUST be substantial (2000-4000 words). Include:
   - An engaging introduction paragraph explaining why this topic matters
   - Multiple main sections using ## headings
   - Subsections using ### headings where appropriate
   - Practical code examples in fenced code blocks with language tags (e.g. \`\`\`jsx, \`\`\`css, \`\`\`bash)
   - Bullet points and numbered lists for key points
   - Bold text for emphasis on important concepts
   - Tips, best practices, and common pitfalls sections
   - Real-world use cases and comparisons where relevant
   - A conclusion/summary section at the end
5. "tags" - array of 4-6 relevant tags (e.g. ["Next.js", "CSS", "Tailwind CSS", "Web Development"])
6. "series" - if the topic fits a series name like "Next.js Mastery" or "React Deep Dive", include it; otherwise use empty string ""
7. "readTime" - estimated reading time in minutes (number)
8. "featured" - boolean, set to false

CRITICAL: The "content" field must contain a COMPLETE, LONG, DETAILED blog post in Markdown. Do NOT leave it empty or short. Write at least 2000 words of actual educational content.

Return ONLY the JSON object. No markdown fences around the JSON, no extra explanation.`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 65536,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errorData = await geminiRes.text();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { error: "AI generation failed. Check your API key and try again." },
        { status: 502 }
      );
    }

    const geminiData = await geminiRes.json();

    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!rawText) {
      return NextResponse.json(
        { error: "AI returned an empty response" },
        { status: 502 }
      );
    }

    // Parse the JSON response — strip markdown fences if present
    let postData;
    try {
      let cleaned = rawText.trim();
      // Strip leading ```json or ```
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json|JSON)?\s*\n?/, "");
      }
      // Strip trailing ```
      if (cleaned.trimEnd().endsWith("```")) {
        cleaned = cleaned.replace(/\n?\s*```\s*$/, "");
      }
      cleaned = cleaned.trim();
      postData = JSON.parse(cleaned);
    } catch (e1) {
      // Fallback: greedily extract from first { to last }
      try {
        const firstBrace = rawText.indexOf("{");
        const lastBrace = rawText.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          const jsonStr = rawText.substring(firstBrace, lastBrace + 1);
          postData = JSON.parse(jsonStr);
        } else {
          throw new Error("No JSON braces found");
        }
      } catch (e2) {
        console.error("Failed to parse AI response (attempt 1):", (e1 as Error).message);
        console.error("Failed to parse AI response (attempt 2):", (e2 as Error).message);
        console.error("Raw text preview:", rawText.substring(0, 500));
        return NextResponse.json(
          { error: "AI returned invalid format. Please try again." },
          { status: 502 }
        );
      }
    }

    // Validate and sanitize
    const result = {
      title: postData.title || title.trim(),
      slug:
        postData.slug ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim(),
      excerpt: postData.excerpt || "",
      content: postData.content || "",
      tags: Array.isArray(postData.tags)
        ? postData.tags.map((t: any) => String(t).trim()).filter(Boolean)
        : [],
      series: postData.series || "",
      readTime: postData.readTime || 5,
      featured: !!postData.featured,
    };

    // Log content length for debugging
    console.log(`AI generated post: title="${result.title}", content length=${result.content.length}, tags=${result.tags.length}`);

    if (!result.content) {
      console.error("AI generated empty content. Raw response length:", rawText.length);
      return NextResponse.json(
        { error: "AI generated empty content. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, post: result });
  } catch (error) {
    console.error("AI generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
