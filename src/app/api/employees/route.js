import { ValidateError } from "@/lib/errors/validateError";
import { CreateEmployee, GetEmployees } from "@/lib/repository/employee";

export async function POST(req) {
    const body = await req.json();
    const auth = await req.headers.get("authorization");
    if (!auth) {
        return Response.json({
            message: "Unathorization"
        }, { status: 401 });
    }
    try {
        const token = auth.split(" ")[1];
        const employee = await CreateEmployee(token, body);
        return Response.json(employee);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

export async function GET(req) {
    try {
        const employees = await GetEmployees();
        return Response.json(employees);
    } catch (err) {
        console.error(err);
        return ValidateError(err);
    }
}

