import { ValidateError } from "@/lib/errors/validateError";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const Cookies = await cookies();
        Cookies.delete("refreshToken");
        return Response.json({
            message: "Berhasil Logout",
        });
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}