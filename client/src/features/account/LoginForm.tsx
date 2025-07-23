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

export default function LoginForm() {
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
          width="100%"
          display="flex"
          flexDirection="column"
          gap={3}
          marginY={3}
        >
          <TextField fullWidth label="Email" type="email" />
          <TextField fullWidth label="Password" type="password" />
          <Button variant="contained" color="primary" type="submit">
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
