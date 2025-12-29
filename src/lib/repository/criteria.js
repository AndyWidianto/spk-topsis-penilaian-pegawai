import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./middleware";
import { AppError } from "../errors/AppError";

const prisma = new PrismaClient();
export async function createCriteria(token, { name, weight, type, description, code }) {
    verifyAccessToken(token);
    if (!code) {
        throw new Error("Code tidak boleh kosong");
    }
    if (!name) {
        throw new Error("name tidak boleh kosong");
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
    console.log("Total: ", totalWeight);
    if ((totalWeight._sum.weight + weight) > 100) {
        throw new AppError("bobot lebih dari 100", 411);
    }
    return prisma.criterias.create({
        data: { name, weight, type, description, code }
    });
}

export async function getCriterias() {
    return prisma.criterias.findMany();
}

export async function updateCriteria(token, id, { name, code, weight, type, description }) {
    verifyAccessToken(token);
    if (!code) {
        throw new Error("Code tidak boleh kosong");
    }
    if (!name) {
        throw new Error("name tidak boleh kosong");
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
    console.log("Total: ", totalWeight);
    if ((totalWeight._sum.weight + weight) > 100) {
        throw new AppError("bobot lebih dari 100", 411);
    }
    const criteria = await prisma.criterias.update({
        where: {
            id: parseInt(id)
        },
        data: { name, code, weight, type, description }
    });
    return criteria;
}

export async function deleteCriteria(token, id) {
    verifyAccessToken(token);
    return prisma.criterias.delete({
        where: {
            id
        }
    })
}

export async function getCriteria(id) {
    return prisma.criterias.findFirst({
        where: {
            id
        }
    })
}