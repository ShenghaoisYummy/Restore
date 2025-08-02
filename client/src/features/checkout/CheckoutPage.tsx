import { Grid2, Typography } from "@mui/material";
import OrderSummary from "../../app/shared/components/OrderSummary";
import CheckoutStepper from "./CheckoutStepper";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import { useFetchBasketQuery } from "../../features/basket/basketApi";
import { useMemo } from "react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function CheckoutPage() {
  // fetch current client's basket
  const { data: basket } = useFetchBasketQuery();

  // create stripe options for the client secret if it exists, if not return undefined
  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!basket?.clientSecret) return undefined;
    return {
      clientSecret: basket.clientSecret,
    };
  }, [basket?.clientSecret]);

  // if stripePromise or options are not defined, show loading message
  // otherwise, render the checkout stepper
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={8}>
        {!stripePromise || !options ? (
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
