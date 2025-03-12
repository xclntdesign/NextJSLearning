import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/features/password/utils/hash-and-verify";

const prisma = new PrismaClient();

const tickets = [
    {
        title: "Ticket 1",
        content: "First ticket from DB.",
        status: "DONE" as const,
        deadline: new Date().toISOString().split("T")[0],
        bounty: 499
    },
    {
        title: "Ticket 2",
        content: "Second ticket from DB.",
        status: "OPEN" as const,
        deadline: new Date().toISOString().split("T")[0],
        bounty: 399
    },
    {
        title: "Ticket 3",
        content: "Third ticket from DB.",
        status: "IN_PROGRESS" as const,
        deadline: new Date().toISOString().split("T")[0],
        bounty: 599
    }
];

const users = [
    {
        username: "admin",
        email: "admin@admin.com"
    },
    {
        username: "user",
        email: "fred@xclntdesign.com"
    }
];

const seed = async () => {
    const t0 = performance.now();
    console.log("DB Seed: Started...");

    await prisma.user.deleteMany();
    await prisma.ticket.deleteMany();

    const passwordHash = await hashPassword("testing123");

    const dbUsers = await prisma.user.createManyAndReturn({
        data: users.map((user) => ({
            ...user,
            passwordHash
        })),
    });
    
    await prisma.ticket.createMany({
        data: tickets.map((ticket) => ({
            ...ticket,
            userId: dbUsers[0].id
        })),
    });

    const t1 = performance.now();
    console.log(`DB Seed: Completed in ${t1 - t0}ms`);
}

seed();