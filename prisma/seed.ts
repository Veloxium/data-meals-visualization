import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

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

        console.log("Admin user created successfully!");
    } else {
        console.log("Admin already exists. Skipping seeding...");
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
