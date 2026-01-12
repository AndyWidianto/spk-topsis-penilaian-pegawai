import { accessToken, verifyAccessToken } from "./token.service";

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function getProfile(token) {
    const payload = verifyAccessToken(token);
    const user = await prisma.users.findFirst({
        where: { id: payload.id },
        include: {
            notifications: {
                orderBy: { createdAt: "desc" },
                take: 3
            }
        }
    });
    const totalInput = await prisma.auditLogs.count({
        where: { user_id: user.id, action: "CREATE" }
    });
    const totalCalculate = await prisma.auditLogs.count({
        where: { user_id: user.id, action: "CALCULATE" }
    });
    delete user.password;
    return { ...user, total_input: totalInput, total_calculate: totalCalculate }
}

export async function updateProfile(token, { full_name, username, email }) {
    const payload = verifyAccessToken(token);
    const user = await prisma.users.update({
        where: { id: payload.id },
        data: { full_name, username, email }
    });
    const access = accessToken(user);
    return access;
}