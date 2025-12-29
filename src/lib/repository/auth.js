import { PrismaClient } from "@prisma/client";
import bcrpyt from "bcrypt";
import { accessToken, refreshToken, verifyAccessToken, verifyRefreshToken } from "./middleware";

const prisma = new PrismaClient();

const salt = 10;

export async function Login({ email, password }) {
    if (!email.trim()) {
        throw new Error("user tidak boleh kosong");
    }
    const user = await prisma.users.findFirst({
        where: {
            OR: [
                { email: email},
                { username: email}
            ]
        }
    });
    if (!user) {
        throw new Error("Email salah");
    }
    const isMatch = await bcrpyt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("password salah");
    }
    delete user.password;
    const refresh = refreshToken(user);
    const access = accessToken(user);
    return { access, refresh };
}

export async function Register({ username, email, password }) {
    if (!username.trim() || !email.trim()) {
        throw new Error("Username atau Email tidak boleh kosong");
    }
    if (password.length < 8) {
        throw new Error("Password harus lebih dari 8 character");
    }
    const hashPassword = await bcrpyt.hash(password, salt);
    const user = await prisma.users.create({
        data: {
            username,
            password: hashPassword,
            email
        }
    });
    delete user.password;
    const refresh = refreshToken(user);
    const access = accessToken(user);
    return { refresh, access };
}

export async function RefreshToken(refresh) {
    const verfiyToken = verifyRefreshToken(refresh);
    const access = accessToken(verfiyToken);
    return access;
}

