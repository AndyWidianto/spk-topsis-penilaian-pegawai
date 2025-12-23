import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function createCriteria({ name, weight, type, description, code }) {
    if (!code) {
        throw new Error("Code tidak boleh kosong");
    }
    if (!name) {
        throw new Error("name tidak boleh kosong");
    } 
    weight = parseInt(weight);
    return prisma.criterias.create({
        data: {
            name,
            weight,
            type,
            description, 
            code
        }
    });
}

export async function getCriterias() {
    return prisma.criterias.findMany();
}

export async function updateCriteria(id, { name, code, weight, type, description }) {
    if (!code) {
        throw new Error("Code tidak boleh kosong");
    }
    if (!name) {
        throw new Error("name tidak boleh kosong");
    } 
    weight = parseInt(weight);
    const criteria = await prisma.criterias.update({
        where: {
            id: parseInt(id)
        },
        data: {
            name,
            code, 
            weight,
            type,
            description
        }
    });
    return criteria;
}

export async function deleteCriteria(id) {
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