import { ValidateError } from "@/lib/errors/validateError";
import { CalculateTopsisManual, CalculateTopsisOtomatis } from "@/lib/repository/calculateEmployeeScore";

export async function POST(req) {
    const auth = await req.headers.get("authorization");
    const { priode_id } = await req.json();
    const ipAddress = await req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    try {
        if (!auth) {
            return Response.json({
                message: "Unauthorization"
            }, { status: 401 });
        }
        const token = auth.split(" ")[1];
        const res = await CalculateTopsisManual(token, ipAddress, priode_id);
        return Response.json({
            message: "Proses Selesai",
            data: res
        });
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

export async function GET(req) {
    const auth = await req.headers.get("x-vercel-cron");
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    try {
        if (!auth) {
            return Response.json({
                message: "Unauthorization"
            }, { status: 401 });
        }
        if (now.getDate() !== 1) {
            return Response.json({ message: "Belum waktunya berubah" }, { status: 200 });
        }
        const res = await CalculateTopsisOtomatis(now.getMonth() + 1, now.getFullYear());
        return Response.json({
            message: "Proses Selesai",
            data: res
        });
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}