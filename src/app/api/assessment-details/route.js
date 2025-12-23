import { createAsessmentDetail, getAsessmentDetails } from "@/lib/asessmentDetails";

export async function POST(req) {
    const body = await req.json();

    try {
        const asessmentDetail = await createAsessmentDetail(body);
        return Response.json(asessmentDetail);
    } catch (err) {
        console.error(err);
    }
}

export async function GET() {
    try {
        const asessmentDetails = await getAsessmentDetails();
        return Response.json(asessmentDetails);
    } catch (err) {
        console.error(err);
    }
}