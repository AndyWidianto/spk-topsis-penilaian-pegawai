import { ValidateError } from "@/lib/errors/validateError";
import { Register } from "@/lib/repository/auth";
import { cookies } from "next/headers";

export async function POST(req) {
    const body = await req.json();
    const ipAddress = await req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    try {
        const { access, refresh } = await Register(ipAddress, body);
        const setCookies = await cookies();
        setCookies.set("refreshToken", refresh, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24
        })
        return Response.json({
            message: "Berhasil Register",
            accessToken: access
        });
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}