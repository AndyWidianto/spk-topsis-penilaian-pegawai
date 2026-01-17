import { AppError } from "./AppError";

export function ValidateError(err) {
    if (err instanceof AppError) {
        if (!err.details) {
            return Response.json({
                success: false,
                message: err.message
            }, { status: err.statusCode })
        }
        console.log(err);
        return Response.json(err.details, { status: err.statusCode })
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