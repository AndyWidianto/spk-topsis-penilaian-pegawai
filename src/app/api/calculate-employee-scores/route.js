import { CountingProses } from "@/lib/calculateEmployeeScore";

export async function POST(req) {
    const body = await req.json();
    try {
        const res = await CountingProses(body);
        return Response.json({
            message: "Proses Selesai",
            data: res
        });
    } catch (err) {
        console.error(err);
    }
}