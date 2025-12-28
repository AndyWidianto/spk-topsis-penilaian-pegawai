import { deleteAsessment, updateAsessment } from "@/lib/repository/asessments";

export async function POST(req, { params }) {
    const body = await req.json();
    const { id } = await params;
    try {
        const assessment = await updateAsessment(parseInt(id), body);
        return Response.json(assessment);
    } catch (err) {
        console.error(err);
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    try {
        await deleteAsessment(parseInt(id));
        return Response.json({
            message: "Berhasil delete"
        })
    } catch (err) {
        console.error(err);
    }
}