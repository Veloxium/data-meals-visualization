import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 400 }
            );
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 400 }
            );
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "24h" }
        );

        const res = NextResponse.json(
            {
                message: "Login success",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 200 }
        );

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60, 
        });

        return res;
    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
