import { createAsessment, getAsessments } from "@/lib/repository/asessments";

export async function POST(req) {
    const body = await req.json();
    try {
        const assessment = await createAsessment(body);
        return Response.json(assessment);
    } catch (err) {
        console.error(err);
    }
}

export async function GET(req) {
    try {
        const assessments = await getAsessments();
        return Response.json(assessments);
    } catch (err) {
        console.error(err);
    }
}