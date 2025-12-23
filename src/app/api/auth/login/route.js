
export async function POST(req) {
    const { username, password } = await req.json();
    try {
        const login = "ere";
        return Response.status(200).json(login);
    } catch (err) {
        console.error(err);
    }
}