import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./token.service";

const prisma = new PrismaClient();

export async function createPriode(token, ip, { month, year, status }) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    const priode = await prisma.priodes.create({
        data: { month, year, status }
    });
    await prisma.auditLogs.create({
        data: { 
            user_id: user.id, 
            user_role: user.role, 
            action: "CREATE",
            entity: "priodes",
            entity_id: priode.id,
            ip_address: ip
        }
    })
    return priode;
}

export async function getPriodes() {
    return prisma.priodes.findMany();
}

export async function deletePriode(token, ip, id) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    await prisma.priodes.delete({
        where: {
            id
        }
    })
    await prisma.auditLogs.create({
        data: { 
            user_id: user.id, 
            user_role: user.role, 
            action: "DELETE",
            entity: "priodes",
            entity_id: id,
            ip_address: ip
        }
    });
    return true;
};

export async function updatePriode(token, ip, id, { month, year, status }) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    const priode = await prisma.priodes.update({
        where: {
            id
        },
        data: {
            month, 
            year,
            status
        }
    });
    await prisma.auditLogs.create({
        data: { 
            user_id: user.id, 
            user_role: user.role, 
            action: "UPDATE",
            entity: "priodes",
            entity_id: id,
            ip_address: ip
        }
    })
    return priode;
}

export async function getPriode(id) {
    return prisma.priodes.findUnique({
        where: {
            id
        }, 
        include: {
            assessments: {
                include: {
                    employees: true,
                    assessment_details: true
                },
                orderBy: {
                    ranking: "asc"
                }
            }
        }
    })
}

export async function getPriodeLast() {
    return prisma.priodes.findFirst({
        orderBy: {
            id: "desc"
        },
        include: {
            assessments: {
                include: {
                    employees: true,
                    assessment_details: true
                }
            }
        }
    });
}

export async function getPriodeLastFinished() {
    return prisma.priodes.findFirst({
        where: {
            status: "finished"
        },
        orderBy: [
            { year: "desc" },
            { month: "desc" }
        ],
        include: {
            assessments: {
                where: {
                    NOT: { ranking: null }
                },
                orderBy: { ranking: "asc" },
                include: {
                    employees: true
                }
            }
        }
    })
}