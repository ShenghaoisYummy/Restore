import { Typography } from "@mui/material";
import { Order } from "../../app/models/order";
import { useLocation } from "react-router-dom";

export default function CheckoutSuccess() {
  const { state } = useLocation();
  const order = state as Order;
  return <Typography variant="h3">{JSON.stringify(order, null, 2)}</Typography>;
}
