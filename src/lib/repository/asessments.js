import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./middleware";
import { AppError } from "../errors/AppError";

const prisma = new PrismaClient();

export async function createAsessment(token, { employee_id, priode_id, total_value, ranking }) {
    verifyAccessToken(token);
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

export async function deleteAsessment(token, id) {
    verifyAccessToken(token);
    return prisma.assessments.delete({
        where: {
            id
        }
    })
}

export async function updateAsessment(token, id, { employee_id, priode_id, total_value, ranking }) {
    verifyAccessToken(token);
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