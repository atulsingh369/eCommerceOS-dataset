import { NextResponse } from "next/server";
import { AppError } from "./exceptions";
import { z } from "zod";
import { Result, isOk, isErr } from "./result";

type RouteHandler = (req: Request, ...args: any[]) => Promise<Response | Result<any, any>>;

export function apiHandler(handler: RouteHandler): (req: Request, ...args: any[]) => Promise<NextResponse> {
    return async (req: Request, ...args: any[]) => {
        try {
            const result = await handler(req, ...args);

            // Handle Result pattern
            if (result && typeof result === 'object' && 'ok' in result) {
                if (isOk(result)) {
                    return NextResponse.json(result.value);
                } else if (isErr(result)) {
                    throw result.error;
                }
            }

            // Handle standard Response object
            if (result instanceof Response) {
                return result as NextResponse;
            }

            // Fallback (shouldn't happen if properly typed)
            return NextResponse.json(result);

        } catch (error: any) {
            console.error("API Error:", error);

            if (error instanceof AppError) {
                return NextResponse.json(
                    { error: error.message, code: error.code },
                    { status: error.statusCode }
                );
            }

            if (error instanceof z.ZodError) {
                return NextResponse.json(
                    { error: "Validation Error", details: error.errors },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { error: "Internal Server Error" },
                { status: 500 }
            );
        }
    };
}
