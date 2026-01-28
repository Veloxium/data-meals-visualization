"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Registration failed");
      setLoading(false);
      return;
    }

    // redirect ke login page
    router.push("/auth/login");
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src="/bg2.jpg"
        alt="Background Image"
        width={1920}
        height={1080}
        className="absolute -z-10 h-svh w-full object-cover"
        priority
      />

      <div className="z-10 flex justify-end items-center w-full h-full p-4">
        <div className="w-full px-10 py-16 flex flex-col justify-center md:w-1/3 h-full bg-white rounded-2xl">
          <p className="text-2xl font-bold">Create an account</p>
          <p>Sign up to get started with your dashboard.</p>

          <form onSubmit={handleRegister} className="mt-6 flex flex-col">
            <Label htmlFor="name" className="mb-2">
              Full name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Full name"
              className="mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              id="email"
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
              id="password"
              type="password"
              placeholder="Password"
              className="mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Label htmlFor="confirmPassword" className="mb-2">
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              className="mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <Separator className="my-4" />

            <p className="text-center">
              Already have an account?{" "}
              <Link href="/auth/login">
                <Button variant="link" type="button" className="text-blue-500">
                  Log In
                </Button>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
