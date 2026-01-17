import { PrismaClient } from "@prisma/client";
import bcrpyt from "bcrypt";
import { accessToken, refreshToken, verifyAccessToken, verifyRefreshToken } from "./token.service";
import { AppError } from "../errors/AppError";

const prisma = new PrismaClient();

const salt = 10;

export async function Login(ip, { email, password }) {
    if (!email.trim()) {
        throw new AppError("username or email cannot be empty", 404);
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
        throw new AppError("Invalid email or password.", 404);
    }
    const isMatch = await bcrpyt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid email or password.", 404);
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
    await prisma.auditLogs.create({
        data: { 
            user_id: user.id, 
            user_role: user.role, 
            action: "LOGIN",
            entity: "auth",
            entity_id: user.id,
            ip_address: ip
        }
    })
    return { access, refresh };
}

export async function Register(ip, { username, email, password }) {
    if (!username.trim() || !email.trim()) {
        throw new AppError("username or email cannot be empty", 404);
    }
    if (password.length < 8) {
        throw new AppError("Password must be more than 8 characters.", 404);
    }
    const findEmail = await prisma.users.findFirst({
        where: { email }
    });
    if (findEmail) {
        throw new AppError("Email is Already", 419, { email: "Email is Already" });
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
    console.log(user);
    await prisma.users.update({
        where: {
            id: user.id
        },
        data: { refresh_token: refresh },
    });
    await prisma.auditLogs.create({
        data: { 
            user_id: user.id, 
            user_role: user.role, 
            action: "REGISTER",
            entity: "auth",
            entity_id: user.id,
            ip_address: ip
        }
    })
    return { refresh, access };
}

export async function RefreshToken(refresh) {
    if (!refresh) {
        throw new AppError("Refresh Token tidak tersedia", 403);
    }
    const verfiyToken = verifyRefreshToken(refresh);
    const user = await prisma.users.findFirst({ where: { id: verfiyToken.id }});
    if (user.refresh_token !== refresh) {
        throw new AppError("Refresh Token tidak cocok", 403);
    }
    const access = accessToken(user);
    return access;
}

