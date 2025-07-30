import { useRegisterMutation } from "./accountApi";
import { useForm } from "react-hook-form";
import {
  registerSchema,
  RegisterSchema,
} from "../../lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";

function RegisterForm() {
  // get the register trigger function
  // from the useRegisterMutation hook RTK Query
  // in the accountApi reducer

  const [registerUser] = useRegisterMutation();

  // get register, handleSubmit, errors, isValid from the useForm hook
  // register is used to register the fields in the form
  // handleSubmit is used to handle the form submission

  /* Form submission flow:

      // 1. handleSubmit runs first:
         handleSubmit first validates the form data using zodResolver.
         If validation passes, it calls onSubmit with the clean data.
         If validation fails, it displays errors without calling onSubmit.
         
      // 2. onSubmit runs:
         The onSubmit function then takes the validated data and 
         passes it to registerUser to complete registration. 
      */

  // errors is used to get the errors from the form
  // isValid is used to check if the form is valid
  // <RegisterSchema> is the type of the form data for the compile time type checking
  // zodResolver is used to integrate the Zod schema with react-hook-form
  // registerSchema defines validation rules for email and password fields

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isLoading },
  } = useForm<RegisterSchema>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
  });

  // onSubmit is the function that is triggered when the form is submitted
  // data is the form data
  // registerUser is the trigger function for the register mutation

  const onSubmit = async (data: RegisterSchema) => {
    await registerUser(data);
  };

  return (
    <Container component={Paper} maxWidth="sm" sx={{ borderRadius: 4, p: 4 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop="8"
      >
        <LockOutlined sx={{ mt: 3, color: "secondary.main", fontSize: 40 }} />
        <Typography variant="h5">Register</Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          width="100%"
          display="flex"
          flexDirection="column"
          gap={3}
          marginY={3}
        >
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            disabled={isLoading || !isValid}
            variant="contained"
            color="primary"
            type="submit"
          >
            Register
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Typography component={Link} href="/login" color="primary">
              Login
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
export default RegisterForm;
