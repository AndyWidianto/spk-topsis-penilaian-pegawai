import { CountingProses } from "@/lib/repository/calculateEmployeeScore";

export async function POST(req) {
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
        const res = await CountingProses(now.getMonth(), now.getFullYear());
        return Response.json({
            message: "Proses Selesai",
            data: res
        });
    } catch (err) {
        console.error(err);
    }
}