import { ValidateError } from "@/lib/errors/validateError";
import { deleteAsessment, updateAsessment } from "@/lib/repository/asessments";

export async function POST(req, { params }) {
    const body = await req.json();
    const { id } = await params;
    const auth = await req.headers.get("authorization");
    try {
        console.log("Authorizatio: ", auth);
        const token = auth.split(" ")[1];
        const assessment = await updateAsessment(token, parseInt(id), body);
        return Response.json(assessment);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    const auth = await req.headers.get("authorization");
    try {
        const token = auth.split(" ")[1];
        await deleteAsessment(token, parseInt(id));
        return Response.json({
            message: "Berhasil delete"
        })
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}