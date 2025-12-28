import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createAsessment({ employee_id, priode_id, total_value, ranking }) {
    const newAsessment = await prisma.assessments.create({
        data: {
            employee_id,
            priode_id,
            total_value,
            ranking
        },
        include: {
            priodes: true,
            employees: true
        }
    });
    return newAsessment;
}

export async function getAsessments() {
    return prisma.assessments.findMany({
        include: {
            priodes: true,
            employees: true
        }
    });
}

export async function deleteAsessment(id) {
    return prisma.assessments.delete({
        where: {
            id
        }
    })
}

export async function updateAsessment(id, { employee_id, priode_id, total_value, ranking }) {
    const newAsessment = await prisma.assessments.update({
        where: {
            id
        },
        data: {
            employee_id,
            priode_id,
            total_value,
            ranking
        },
        include: {
            priodes: true,
            employees: true
        }
    });
    return newAsessment;
}