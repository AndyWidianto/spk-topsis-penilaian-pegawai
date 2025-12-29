import { ValidateError } from "@/lib/errors/validateError";
import { createCriteria, getCriterias } from "@/lib/repository/criteria";


export async function POST(req) {
    const body = await req.json();
    const auth = await req.headers.get("authorization");
    if (!auth) {
        return Response.json({
            message: "Unathorization"
        }, { status: 401 });
    }
    try {
        const token = auth.split(" ")[1];
        const criteria = await createCriteria(token, body);
        return Response.json(criteria);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

export async function GET(req) {
    try {
        const criteria = await getCriterias();
        return Response.json(criteria);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}