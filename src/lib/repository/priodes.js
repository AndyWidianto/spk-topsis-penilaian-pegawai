import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./token.service";

const prisma = new PrismaClient();

export async function createPriode(token, { month, year, status }) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    return prisma.priodes.create({
        data: {
            month, 
            year,
            status
        }
    });
}

export async function getPriodes() {
    return prisma.priodes.findMany();
}

export async function deletePriode(token, id) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    return prisma.priodes.delete({
        where: {
            id
        }
    })
};

export async function updatePriode(token, id, { month, year, status }) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    return prisma.priodes.update({
        where: {
            id
        },
        data: {
            month, 
            year,
            status
        }
    })
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