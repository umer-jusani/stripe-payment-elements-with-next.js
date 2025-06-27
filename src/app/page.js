"use client";
import { convertToSubcurrency } from "@/lib/convertCurr";
import styles from "./page.module.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "@/components/CheckoutPage";


if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY == undefined) {
  throw new Error("process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)


export default function Home() {
  const amount = 49.99;

  return (
    <div className={styles.page}>
      asds
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "usd"
        }}
      >
        <CheckoutPage amount={amount} />
      </Elements>

    </div>
  );
}
