import { NextResponse } from "next/server";
import { AppError } from "./exceptions";
import { z } from "zod";

type RouteHandler = (req: Request, ...args: any[]) => Promise<Response>;

export function apiHandler(handler: RouteHandler): RouteHandler {
    return async (req: Request, ...args: any[]) => {
        try {
            return await handler(req, ...args);
        } catch (error: any) {
            console.error("API Error:", error);

            if (error instanceof AppError) {
                return NextResponse.json(
                    { error: error.message },
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
