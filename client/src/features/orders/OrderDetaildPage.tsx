import {
  Box,
  Divider,
  TableRow,
  Table,
  TableBody,
  TableContainer,
  Typography,
  TableCell,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useFetchOrderDetailedQuery } from "./orderApi";
import { Card } from "@mui/material";
import { Button } from "@mui/material";
import { format } from "date-fns";
import { addressString, currencyFormat, paymentString } from "../../lib/util";

export default function OrderDetaildPage() {
  // extract the order id from the current route
  const { id } = useParams();

  // +id! is a type assertion to tell typescript that the id is a number
  // ! is a non-null assertion operator to tell typescript that the id is not null
  const { data: order, isLoading } = useFetchOrderDetailedQuery(+id!);

  if (isLoading) return <Typography variant="h3">Loading order...</Typography>;
  if (!order) return <Typography variant="h3">Order not found</Typography>;

  return (
    <Card sx={{ p: 2, maxWidth: "md", mx: "auto" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" align="center">
          Order summary for #{order.id}
        </Typography>
        <Button component={Link} to="/orders" variant="outlined">
          Back to orders
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box>
        <Typography variant="h6" fontWeight="bold">
          Billing and deliver information
        </Typography>
        <Box component="dl">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Shipping address
          </Typography>
          <Typography component="dd" variant="body1">
            {addressString(order)}
          </Typography>
        </Box>

        <Box component="dl">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Payment info
          </Typography>
          <Typography component="dd" variant="body1">
            {paymentString(order)}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box>
        <Typography variant="h6" fontWeight="bold">
          Order details
        </Typography>
        <Box component="dl">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Email address
          </Typography>
          <Typography component="dd" variant="body1">
            {order.buyerEmail}
          </Typography>
        </Box>

        <Box component="dl">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Order status
          </Typography>
          <Typography component="dd" variant="body1">
            {order.status}
          </Typography>
        </Box>

        <Box component="dl">
          <Typography component="dt" variant="subtitle1" fontWeight="500">
            Order date
          </Typography>
          <Typography component="dd" variant="body1">
            {format(order.orderDate, "MM/dd/yyyy")}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <TableContainer>
        <Table>
          <TableBody>
            {order.orderItems.map((item) => (
              <TableRow
                key={item.productId}
                sx={{ borderBottom: "1px solid #e0e0e0" }}
              >
                <TableCell sx={{ py: 4 }}>
                  <Box display="flex" alignItems="center">
                    <img
                      src={item.pictureUrl}
                      alt={item.name}
                      style={{ height: 40, width: 40 }}
                    />
                    <Typography variant="body1" fontWeight="bold">
                      {item.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ p: 4 }}>
                  x {item.quantity}
                </TableCell>
                <TableCell align="right" sx={{ p: 4 }}>
                  {currencyFormat(item.price * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box component="dl" display="flex" justifyContent="space-between">
        <Typography component="dt" variant="subtitle1" fontWeight="500">
          Subtotal
        </Typography>
        <Typography component="dd" variant="body1">
          {currencyFormat(order.subtotal)}
        </Typography>
      </Box>

      <Box component="dl" display="flex" justifyContent="space-between">
        <Typography component="dt" variant="subtitle1" fontWeight="500">
          Discount
        </Typography>
        <Typography component="dd" variant="body1" color="green">
          {currencyFormat(order.discount)}
        </Typography>
      </Box>

      <Box component="dl" display="flex" justifyContent="space-between">
        <Typography component="dt" variant="subtitle1" fontWeight="500">
          Delivery fee
        </Typography>
        <Typography component="dd" variant="body1">
          {currencyFormat(order.deliveryFee)}
        </Typography>
      </Box>
      <Box component="dl" display="flex" justifyContent="space-between">
        <Typography component="dt" variant="subtitle1" fontWeight="500">
          Total
        </Typography>
        <Typography component="dd" variant="body2" fontWeight="700">
          {currencyFormat(order.total)}
        </Typography>
      </Box>
    </Card>
  );
}
