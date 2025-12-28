import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();
export async function dashboard() {
    const total_criterias = await prisma.criterias.count();
    const total_employees = await prisma.employees.count();
    const priode = await prisma.priodes.findFirst({
        where: {
            status: "finished"
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            assessments: {
                where: {
                    NOT: {
                        ranking: null
                    }
                },
                include: {
                    employees: true
                }
            }
        }
    });
    return { ...priode, total_criterias, total_employees };
}