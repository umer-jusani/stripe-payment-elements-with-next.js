"use client";
import React, { useEffect, useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { convertToSubcurrency } from '@/lib/convertCurr';

const CheckoutPage = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements()
    const [errorMessage, setErrorMessage] = useState()
    const [clientSecret, setClientSecret] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount) })
        }).then((res) => res.json()).then((data) => setClientSecret(data.clientSecret))
    }, [amount])

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            return;
        }

        const { error: submitError } = await elements.submit()

        if (submitError) {
            setErrorMessage(submitError.message)
            setLoading(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `http://www.localhost:3000/payment-success?amount=${amount}`
            }
        })

        if (error) {
            setErrorMessage(submitError.message)
            setLoading(false);
            return;
        }

    }

    return (
        <form onSubmit={handleSubmit}>
            {clientSecret && <PaymentElement />}
            <button type='submit'>Pay</button>
        </form>
    )
}

export default CheckoutPage
