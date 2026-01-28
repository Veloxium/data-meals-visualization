import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const day = searchParams.get("day");       // e.g. "monday"
        const date = searchParams.get("date");     // ISO string
        const week = searchParams.get("week");     // e.g. "week-1"
        const month = searchParams.get("month");   // e.g. "january"

        // Ambil semua record tanpa filter DB (karena DB tidak punya fieldnya)
        const records = await prisma.mealRecord.findMany();

        // Jika kosong, return langsung
        if (!records.length) {
            return NextResponse.json([], { status: 200 });
        }

        // 1. FILTER DAY
        let filtered = records;

        if (day) {
            const dayMap: any = {
                sunday: 0,
                monday: 1,
                tuesday: 2,
                wednesday: 3,
                thursday: 4,
                friday: 5,
                saturday: 6,
            };

            filtered = filtered.filter((r:any) => {
                const d = new Date(r.date).getDay();
                return d === dayMap[day.toLowerCase()];
            });
        }

        // 2. FILTER DATE
        if (date) {
            const selected = new Date(date);
            const start = new Date(selected);
            start.setHours(0, 0, 0, 0);

            const end = new Date(selected);
            end.setHours(23, 59, 59, 999);

            filtered = filtered.filter((r:any) => {
                const created = new Date(r.date);
                return created >= start && created <= end;
            });
        }

        // 3. FILTER MONTH
        if (month) {
            const monthMap: any = {
                january: 0,
                february: 1,
                march: 2,
                april: 3,
                may: 4,
                june: 5,
                july: 6,
                august: 7,
                september: 8,
                october: 9,
                november: 10,
                december: 11,
            };

            filtered = filtered.filter((r:any) => {
                const m = new Date(r.date).getMonth();
                return m === monthMap[month.toLowerCase()];
            });
        }

        // 4. FILTER WEEK OF MONTH
        if (week) {
            const weekIndex = parseInt(week.split("-")[1]); // "week-2" → 2

            filtered = filtered.filter((r:any) => {
                const dateObj = new Date(r.date);
                const weekOfMonth = Math.ceil(dateObj.getDate() / 7);
                return weekOfMonth === weekIndex;
            });
        }

        // GROUP DATA
        const grouped: Record<string, { fresh: number; frozen: number }> = {};

        filtered.forEach((r: any) => {
            const parts = r.typeOfMeal.split(" ");
            const mealName = parts.slice(1).join(" ") || r.typeOfMeal;

            if (!grouped[mealName]) {
                grouped[mealName] = { frozen: 0, fresh: 0 };
            }
            grouped[mealName].frozen += r.qtyFrozen;
            grouped[mealName].fresh += r.qtyFresh;
        });

        const chartData = Object.entries(grouped).map(([meal, vals]) => {
            const total = vals.frozen + vals.fresh;
            return {
                meal,
                frozen: vals.frozen,
                fresh: vals.fresh,
                frozenPercent: total ? Math.round((vals.frozen / total) * 100) : 0,
                freshPercent: total ? Math.round((vals.fresh / total) * 100) : 0
            };
        });

        return NextResponse.json(chartData, { status: 200 });
    } catch (error) {
        console.error("Chart API Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
