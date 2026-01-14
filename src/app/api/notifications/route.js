import { ValidateError } from "@/lib/errors/validateError";
import { getNotifications, updateReadNotifications } from "@/lib/repository/notifications";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || "all";
    const auth = await req.headers.get("authorization");
    if (!auth) return Response.json({ message: "Authorization" }, { status: 401 });
    try {
        const token = auth.split(" ")[1];
        const notifications = await getNotifications(token, limit);
        return Response.json(notifications);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

export async function PATCH(req) {
    const body = await req.json();
    try {
        const notifications = await updateReadNotifications(body);
        return Response.json(notifications);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}