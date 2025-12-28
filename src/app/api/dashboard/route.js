import { dashboard } from "@/lib/repository/dashboard";

export async function GET() {
    try {
        const res = await dashboard();
        return Response.json(res);
    } catch (err) {
        console.error(err);
    }
}