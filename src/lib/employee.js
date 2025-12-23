import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function CreateEmployee(data) {
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

export async function updateEmployee(id, { nip, name, position, division, status }) {
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

export async function deleteEmployee(id) {
    return prisma.employees.delete({
        where: {
            id
        }
    })
}