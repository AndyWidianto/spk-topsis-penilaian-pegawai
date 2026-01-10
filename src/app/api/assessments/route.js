import { ValidateError } from "@/lib/errors/validateError";
import { createAsessment, getAsessments } from "@/lib/repository/asessments";

export async function POST(req) {
    const body = await req.json();
    const auth = await req.headers.get("authorization");
    const ipAddress = await req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!auth) {
        return Response.json({
            message: "Unauhtorization"
        }, { status: 401 });
    }
    try {
        const token = auth.split(" ")[1];
        const assessment = await createAsessment(token, ipAddress, body);
        return Response.json(assessment);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

export async function GET(req) {
    try {
        const assessments = await getAsessments();
        return Response.json(assessments);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}