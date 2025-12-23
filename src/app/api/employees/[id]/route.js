import { deleteEmployee, GetEmployee, updateEmployee } from "@/lib/employee";

export async function GET(req, { params }) {
    const { id } = await params;
    console.log(id);
    const employee = await GetEmployee(id);
    return Response.json(employee);
}

export async function POST(req, { params }) {
    const { id } = await params;
    const body = await req.json();
    try {
        const employee = await updateEmployee(parseInt(id), body);
        return Response.json(employee);
    } catch (err) {
        console.error(err);
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    try {
        await deleteEmployee(parseInt(id));
        return Response.json({
            message: "Berhasil mengapus employee"
        })
    } catch (err) {
        console.error(err);
    }
}