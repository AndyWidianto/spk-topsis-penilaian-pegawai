import { ValidateError } from "@/lib/errors/validateError";
import { createPriode, getPriodes } from "@/lib/repository/priodes";

export async function POST(req) {
    const body = await req.json();
    const auth = await req.headers.get("authorization");
    if (!auth) {
        return Response.json({
            message: "unauthorization",
        }, { status: 401 });
    }
    try {
        const token = auth.split(" ")[1];
        const priode = await createPriode(token, body);
        return Response.json(priode);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
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