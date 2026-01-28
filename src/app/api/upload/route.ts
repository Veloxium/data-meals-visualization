export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { parse } from "date-fns";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const file = form.get("file") as File;

        if (!file) {
            return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
        }

        // Convert File → Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Read Excel
        const workbook = XLSX.read(buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        // Loop insert
        for (const row of rows as any[]) {
            let rawDate = row["Date"];

            let parsedDate: Date | null = null;

            // Handle Excel date serial numbers (numbers)
            if (typeof rawDate === "number") {
                // Excel's epoch starts at 1899-12-30
                parsedDate = new Date(Math.round((rawDate - 25569) * 86400 * 1000));
            } else if (typeof rawDate === "string") {
                const dateString = rawDate.trim();
                // Try "M/d/yyyy"
                parsedDate = parse(dateString, "M/d/yyyy", new Date());
                // Try "MM/dd/yyyy" if previous failed
                if (isNaN(parsedDate.getTime())) {
                    parsedDate = parse(dateString, "MM/dd/yyyy", new Date());
                }
            }

            if (!parsedDate || isNaN(parsedDate.getTime())) {
                throw new Error(`Invalid date format: ${rawDate}`);
            }


            await prisma.mealRecord.create({
                data: {
                    date: parsedDate,
                    typeOfMeal: row["Type of Meal"],
                    qtyFrozen: Number(row["Qty Frozen"]) ?? 0,
                    qtyFresh: Number(row["Qty Fresh"]) ?? 0,
                    category: row["Category"],
                    jenis: row["Jenis"],
                },
            });
        }

        return NextResponse.json({ message: "Upload success" });
    } catch (error) {
        console.error("UPLOAD ERROR:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
