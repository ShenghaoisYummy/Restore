import { Box, Button, Typography } from "@mui/material";
import { Order } from "../../app/models/order";
import { Link, useLocation } from "react-router-dom";
import { Container, Paper, Divider } from "@mui/material";
import { addressString, currencyFormat, paymentString } from "../../lib/util";

export default function CheckoutSuccess() {
  /**
   * use useLocation to get the state object passed through
   * React Router navigation, state object contains the order data
   * and then tell typescript that the state is an Order object
   */
  const { state } = useLocation();
  const order = state.data as Order;

  if (!order) return <Typography variant="h3">Order not found</Typography>;

  /**
   *
   * Browser Layout Structure:
   *
   * ┌─────────────────────────────────────────────────────────────┐
   * │                    Container (md width)                     │
   * │  ┌───────────────────────────────────────────────────────┐  │
   * │  │              Thanks for your fake order              │  │ ← h4 heading
   * │  └───────────────────────────────────────────────────────┘  │
   * │  ┌───────────────────────────────────────────────────────┐  │
   * │  │     Your order #123 has been placed successfully     │  │ ← body1 text
   * │  └───────────────────────────────────────────────────────┘  │
   * │  ┌───────────────────────────────────────────────────────┐  │
   * │  │                    Paper Card                         │  │
   * │  │  ┌─────────────────┬─────────────────────────────────┐ │  │
   * │  │  │ Order date      │           2024-01-15            │ │  │ ← Row 1
   * │  │  └─────────────────┴─────────────────────────────────┘ │  │
   * │  │  ─────────────────────────────────────────────────────  │  │ ← Divider
   * │  │  ┌─────────────────┬─────────────────────────────────┐ │  │
   * │  │  │ Payment method  │    Visa ending in 4242         │ │  │ ← Row 2
   * │  │  └─────────────────┴─────────────────────────────────┘ │  │
   * │  │  ─────────────────────────────────────────────────────  │  │ ← Divider
   * │  │  ┌─────────────────┬─────────────────────────────────┐ │  │
   * │  │  │ Shipping address│    John Doe                     │ │  │ ← Row 3
   * │  │  │                 │    123 Main St                  │ │  │
   * │  │  │                 │    City, State 12345            │ │  │
   * │  │  └─────────────────┴─────────────────────────────────┘ │  │
   * │  │  ─────────────────────────────────────────────────────  │  │ ← Divider
   * │  │  ┌─────────────────┬─────────────────────────────────┐ │  │
   * │  │  │ Amount          │            $99.99               │ │  │ ← Row 4
   * │  │  └─────────────────┴─────────────────────────────────┘ │  │
   * │  └───────────────────────────────────────────────────────┘  │
   * │  ┌───────────────────────────────────────────────────────┐  │
   * │  │  [View order]  [Continue Shopping]                   │  │ ← Button row
   * │  │   (contained)      (outlined)                        │  │
   * │  └───────────────────────────────────────────────────────┘  │
   * └─────────────────────────────────────────────────────────────┘
   */
  return (
    <Container maxWidth="md">
      <>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Thanks for your fake order
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Your order<strong>{order.id}</strong> has been placed successfully.
        </Typography>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
              Order date
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {order.orderDate}
            </Typography>
          </Box>
          <Divider />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
              Payment method
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {paymentString(order)}
            </Typography>
          </Box>
          <Divider />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
              Shipping address
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {addressString(order)}
            </Typography>
          </Box>
          <Divider />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
              Amount
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {currencyFormat(order.total)}
            </Typography>
          </Box>
        </Paper>
        <Box display="flex" justifyContent="flex-start" gap={2}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/orders/${order.id}`}
          >
            View order
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/catalog"
          >
            Continue Shopping
          </Button>
        </Box>
      </>
    </Container>
  );
}
