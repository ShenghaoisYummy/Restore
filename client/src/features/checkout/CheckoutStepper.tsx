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
} from "@stripe/react-stripe-js";
import Review from "./Review";
import {
  useFetchAddressQuery,
  useUpdateUserAddressMutation,
} from "../account/accountApi";
import { Address } from "../../app/models/user";

const steps = ["Address", "Payment", "Review"];
export default function CheckoutStepper() {
  // set state for active step
  const [activeStep, setActiveStep] = useState(0);

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

  /**
   * get the elements from the useElements hook
   * this is used to get the address element from the stripe elements
   * and the payment element from the stripe elements
   */
  const elements = useElements();

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
          <PaymentElement />
        </Box>
        <Box sx={{ display: activeStep === 2 ? "block" : "none" }}>
          <Review />
        </Box>
      </Box>
      <Box display="flex" paddingTop={2} justifyContent={"space-between"}>
        <Button variant="contained" color="primary" onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Paper>
  );
}
