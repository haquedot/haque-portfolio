"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, User, Loader2 } from "lucide-react";
import { getToken, setAuth } from "@/hooks/use-auth";

export default function AdminLoginPage() {
    const [needsSetup, setNeedsSetup] = useState<boolean>(false); // default: show login form
    const [checkingAuth, setCheckingAuth] = useState(true); // silent background check
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    // Login form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Setup form
    const [setupName, setSetupName] = useState("");
    const [setupEmail, setSetupEmail] = useState("");
    const [setupPassword, setSetupPassword] = useState("");

    useEffect(() => {
        // If already have token+admin, go straight to dashboard
        const token = getToken();
        if (token) {
            window.location.href = "/admin/dashboard";
            return;
        }

        // No token — check if first-time setup is needed
        setCheckingAuth(true);
        fetch("/api/auth/setup")
            .then((r) => r.json())
            .then((data) => setNeedsSetup(!!data.needsSetup))
            .catch(() => {})
            .finally(() => setCheckingAuth(false));
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                setLoading(false);
                return;
            }

            setAuth(data.token, data.admin);
            window.location.href = "/admin/dashboard";
        } catch {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: setupEmail,
                    password: setupPassword,
                    name: setupName,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Setup failed");
                return;
            }

            // Auto login after setup
            setEmail(setupEmail);
            setPassword(setupPassword);
            setNeedsSetup(false);

            // Login automatically
            const loginRes = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: setupEmail,
                    password: setupPassword,
                }),
            });

            const loginData = await loginRes.json();
            if (loginRes.ok) {
                setAuth(loginData.token, loginData.admin);
                window.location.href = "/admin/dashboard";
                return;
            }
        } catch {
            setError("Network error. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        {needsSetup ? "Admin Setup" : "Admin Login"}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {needsSetup
                            ? "Create your admin account to get started"
                            : "Sign in to manage your portfolio"}
                    </p>
                    {checkingAuth && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" /> Checking session…
                        </p>
                    )}
                </div>

                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {needsSetup ? (
                    <form onSubmit={handleSetup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="setup-name">Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="setup-name"
                                    type="text"
                                    placeholder="Your name"
                                    value={setupName}
                                    onChange={(e) => setSetupName(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="setup-email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="setup-email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={setupEmail}
                                    onChange={(e) => setSetupEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="setup-password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="setup-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min 6 characters"
                                    value={setupPassword}
                                    onChange={(e) => setSetupPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    minLength={6}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Admin Account"
                            )}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
}
