import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "../../data/products";

// Initialize Stripe with secret key, prioritizing environment variables
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51TCTEeGkEX9ADNoH1jMJfOgpKjB8Tav3WlDEik8ZivPyXa1cp6lkIs5aTB8a85h0cAHTxM7weyZ1iiuMVIyW7dMK00v8hOhwr6",
  {
    apiVersion: "2023-10-16" as any,
  }
);

export async function POST(request: Request) {
  try {
    // 1. Get and validate the cart data sent from the frontend
    const body = await request.json();
    const { cart } = body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "Cart must be a non-empty array." },
        { status: 400 }
      );
    }

    // 2. Format the cart items using authoritative server-side prices to prevent price tampering
    const lineItems = [];

    for (const item of cart) {
      const product = products.find(
        (p) => p.id === item.id || String(p.id) === String(item.id)
      );

      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.id} not found.` },
          { status: 400 }
        );
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity || 1,
      });
    }

    // 3. Add line item for $5.00 delivery fee
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Bakery Delivery",
        },
        unit_amount: 500,
      },
      quantity: 1,
    });

    // 4. Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.headers.get("origin")}/success`,
      cancel_url: `${request.headers.get("origin")}/cart`,
    });

    // 5. Send the secure Stripe URL back to the frontend
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json(
      { error: error?.message || "An error occurred while processing checkout." },
      { status: 500 }
    );
  }
}