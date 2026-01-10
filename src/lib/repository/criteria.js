import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./token.service";
import { AppError } from "../errors/AppError";

const prisma = new PrismaClient();
export async function createCriteria(token, ip, { name, weight, type, description, code }) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    if (!code) {
        throw new AppError("Code tidak boleh kosong", 404);
    }
    if (!name) {
        throw new AppError("name tidak boleh kosong", 404);
    }
    const totalWeight = await prisma.criterias.aggregate({
        where: {
            status: "active"
        },
        _sum: {
            weight: true
        }
    });
    weight = parseInt(weight);
    if ((totalWeight._sum.weight + weight) > 100) {
        throw new AppError("bobot lebih dari 100", 411);
    }

    const criteria = await prisma.criterias.create({
        data: { name, weight, type, description, code }
    });
    await prisma.auditLogs.create({
        data: {
            user_id: user.id,
            user_role: user.role,
            action: "CREATE",
            entity: "criteria",
            entity_id: criteria.id,
            ip_address: ip
        }
    });
    await prisma.notifications.create({
        data: {
            user_id: user.id,
            message: "create criteria",
            read: false,
            type: "success",
            action_url: `/dashboard/criteria?search=${criteria.code}`,
            target_role: "admin"
        }
    });
    return criteria;
}

export async function getCriterias() {
    return prisma.criterias.findMany();
}

export async function updateCriteria(token, ip, id, { name, code, weight, type, description }) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    if (!code) {
        throw new AppError("Code tidak boleh kosong", 404);
    }
    if (!name) {
        throw new AppError("name tidak boleh kosong", 404);
    }
    const totalWeight = await prisma.criterias.aggregate({
        where: {
            status: "active",
            NOT: {
                id: id
            }
        },
        _sum: {
            weight: true
        }
    });
    weight = parseInt(weight);
    if ((totalWeight._sum.weight + weight) > 100) {
        throw new AppError("bobot lebih dari 100", 411);
    }
    const criteria = await prisma.criterias.update({
        where: {
            id: parseInt(id)
        },
        data: { name, code, weight, type, description }
    });
    await prisma.auditLogs.create({
        data: {
            user_id: user.id,
            user_role: user.role,
            action: "UPDATE",
            entity: "criterias",
            entity_id: criteria.id,
            ip_address: ip
        }
    });
    await prisma.notifications.create({
        data: {
            user_id: user.id,
            message: "update criteria",
            read: false,
            type: "success",
            action_url: `/dashboard/criteria?search=${criteria.code}`,
            target_role: "admin"
        }
    })
    return criteria;
}

export async function deleteCriteria(token, ip, id) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    await prisma.criterias.delete({
        where: {
            id
        }
    })
    await prisma.auditLogs.create({
        data: { 
            user_id: user.id, 
            user_role: user.role, 
            action: "DELETE",
            entity: "criterias",
            entity_id: id,
            ip_address: ip
        }
    });
}

export async function getCriteria(id) {
    return prisma.criterias.findFirst({
        where: {
            id
        }
    })
}