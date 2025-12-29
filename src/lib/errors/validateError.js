import { AppError } from "./AppError";

export function ValidateError(err) {
    if (err instanceof AppError) {
        return Response.json({
            success: false,
            message: err.message
        }, { status: err.statusCode })
    }

    return Response.json(
        {
            success: false,
            code: "UNKNOWN_ERROR",
            message: "Internal Server Error"
        },
        { status: 500 }
    );
}