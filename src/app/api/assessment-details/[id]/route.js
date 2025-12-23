import { deleteAsessmentDetail, updateAsessmentDetail } from "@/lib/asessmentDetails";


export async function POST(req, { params }) {
    const { id } = await params;
    const body = await req.json();
    try {
        const asessmentDetail = await updateAsessmentDetail(id, body);
        return Response.json(asessmentDetail);
    } catch (err) {
        console.error(err);
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    try {
        await deleteAsessmentDetail(id);
        return Response.json({
            message: "Berhasil delete"
        });
    } catch (err) {
        console.error(err);
    }
}