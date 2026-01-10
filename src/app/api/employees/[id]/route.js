import { ValidateError } from "@/lib/errors/validateError";
import { deleteEmployee, GetEmployee, updateEmployee } from "@/lib/repository/employee";

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        const employee = await GetEmployee(id);
        return Response.json(employee);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

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
        const employee = await updateEmployee(token, ipAddress, parseInt(id), body);
        return Response.json(employee);
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
        await deleteEmployee(token, ipAddress, parseInt(id));
        return Response.json({
            message: "Berhasil mengapus employee"
        })
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}