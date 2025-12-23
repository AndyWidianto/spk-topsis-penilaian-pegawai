import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function Login({ username, password }) {
    if (!username || username === " ") {
        throw new Error("user tidak boleh kosong");
    }
    return prisma.users.findFirst({
        where: {
            username
        }
    });
}
