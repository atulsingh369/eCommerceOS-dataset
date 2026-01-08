import { currency } from "@/lib/utils";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const { amount } = await request.json();

        const options = {
            amount,
            currency,
            receipt: "receipt_devstudios_" + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json({ error: "Error creating order" }, { status: 500 });
    }
}
