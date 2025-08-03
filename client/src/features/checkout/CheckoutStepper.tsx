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
} from "@mui/material";
import { AddressElement, PaymentElement } from "@stripe/react-stripe-js";
import Review from "./Review";

const steps = ["Address", "Payment", "Review"];
export default function CheckoutStepper() {
  // set state for active step
  const [activeStep, setActiveStep] = useState(0);

  // handle next step function
  const handleNext = () => {
    setActiveStep((step) => step + 1);
  };

  // handle back step function
  const handleBack = () => {
    setActiveStep((step) => step - 1);
  };

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
            }}
          />
          <FormControlLabel
            sx={{ display: "flex", justifyContent: "end" }}
            control={<Checkbox />}
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
