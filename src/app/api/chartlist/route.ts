import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { QueryMode } from "../../../../generated/prisma/internal/prismaNamespace";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;
        const filter = searchParams.get("filter") || "";

        const skip = (page - 1) * limit;

        const where = filter
            ? {
                OR: [
                    { typeOfMeal: { contains: filter, mode: QueryMode.insensitive } },
                    { category: { contains: filter, mode: QueryMode.insensitive } },
                    { jenis: { contains: filter, mode: QueryMode.insensitive } },
                ],
            }
            : {};

        const [records, total] = await Promise.all([
            prisma.mealRecord.findMany({
                skip,
                take: limit,
                where,
                orderBy: { date: "desc" },
            }),
            prisma.mealRecord.count({ where }),
        ]);

        return NextResponse.json({
            data: records,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const data = await prisma.mealRecord.create({
            data: body,
        });

        return NextResponse.json({ data });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

