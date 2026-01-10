import { ValidateError } from "@/lib/errors/validateError";
import { deleteAsessment, updateAsessment } from "@/lib/repository/asessments";

export async function POST(req, { params }) {
    const body = await req.json();
    const { id } = await params;
    const auth = await req.headers.get("authorization");
    const ipAddress = await req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    try {
        const token = auth.split(" ")[1];
        const assessment = await updateAsessment(token, ipAddress, parseInt(id), body);
        return Response.json(assessment);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    const auth = await req.headers.get("authorization");
    const ipAddress = await req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    try {
        const token = auth.split(" ")[1];
        await deleteAsessment(token, ipAddress, parseInt(id));
        return Response.json({
            message: "Successfully delete assessments"
        })
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}