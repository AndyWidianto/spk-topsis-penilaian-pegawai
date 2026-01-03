import { PrismaClient } from "@prisma/client";
import bcrpyt from "bcrypt";
import { accessToken, refreshToken, verifyAccessToken, verifyRefreshToken } from "./token.service";
import { AppError } from "../errors/AppError";

const prisma = new PrismaClient();

const salt = 10;

export async function Login({ email, password }) {
    if (!email.trim()) {
        throw new AppError("username atau email tidak boleh kosong", 404);
    }
    const user = await prisma.users.findFirst({
        where: {
            OR: [
                { email: email },
                { username: email }
            ]
        }
    });
    if (!user) {
        throw new AppError("Email atau Username tidak tersedia", 404);
    }
    const isMatch = await bcrpyt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Password salah", 404);
    }
    delete user.password;
    delete user.refresh_token;
    const refresh = refreshToken(user);
    const access = accessToken(user);
    await prisma.users.update({
        where: {
            id: user.id
        },
        data: { refresh_token: refresh },
    });
    return { access, refresh };
}

export async function Register({ username, email, password }) {
    if (!username.trim() || !email.trim()) {
        throw new AppError("Username atau Email tidak boleh kosong", 404);
    }
    if (password.length < 8) {
        throw new AppError("Password harus lebih dari 8 character", 404);
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
    await prisma.users.update({
        where: {
            id: user.id
        },
        data: { refresh_token: refresh },
    });
    return { refresh, access };
}

export async function RefreshToken(refresh) {
    if (!refresh) {
        throw new AppError("Refresh Token tidak tersedia", 403);
    }
    const verfiyToken = verifyRefreshToken(refresh);
    const user = await prisma.users.findFirst({ where: { id: verfiyToken.id }});
    console.log("user Token: ", user);
    console.log("Token: ", refresh);
    if (user.refresh_token !== refresh) {
        throw new AppError("Refresh Token tidak cocok", 403);
    }
    const access = accessToken(verfiyToken);
    return access;
}

