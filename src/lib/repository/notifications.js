import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./token.service";

const prisma = new PrismaClient();
export async function getNotifications(token, limit) {
    const user = verifyAccessToken(token);
    let where = {};
    if (user.role !== "super_admin" && user.role !== "admin") {
        where = {
            target_role: "all"
        };
    }
    if (limit === "all") {
        return prisma.notifications.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                users: true
            }
        });
    }
    return prisma.notifications.findMany({
        where,
        take: Number(limit),
        orderBy: {
            createdAt: "desc"
        },
        include: { users: true }
    });
}