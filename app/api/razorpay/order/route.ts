import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount, currency = "INR", receipt } = await request.json();

    if (!amount || typeof amount !== "number") {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay keys not configured" }, { status: 500 });
    }

    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const resp = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount, // in paise
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json({ error: data?.error || data }, { status: resp.status });
    }

    return NextResponse.json(data);
  } catch (e: unknown) {
    let message = "Unknown error";
    if (e instanceof Error) message = e.message;
    else if (typeof e === "string") message = e;

    return NextResponse.json({ error: message }, { status: 500 });
  }
}


