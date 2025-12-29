import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";

export function accessToken({ id, email, username }) {
    const payload = { id, email, username };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '17m' });
}

export function refreshToken({ id, email, username }) {
    const payload = { id, email, username };
    const refresh = jwt.sign(payload, process.env.REFRESH_JWT_SECRET, { expiresIn: '30d' });
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