import { NextResponse } from "next/server";
import { AppError } from "./exceptions";
import { z } from "zod";
import { Result, isOk, isErr } from "./result";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteHandler = (req: Request, ...args: any[]) => Promise<Response>;

export function apiHandler(handler: RouteHandler): RouteHandler {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (req: Request, ...args: any[]) => {
        try {
            return await handler(req, ...args);
        } catch (error: unknown) {
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
