"use client";

import { useEffect, useState } from "react";
import { useAuth, getAuthHeaders } from "@/hooks/use-auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PlusCircle,
  Search,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  MoreVertical,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
}

export default function AdminDashboard() {
  const { admin, loading, logout } = useAuth();
  const pathname = usePathname();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!admin) return;

    // Fetch all posts for stats
    fetch("/api/blogs?all=true&limit=100", {
      cache: "no-store",
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        const posts = data.posts || [];
        setRecentPosts(posts.slice(0, 5));
        setStats({
          totalPosts: posts.length,
          publishedPosts: posts.filter((p: any) => p.published).length,
          draftPosts: posts.filter((p: any) => !p.published).length,
          totalViews: posts.reduce(
            (acc: number, p: any) => acc + (p.views || 0),
            0
          ),
        });
      })
      .catch(console.error);
  }, [admin]);

  if (loading) {
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Welcome back, {admin.name}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s an overview of your blog
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Posts
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalPosts ?? "—"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats?.publishedPosts ?? "—"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats?.draftPosts ?? "—"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalViews ?? "—"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>Your latest blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                {recentPosts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No posts yet. Create your first one!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentPosts.map((post: any) => (
                      <Link
                        key={post._id}
                        href={`/admin/dashboard/posts/${post._id}/edit`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="truncate flex-1 mr-4">
                          <p className="font-medium text-sm truncate">
                            {post.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            post.published
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/dashboard/posts/new">
                  <Button className="w-full justify-start" variant="outline">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Post
                  </Button>
                </Link>
                <Link href="/admin/dashboard/posts">
                  <Button
                    className="w-full justify-start mt-2"
                    variant="outline"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Manage All Posts
                  </Button>
                </Link>
                <Link href="/blog" target="_blank">
                  <Button
                    className="w-full justify-start mt-2"
                    variant="outline"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Blog
                  </Button>
                </Link>
                <Button
                  className="w-full justify-start mt-2"
                  variant="outline"
                  onClick={async () => {
                    if (!confirm("Import all hardcoded blog posts into the database?")) return;
                    try {
                      const res = await fetch("/api/blogs/seed", {
                        method: "POST",
                        headers: getAuthHeaders(),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        alert(`${data.message}`);
                        window.location.reload();
                      } else {
                        alert(data.error || "Failed to seed posts");
                      }
                    } catch {
                      alert("Network error");
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Import Existing Posts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
