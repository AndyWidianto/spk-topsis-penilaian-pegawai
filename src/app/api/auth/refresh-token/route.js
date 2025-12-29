import { RefreshToken } from "@/lib/repository/auth";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const Cookies = await cookies();
        const auth = Cookies.get("refreshToken");
        if (!auth) {
            return Response.json({
                message: "Anda belum login"
            }, 403);
        }
        const accessToken = await RefreshToken(auth.value);
        return Response.json({
            message: "Berhasil refresh Token",
            accessToken: accessToken
        });
    } catch (err) {
        console.error(err);
    }
}