import { deletePriode, getPriode, updatePriode } from "@/lib/repository/priodes";

export async function POST(req, { params }) {
    const { id } = await params;
    const body = await req.json();
    try {
        const priode = await updatePriode(id, body);
        return Response.json(priode);
    } catch (err) {
        console.error(err);
    }
}

export async function DELETE({ params }) {
    const { id } = await params;
    try {
        await deletePriode(id);
        return Response.json({
            message: "Berhasil delete"
        });
    } catch (err) {
        console.error(err);
    }
}

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        const priodes = await getPriode(parseInt(id));
        return Response.json(priodes);
    } catch (err) {
        console.error(err);
    }
}