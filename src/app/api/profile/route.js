import { ValidateError } from "@/lib/errors/validateError";
import { getProfile, updateProfile } from "@/lib/repository/users";

export async function GET(req) {
    const auth = await req.headers.get("authorization");
    if (!auth) {
        return Response.json({ message: "Authorization" }, { status: 401 });
    }
    try {
        const token = auth.split(" ")[1];
        const profile = await getProfile(token);
        return Response.json(profile);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

export async function POST(req) {
    const auth = await req.headers.get("authorization");
    const body = await req.json();
    if (!auth) {
        return Response.json({ message: "Authorization" }, { status: 401 });
    }
    try {
        const token = auth.split(" ")[1];
        const accessToken = await updateProfile(token, body);
        return Response.json({
            accessToken
        });
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}