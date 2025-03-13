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

const comments = [
    { content: "First comment from DB." },
    { content: "Second comment from DB." },
    { content: "Third comment from DB." },
];

const seed = async () => {
    const t0 = performance.now();
    console.log("DB Seed: Started...");

    await prisma.comment.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash = await hashPassword("testing123");

    const dbUsers = await prisma.user.createManyAndReturn({
        data: users.map((user) => ({
            ...user,
            passwordHash
        })),
    });
    
    const dbTickets = await prisma.ticket.createManyAndReturn({
        data: tickets.map((ticket) => ({
            ...ticket,
            userId: dbUsers[0].id
        })),
    });

    await prisma.comment.createMany({
        data: comments.map((comment) => ({
            ...comment,
            ticketId: dbTickets[0].id,
            userId: dbUsers[0].id,
        })),
    })

    const t1 = performance.now();
    console.log(`DB Seed: Completed in ${t1 - t0}ms`);
}

seed();