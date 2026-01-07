import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const passwordHash = await hash("andy12345", 10);
const payload = {
    username: "Andy Widianto",
    email: "andy@gmail.com",
    password: passwordHash,
    role: "super_admin",
    active: true
}
const user = await prisma.users.findFirst({
    where: {
        username: payload.username,
        email: payload.email
    }
});

if (!user) {
    const newUser = await prisma.users.create({
        data: payload
    });
    console.log(newUser);
}

console.log("Berhasil Create User");