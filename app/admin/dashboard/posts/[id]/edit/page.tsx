"use client";

import { useState, useEffect, use } from "react";
import { useAuth, getAuthHeaders } from "@/hooks/use-auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { usePathname, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Eye, X, ArrowLeft, Trash2, Sparkles } from "lucide-react";
import Link from "next/link";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = use(params);
  const { admin, loading: authLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [author, setAuthor] = useState("Haque");
  const [series, setSeries] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!admin) return;

    fetch(`/api/blogs/${id}`, {
      cache: "no-store",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((data) => {
        const post = data.post;
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setImage(post.image || "");
        setTags(post.tags || []);
        setAuthor(post.author || "Haque");
        setSeries(post.series || "");
        setFeatured(post.featured || false);
        setPublished(post.published || false);
      })
      .catch((err) => {
        setError("Failed to load post");
        console.error(err);
      })
      .finally(() => setFetching(false));
  }, [admin, id]);

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAIRegenerate = async () => {
    if (!title.trim()) {
      setError("Enter a title first, then click Regenerate from AI.");
      return;
    }
    if (!confirm("This will overwrite the current content with AI-generated content. Continue?")) return;
    setError("");
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-post", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: title.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "AI generation failed");
        return;
      }
      const p = data.post;
      if (p.slug) setSlug(p.slug);
      if (p.excerpt) setExcerpt(p.excerpt);
      if (p.content) setContent(p.content);
      if (p.tags?.length) setTags(p.tags);
      if (p.series) setSeries(p.series);
      if (p.featured !== undefined) setFeatured(p.featured);
    } catch {
      setError("Network error during AI generation.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSaving(true);

    try {
      const postData = {
        title,
        slug,
        excerpt,
        content,
        image: image || undefined,
        tags,
        author,
        series: series || undefined,
        featured,
        published,
      };

      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update post");
        return;
      }

      router.push("/admin/dashboard/posts");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      router.push("/admin/dashboard/posts");
    } catch {
      setError("Failed to delete post");
    }
  };

  if (authLoading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        adminName={admin.name}
        onLogout={logout}
        currentPath={pathname}
      />

      <main className="flex-1 md:ml-64 p-6 md:p-8">
        <div className="max-w-full mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin/dashboard/posts">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Edit Post</h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleAIRegenerate}
                disabled={generating || saving || !title.trim()}
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {generating ? "Generating..." : "Regenerate from AI"}
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                title="Delete post"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saving || !title || !content || !excerpt}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                  className="text-lg"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                  className="font-mono text-sm"
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the post..."
                  rows={3}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label>Content * (Markdown)</Label>
                <MarkdownEditor value={content} onChange={setContent} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Post Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Post Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Cover Image URL</Label>
                    <Input
                      id="image"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="series">Series</Label>
                    <Input
                      id="series"
                      value={series}
                      onChange={(e) => setSeries(e.target.value)}
                      placeholder="Optional series name"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Featured</Label>
                    <Switch
                      id="featured"
                      checked={featured}
                      onCheckedChange={setFeatured}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="published">Published</Label>
                    <Switch
                      id="published"
                      checked={published}
                      onCheckedChange={setPublished}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTag}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
