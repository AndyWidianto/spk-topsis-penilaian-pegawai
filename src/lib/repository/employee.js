import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./token.service";
import { AppError } from "../errors/AppError";

const prisma = new PrismaClient();


export async function CreateEmployee(token, data) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    return prisma.employees.create({
        data: data
    });
}

export async function GetEmployees() {
    const employees = prisma.employees.findMany();
    return employees;
}

export async function GetEmployee(id) {
    const employee = prisma.employees.findFirst({
        where: {
            id: id
        }
    });
    return employee;
}

export async function updateEmployee(token, id, { nip, name, position, division, status }) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    const employee = await prisma.employees.update({
        where: {
            id
        },
        data: {
            nip,
            name,
            position,
            division,
            status
        }
    });
    return employee;
}

export async function deleteEmployee(token, id) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    return prisma.employees.delete({
        where: {
            id
        }
    })
}