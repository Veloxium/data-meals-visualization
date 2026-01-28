import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(req: Request) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    try {
        const data = await prisma.mealRecord.findUnique({
            where: { id: Number(id) },
        });

        if (!data) {
            return NextResponse.json(
                { message: "Not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ data });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { message: "Error fetching record" },
            { status: 500 }
        );
    }
}

// PUT → Update
export async function PUT(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();
        const body = await req.json();

        const data = await prisma.mealRecord.update({
            where: { id: Number(id) },
            data: body,
        });

        return NextResponse.json({ data });
    } catch (e) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        await prisma.mealRecord.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: "Deleted" });
    } catch (e) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
