import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
    const adminEmail = "admin@example.com";

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("password123", 10);

        await prisma.user.create({
            data: {
                name: "Administrator",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
            },
        });

        console.log("✅ Admin user created successfully!");
    } else {
        console.log("ℹ️ Admin already exists. Skipping seeding...");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
