import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./token.service";
import { AppError } from "../errors/AppError";

const prisma = new PrismaClient();
export async function getNotifications(token, limit) {
    const user = verifyAccessToken(token);
    let where = {};
    if (user.role !== "super_admin" && user.role !== "admin") {
        where = {
            target_role: "all"
        };
    }
    const totalUnread = await prisma.notifications.count({ 
        where: {
            read: false
        }
    });
    if (limit === "all") {
        const notifications = await prisma.notifications.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                users: true
            }
        });
        return { notifications, total_unread: totalUnread };
    }
    const notifications = await prisma.notifications.findMany({
        where,
        take: Number(limit),
        orderBy: {
            createdAt: "desc"
        },
        include: { users: true }
    });
    return { notifications, total_unread: totalUnread };
}

export async function updateReadNotifications({ id }) {
    if (!id) {
        throw new AppError("Id not found", 404);
    }
    if (id === "all") {
        return prisma.notifications.updateMany({
            data: {
                read: true
            }, 
            where: {
                read: false
            }
        });
    }
    return prisma.notifications.update({
        where: {
            id
        },
        data: { read: true }
    })
}