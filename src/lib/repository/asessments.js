import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./token.service";
import { AppError } from "../errors/AppError";

const prisma = new PrismaClient();

export async function createAsessment(token, ip, { employee_id, priode_id, total_value, ranking, assessment_details }) {
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
    await prisma.auditLogs.create({
        data: { 
            user_id: user.id, 
            user_role: user.role, 
            action: "CREATE",
            entity: "assessments",
            entity_id: newAsessment.id,
            ip_address: ip
        }
    })
    await prisma.notifications.create({
        data: {
            user_id: user.id,
            message: "create Assessment",
            read: false,
            type: "success",
            action_url: `/dashboard/assessments?search=${criteria.code}`,
            target_role: "admin"
        }
    });

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

export async function deleteAsessment(token, ip, id) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    await prisma.assessmentDetails.delete({
        where: {
            assessment_id: id
        }
    });
    await prisma.assessments.delete({
        where: {
            id
        }
    });
    await prisma.auditLogs.create({
        data: { 
            user_id: user.id, 
            user_role: user.role, 
            action: "DELETE",
            entity: "assessments",
            entity_id: id,
            ip_address: ip
        }
    })
    return true;
}

export async function updateAsessment(token, ip, id, { employee_id, priode_id, total_value, ranking, assessment_details }) {
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
            prisma.assessmentDetails.update({
                where: { id: item.id },
                data: {
                    criteria_id: Number(item.id),
                    assessment_id: newAssessment.id,
                    nilai: Number(item.value)
                }
            })
        )
    );
    await prisma.auditLogs.create({
        data: { 
            user_id: user.id, 
            user_role: user.role, 
            action: "UPDATE",
            entity: "assessments",
            entity_id: id,
            ip_address: ip
        }
    })
    await prisma.notifications.create({
        data: {
            user_id: user.id,
            message: "update Assessment",
            read: false,
            type: "success",
            action_url: `/dashboard/assessments`,
            target_role: "admin"
        }
    });
    return { ...newAssessment, assessment_details: assessmentDetails };
}