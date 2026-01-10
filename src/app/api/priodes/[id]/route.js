import { ValidateError } from "@/lib/errors/validateError";
import { deletePriode, getPriode, updatePriode } from "@/lib/repository/priodes";

export async function POST(req, { params }) {
    const { id } = await params;
    const body = await req.json();
    const auth = await req.headers.get("authorization");
    const ipAddress = await req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!auth) {
        return Response.json({
            message: "Unathorization"
        }, { status: 401 });
    }
    try {
        const token = auth.split(" ")[1];
        const priode = await updatePriode(token, ipAddress, Number(id), body);
        return Response.json(priode);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    const auth = await req.headers.get("authorization");
    const ipAddress = await req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!auth) {
        return Response.json({
            message: "Unathorization"
        }, { status: 401 });
    }
    try {
        const token = auth.split(" ")[1];
        await deletePriode(token, ipAddress, Number(id));
        return Response.json({
            message: "Berhasil delete"
        });
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        const priodes = await getPriode(parseInt(id));
        return Response.json(priodes);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}