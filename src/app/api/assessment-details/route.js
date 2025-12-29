import { ValidateError } from "@/lib/errors/validateError";
import { createAsessmentDetail, getAsessmentDetails } from "@/lib/repository/asessmentDetails";

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
        const asessmentDetail = await createAsessmentDetail(token, body);
        return Response.json(asessmentDetail);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

export async function GET() {
    try {
        const asessmentDetails = await getAsessmentDetails();
        return Response.json(asessmentDetails);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}