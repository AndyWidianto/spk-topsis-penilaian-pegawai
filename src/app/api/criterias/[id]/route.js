import { ValidateError } from "@/lib/errors/validateError";
import { deleteCriteria, getCriteria, updateCriteria } from "@/lib/repository/criteria";


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
        const criteria = await updateCriteria(token, parseInt(id), body);
        return Response.json(criteria);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        const criteria = await getCriteria(parseInt(id));
        return Response.json(criteria);
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
        await deleteCriteria(token, parseInt(id));
        return Response.json({
            message: "berhasil delete criteria"
        });
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}