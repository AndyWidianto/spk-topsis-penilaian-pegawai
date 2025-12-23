import { createCriteria, getCriterias } from "@/lib/criteria";


export async function POST(req) {
    const body = await req.json();
    try {
        const criteria = await createCriteria(body);
        return Response.json(criteria);
    } catch (err) {
        console.error(err);
    }
}

export async function GET(req) {
    try {
        const criteria = await getCriterias();
        return Response.json(criteria);
    } catch (err) {
        console.error(err);
    }
}