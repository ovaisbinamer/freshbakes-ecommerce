import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
// Initialize Stripe with your secret key
const stripe = new Stripe("sk_test_51TCTEeGkEX9ADNoH1jMJfOgpKjB8Tav3WlDEik8ZivPyXa1cp6lkIs5aTB8a85h0cAHTxM7weyZ1iiuMVIyW7dMK00v8hOhwr6", {
  apiVersion: "2023-10-16" as any,
});

export async function POST(request: Request) {
  try {
    // 1. Get the cart data sent from the frontend
    const body = await request.json();
    const { cart } = body;

    // 2. Format the cart items for Stripe
    const lineItems = cart.map((item: any) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image], // Shows your beautiful bakery images on the checkout page!
          },
          unit_amount: Math.round(item.price * 100), // Stripe calculates in cents (e.g., $5.50 = 550)
        },
        quantity: item.quantity,
      };
    });

    // 3. Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      // If successful, send them to your success page. If canceled, back to the cart.
      success_url: `${request.headers.get("origin")}/success`,
      cancel_url: `${request.headers.get("origin")}/cart`,
    });

    // 4. Send the secure Stripe URL back to the frontend
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}