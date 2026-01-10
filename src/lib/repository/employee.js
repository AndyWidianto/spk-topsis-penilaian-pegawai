import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./token.service";
import { AppError } from "../errors/AppError";

const prisma = new PrismaClient();


export async function CreateEmployee(token, ip, data) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    const employee = await prisma.employees.create({
        data: data
    });
    await prisma.auditLogs.create({
        data: { 
            user_id: user.id, 
            user_role: user.role, 
            action: "UPDATE",
            entity: "employees",
            entity_id: employee.id,
            ip_address: ip
        }
    })
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

export async function updateEmployee(token, ip, id, { nip, name, position, division, status }) {
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
    await prisma.auditLogs.create({
        data: { 
            user_id: user.id, 
            user_role: user.role, 
            action: "UPDATE",
            entity: "employees",
            entity_id: employee.id,
            ip_address: ip
        }
    })
    return employee;
}

export async function deleteEmployee(token, ip, id) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak diizinkan!", 403);
    }
    await prisma.employees.delete({
        where: {
            id
        }
    });
    await prisma.auditLogs.create({
        data: { 
            user_id: user.id, 
            user_role: user.role, 
            action: "DELETE",
            entity: "employees",
            entity_id: id,
            ip_address: ip
        }
    })
}