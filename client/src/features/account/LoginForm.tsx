import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "../../lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLazyUserInfoQuery, useLoginMutation } from "./accountApi";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [login, { isLoading }] = useLoginMutation();
  const location = useLocation();

  // get the fetchUserInfo function from the useLazyUserInfoQuery hook
  // this function is used to fetch the user info from the api
  // it is a lazy query, so it will not be executed until we call it
  // we need to call it after the login is successful
  // to get the user info and store it in the redux store
  const [fetchUserInfo] = useLazyUserInfoQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: LoginSchema) => {
    try {
      await login(data).unwrap();
      await fetchUserInfo().unwrap();
      navigate(location.state?.from || "/catalog");
    } catch (error) {
      console.log(error);
    }
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
        <Typography variant="h5">Login</Typography>
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
            disabled={isLoading}
            variant="contained"
            color="primary"
            type="submit"
          >
            Login
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <Typography component={Link} href="/register" color="primary">
              Register
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
