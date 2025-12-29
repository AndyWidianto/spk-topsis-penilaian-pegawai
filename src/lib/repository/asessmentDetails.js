import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./middleware";
import { AppError } from "../errors/AppError";

const prisma = new PrismaClient();

export async function createAsessmentDetail(token, { assessment_id, criteria_id, nilai }) {
    verifyAccessToken(token);
    assessment_id = parseInt(assessment_id);
    criteria_id = parseInt(criteria_id);
    nilai = parseInt(nilai);
    const criteriaActive = await prisma.criterias.findUnique({
        where: {
            id: criteria_id,
            status: "active"
        }
    });
    if (!criteriaActive) {
        throw new AppError("criteria tidak active", 405);
    }
    const newAsessmentDetail = await prisma.assessmentDetails.create({
        data: {
            assessment_id,
            criteria_id,
            nilai
        },
        include: {
            assessments: true,
            criterias: true
        }
    });
    return newAsessmentDetail;
}

export async function updateAsessmentDetail(token, id, { assessment_id, criteria_id, nilai }) {
    verifyAccessToken(token);
    assessment_id = parseInt(assessment_id);
    criteria_id = parseInt(criteria_id);
    nilai = parseInt(nilai);
    const assessmentDetail = await prisma.assessmentDetails.update({
        where: {
            id: parseInt(id),
            criterias: {
                status: "active"
            }
        },
        data: {
            assessment_id,
            criteria_id,
            nilai
        }, 
        include: {
            criterias: true,
            assessments: {
                include: {
                    employees: true
                }
            }
        }
    });
    return assessmentDetail;
}

export async function deleteAsessmentDetail(token, id) {
    verifyAccessToken(token);
    return prisma.assessmentDetails.delete({
        where: {
            id: parseInt(id)
        }
    })
};

export async function getAsessmentDetails() {
    return prisma.assessmentDetails.findMany({
        include: {
            assessments: {
                include: {
                    employees: true
                }
            },
            criterias: true
        }
    });
}