import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useFetchBasketQuery } from "../basket/basketApi";
import { currencyFormat } from "../../lib/util";
import { ConfirmationToken } from "@stripe/stripe-js";

interface Props {
  confirmationToken: ConfirmationToken | null;
}

export default function Review({ confirmationToken }: Props) {
  // fetch basket data
  const { data: basket } = useFetchBasketQuery();

  const addressString = () => {
    if (!confirmationToken?.shipping) return "";
    const { name, address } = confirmationToken.shipping;
    return `${name}
    ${address?.line1}
    ${address?.line2}
    ${address?.city}
    ${address?.state}
    ${address?.postal_code}
    ${address?.country}
    `;
  };

  const paymentString = () => {
    if (!confirmationToken?.payment_method_preview.card) return "";
    const { brand, last4, exp_month, exp_year } =
      confirmationToken.payment_method_preview.card;
    return `${brand} ending in ${last4}, Exp: ${exp_month}/${exp_year}`;
  };

  return (
    <div>
      <Box mt={4} width="100%">
        <Typography variant="h6" fontWeight="bold">
          Billing and delivery infromation
        </Typography>
        <dl>
          <Typography component="dt" variant="body1" fontWeight="bold">
            Shipping address
          </Typography>
          <Typography component="dd" color="text.secondary">
            {addressString()}
          </Typography>
          <Typography component="dt" color="text.secondary">
            payment details
          </Typography>
          <Typography component="dd" color="text.secondary">
            {paymentString()}
          </Typography>
        </dl>
      </Box>
      <Box mt={6} mx="auto">
        <Divider />
        <TableContainer>
          <Table>
            <TableBody>
              {basket?.items.map((item) => (
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
                    {currencyFormat(item.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
