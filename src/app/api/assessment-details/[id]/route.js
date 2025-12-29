import { ValidateError } from "@/lib/errors/validateError";
import { deleteAsessmentDetail, updateAsessmentDetail } from "@/lib/repository/asessmentDetails";


export async function POST(req, { params }) {
    const { id } = await params;
    const body = await req.json();
    const auth = await req.headers.get("authorization");
    if (!auth) {
        return Response.json({
            message: "Unathorization"
        }, { status: 401 });
    }
    try {
        const token = auth.split(" ")[1];
        const asessmentDetail = await updateAsessmentDetail(token, id, body);
        return Response.json(asessmentDetail);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    const auth = await req.headers.get("authorization");
    if (!auth) {
        return Response.json({
            message: "Unathorization"
        }, { status: 401 });
    }
    try {
        const token = auth.split(" ")[1];
        await deleteAsessmentDetail(token, id);
        return Response.json({
            message: "Berhasil delete"
        });
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}