import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        const exist = await prisma.user.findUnique({
            where: { email },
        });

        if (exist) {
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 400 }
            );
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
            },
        });

        return NextResponse.json(
            {
                message: "User registered successfully",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register API Error:", error);

        return NextResponse.json(
            { message: "Internal server error", error: String(error) },
            { status: 500 }
        );
    }
}
