import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { paymentId, orderId, signature } = body;

        if (!process.env.RAZORPAY_KEY_SECRET || !process.env.RAZORPAY_KEY_ID) {
            console.error("Missing Razorpay env variables");
            return NextResponse.json({ success: false, message: "Server config error" }, { status: 500 });
        }

        const expectedSig = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(orderId + "|" + paymentId)
            .digest("hex");

        if (expectedSig !== signature) {
            return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const payment = await instance.payments.fetch(paymentId);

        if (payment.status !== "captured") {
            return NextResponse.json({ success: false, message: "Payment not captured" }, { status: 400 });
        }

        return NextResponse.json({ success: true, payment }, { status: 200 });

    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ success: false, error: "Error verifying payment" }, { status: 500 });
    }
}
