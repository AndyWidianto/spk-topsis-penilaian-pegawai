import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./token.service";
import { AppError } from "../errors/AppError";

const prisma = new PrismaClient();

export async function createAsessment(token, { employee_id, priode_id, total_value, ranking, assessment_details }) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
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
    const assessmentDetails = await prisma.$transaction(
        assessment_details.map((item) =>
            prisma.assessmentDetails.create({
                data: {
                    criteria_id: Number(item.id),
                    assessment_id: newAsessment.id,
                    nilai: Number(item.value)
                }
            })
        )
    );

    return { ...newAsessment, assessment_details: assessmentDetails };
}

export async function getAsessments() {
    return prisma.assessments.findMany({
        include: {
            priodes: true,
            employees: true,
            assessemnt_details: true
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

export async function updateAsessment(token, id, { employee_id, priode_id, total_value, ranking, assessment_details}) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    const newAssessment = await prisma.assessments.update({
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
    const assessmentDetails = await prisma.$transaction(
        assessment_details.map((item) =>
            prisma.assessmentDetails.create({
                data: {
                    criteria_id: Number(item.id),
                    assessment_id: newAssessment.id,
                    nilai: Number(item.value)
                }
            })
        )
    );
    return { ...newAssessment, assessment_details: assessmentDetails };
}