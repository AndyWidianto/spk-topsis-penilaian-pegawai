import { CreateEmployee, GetEmployees } from "@/lib/employee";

export async function POST(req) {
    const body = await req.json();
    const employee = await CreateEmployee(body);
    return Response.json(employee);
}

export async function GET(req) {
    const employees = await GetEmployees();
    return Response.json(employees);
}

