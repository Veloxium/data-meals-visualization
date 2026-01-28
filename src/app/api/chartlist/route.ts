import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
                    {
                        typeOfMeal: {
                            contains: filter,
                            mode: "insensitive" as any,
                        },
                    },
                    {
                        category: {
                            contains: filter,
                            mode: "insensitive" as any,
                        },
                    },
                    {
                        jenis: {
                            contains: filter,
                            mode: "insensitive" as any,
                        },
                    },
                ],
            }
            : undefined;

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
