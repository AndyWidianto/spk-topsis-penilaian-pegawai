import { ValidateError } from "@/lib/errors/validateError";
import { getPriodeLastFinished } from "@/lib/repository/priodes";

export async function GET() {
    try {
        const priode = await getPriodeLastFinished();
        return Response.json(priode); 
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}