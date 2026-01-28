"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user";

export default function Home() {
  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.user) {
      setUser(data.user);
    }

    if (!res.ok) {
      setError(data.message || "Login failed");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src="/bg2.jpg"
        alt="Background Image"
        width={1920}
        height={1080}
        className="absolute -z-10 h-full w-full object-cover"
        priority
      />
      <div className="z-10 flex justify-end items-center w-full h-full p-4">
        <div className="w-full px-10 py-16 flex flex-col justify-center md:w-1/3 h-full bg-white rounded-2xl">
          <p className="text-2xl font-bold">Welcome Back!</p>
          <p>Log in to open your dashboard.</p>

          <form onSubmit={handleLogin} className="mt-6 flex flex-col">
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              type="email"
              placeholder="Email"
              className="mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Label htmlFor="password" className="mb-2">
              Password
            </Label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-red-500 text-sm mt-2 mb-2">{error}</p>}

            <Button variant="link" className="mb-4 mt-2 self-end">
              Forgot Password?
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500"
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>

            <Separator className="my-4" />

            <p className="text-center">
              Don't have an account?{" "}
              <Link href="/auth/register">
                <Button variant="link" type="button" className="text-blue-500">
                  Sign Up
                </Button>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
