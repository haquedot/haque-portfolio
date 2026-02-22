"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Check auth status via httpOnly cookie (sent automatically)
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) {
          router.push("/admin/dashboard");
        } else {
          router.push("/admin/login");
        }
      })
      .catch(() => router.push("/admin/login"));
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
