import { deleteCriteria, getCriteria, updateCriteria } from "@/lib/repository/criteria";


export async function POST(req, { params }) {
    const { id } = await params;
    const body = await req.json();
    try {
        const criteria = await updateCriteria(parseInt(id), body);
        return Response.json(criteria);
    } catch (err) {
        console.error(err);
    }
}

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        const criteria = await getCriteria(parseInt(id));
        return Response.json(criteria);
    } catch (err) {
        console.error(err);
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    try {
        await deleteCriteria(parseInt(id));
        return Response.json({
            message: "berhasil delete criteria"
        });
    } catch (err) {
        console.error(err);
    }
}