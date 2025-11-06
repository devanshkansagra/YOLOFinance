import Stripe from "stripe";

export async function makePayment(paymentDetails: any) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const { amount, name } = paymentDetails;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: name,
          },
          unit_amount: amount * 100,
        },
    quantity: 1,
      },
    ],
    success_url: process.env.ORIGIN + `/success?sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: "http://localhost:5173/cancel",
    metadata: paymentDetails
  });

  return session;
}
