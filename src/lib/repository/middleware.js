import jwt from "jsonwebtoken";

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
    const decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
    return decoded;
}