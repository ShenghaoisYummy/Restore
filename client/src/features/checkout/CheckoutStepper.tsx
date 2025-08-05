import { useState } from "react";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Review from "./Review";
import {
  useFetchAddressQuery,
  useUpdateUserAddressMutation,
} from "../account/accountApi";
import { Address } from "../../app/models/user";
import {
  StripeAddressElementChangeEvent,
  StripePaymentElementChangeEvent,
  ConfirmationToken,
} from "@stripe/stripe-js";
import { useBasket } from "../../lib/hooks/useBasket";
import { currencyFormat } from "../../lib/util";
import { toast } from "react-toastify";

const steps = ["Address", "Payment", "Review"];
export default function CheckoutStepper() {
  /**
   * set state for active step
   * this is used to set the active step of the checkout stepper
   */
  const [activeStep, setActiveStep] = useState(0);
  /**
   * set the address completed state for the address element
   * this is used to check if the user has completed the address step
   */
  const [addressCompleted, setAddressCompleted] = useState(false);

  /**
   * set the payment completed state for the payment element
   * this is used to check if the user has completed the payment step
   */

  const [paymentCompleted, setPaymentCompleted] = useState(false);

  /*
   * fetch the user address
   * if data is undefined, set the default values to empty object
   * if data exists, extract 'name' separately
   * and put remaining address fields in 'restAddress'
   */

  const { data, isLoading } = useFetchAddressQuery();
  const { name, ...restAddress } = data || ({} as Address);

  /**
   * update the user address on the server side
   * use the useUpdateUserAddressMutation hook to update the address
   */
  const [updateAddress] = useUpdateUserAddressMutation();

  /**
   * set the save address checked state for the address element
   * this is used to check if the user wants to save the address
   */
  const [saveAddressChecked, setSaveAddressChecked] = useState(false);

  const [confirmationToken, setConfirmationToken] =
    useState<ConfirmationToken | null>(null);

  /**
   * get the elements from the useElements hook
   * this is used to get the address element from the stripe elements
   * and the payment element from the stripe elements
   */
  const elements = useElements();

  // get the stripe instance from the useStripe hook
  const stripe = useStripe();

  const { total } = useBasket();

  /**
   * handle next step function
   * if the active step is 0 and the save address checked is true,
   * get the stripe address from stripe address element
   * and update the address on the server side
   * then set the active step to the next step
   */

  const handleNext = async () => {
    if (activeStep === 0 && saveAddressChecked) {
      const address = await getStripeAddress();
      if (address) await updateAddress(address);
    }

    /**
     * if the active step is 1,
     * create a confirmation token from the stripe elements
     * and set the confirmation token to the state
     */

    if (activeStep === 1) {
      if (!elements || !stripe) return;
      const result = await elements.submit();
      if (result.error) return toast.error(result.error.message);

      const stripeResult = await stripe.createConfirmationToken({ elements });
      if (stripeResult.error) return toast.error(stripeResult.error.message);
      setConfirmationToken(stripeResult.confirmationToken);
    }
    setActiveStep((step) => step + 1);
  };

  const getStripeAddress = async () => {
    // get the address element from the stripe elements
    const addressElement = elements?.getElement("address");

    // if the address element is not found, return null
    if (!addressElement) return null;

    // destructure the value of the address element
    const {
      value: { name, address },
    } = await addressElement.getValue();

    // return destructured name and address , if the name and address are not found, return null
    if (name && address) return { name, ...address };
    return null;
  };

  // handle back step function
  const handleBack = () => {
    setActiveStep((step) => step - 1);
  };

  /**
   * handle address change function
   * this is used to check if the user has completed the address step
   */

  const handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    setAddressCompleted(event.complete);
  };

  /**
   * handle payment change function
   * this is used to check if the user has completed the payment step
   */
  const handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    setPaymentCompleted(event.complete);
  };

  if (isLoading) return <Typography variant="h3">Loading...</Typography>;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: activeStep === 0 ? "block" : "none" }}>
          <AddressElement
            options={{
              mode: "shipping",
              defaultValues: {
                name: name,
                address: restAddress,
              },
            }}
            onChange={handleAddressChange}
          />
          <FormControlLabel
            sx={{ display: "flex", justifyContent: "end" }}
            control={
              <Checkbox
                checked={saveAddressChecked}
                onChange={(e) => setSaveAddressChecked(e.target.checked)}
              />
            }
            label="save as default address"
          />
        </Box>

        <Box sx={{ display: activeStep === 1 ? "block" : "none" }}>
          <PaymentElement onChange={handlePaymentChange} />
        </Box>
        <Box sx={{ display: activeStep === 2 ? "block" : "none" }}>
          <Review confirmationToken={confirmationToken} />
        </Box>
      </Box>
      <Box display="flex" paddingTop={2} justifyContent={"space-between"}>
        <Button variant="contained" color="primary" onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={
            (activeStep === 0 && !addressCompleted) ||
            (activeStep === 1 && !paymentCompleted)
          }
        >
          {activeStep === steps.length - 1
            ? `Pay ${currencyFormat(total)}`
            : "Next"}
        </Button>
      </Box>
    </Paper>
  );
}
