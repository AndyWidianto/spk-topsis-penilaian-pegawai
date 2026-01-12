import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export function accessToken(user) {
  delete user.password;
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export function refreshToken(user) {
  delete user.password;
  const refresh = jwt.sign(user, process.env.REFRESH_JWT_SECRET, { expiresIn: '30d' });
  return refresh;
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Access token expired", 401);
    }

    throw new AppError("Invalid access token", 401);
  }
}

export function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
    console.log(decoded);
    return decoded;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("token expired error", 401);
    }
    throw new AppError("Invalid access token", 403);
  }
}


export async function JwtVerify(token) {
  const decode = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
  const user = await prisma.users.findUnique({ where: { id: decode.id } });
  console.log(user);
  if (user.refresh_token !== token) {
    throw new AppError("Refresh Token tidak cocok", 403);
  }
  return true;
}