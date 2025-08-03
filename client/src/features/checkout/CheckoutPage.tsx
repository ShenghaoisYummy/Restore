import { Grid2, Typography } from "@mui/material";
import OrderSummary from "../../app/shared/components/OrderSummary";
import CheckoutStepper from "./CheckoutStepper";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import { useFetchBasketQuery } from "../../features/basket/basketApi";
import { useEffect, useMemo, useRef } from "react";
import { useCreatePaymentIntentMutation } from "./checkoutApi";
import { useAppSelector } from "../../app/store/store";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

//1. User visits /checkout
//    ↓
// 2. CheckoutPage component loads
//    ↓
// 3. useEffect runs → createPaymentIntent() called
//    ↓
// 4. API call to POST /api/payments → creates Stripe Payment Intent
//    ↓
// 5. onQueryStarted updates basket cache with clientSecret
//    ↓
// 6. options becomes valid → Stripe Elements can render
//    ↓
// 7. create.current = true → prevents future API calls

export default function CheckoutPage() {
  // fetch current client's basket
  const { data: basket } = useFetchBasketQuery();

  // get the trigger function and the isLoading state from the createPaymentIntent mutation
  const [createPaymentIntent, { isLoading: isCreatingPaymentIntent }] =
    useCreatePaymentIntentMutation();

  // create a ref to prevent multiple API calls
  const create = useRef(false);

  // get the boolean value of darkMode from the ui slice
  // it means if the current mode is dark, then the theme will be night,
  // otherwise it will be stripe, which is the default theme
  const { darkMode } = useAppSelector((state) => state.ui);

  // useEffect to call createPaymentIntent only once when the component mounts
  useEffect(() => {
    if (!create.current) {
      createPaymentIntent();
      create.current = true;
    }
  }, [createPaymentIntent]);

  // create stripe options for the client secret if it exists, if not return undefined
  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!basket?.clientSecret) return undefined;
    return {
      clientSecret: basket.clientSecret,
      appearance: {
        labels: "floating",
        theme: darkMode ? "night" : "stripe",
      },
    };
  }, [basket?.clientSecret, darkMode]);

  // if stripePromise or options are not defined, or the mutation is loading, show loading message
  // otherwise, render the checkout stepper
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={8}>
        {!stripePromise || !options || isCreatingPaymentIntent ? (
          <Typography variant="h3">Loading...</Typography>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutStepper />
          </Elements>
        )}
      </Grid2>
      <Grid2 size={4}>
        <OrderSummary />
      </Grid2>
    </Grid2>
  );
}
