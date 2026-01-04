import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const passwordHash = await hash("andy12345", 10);
const payload = {
    username: "Andy Widianto",
    email: "andy@gmail.com",
    password: passwordHash
}
const user = await prisma.users.findFirst({
    where: {
        username: payload.username,
        email: payload.email
    }
});

if (!user) {
    await prisma.users.create({
        data: payload
    });
}

console.log("Berhasil Create User");