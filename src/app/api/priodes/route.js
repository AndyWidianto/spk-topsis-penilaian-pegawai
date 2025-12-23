import { createPriode, getPriodes } from "@/lib/priodes";

export async function POST(req) {
    const body = await req.json();
    try {
        const priode = await createPriode(body);
        return Response.json(priode);
    } catch (err) {
        console.error(err);
    }
}

export async function GET() {
    try {
        const priodes = await getPriodes();
        return Response.json(priodes);
    } catch (err) {
        console.error(err);
    }
}