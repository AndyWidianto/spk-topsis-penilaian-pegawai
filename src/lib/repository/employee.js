import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function CreateEmployee(token, data) {
    verifyAccessToken(token);
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
    verifyAccessToken(token);
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
    verifyAccessToken(token);
    return prisma.employees.delete({
        where: {
            id
        }
    })
}