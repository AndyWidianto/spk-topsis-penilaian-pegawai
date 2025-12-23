import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createPriode({ month, year, status }) {
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

export async function deletePriode(id) {
    return prisma.priodes.delete({
        where: {
            id
        }
    })
};

export async function updatePriode(id, { month, year, status }) {
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
                    employees: true
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
                }
            }
        }
    });
}