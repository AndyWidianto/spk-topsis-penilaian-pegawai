import { getPriodeLast } from "@/lib/repository/priodes";

export async function GET() {
    try {
        const priode = await getPriodeLast();
        return Response.json(priode);
    } catch (err) {
        console.error(err);
    }
}