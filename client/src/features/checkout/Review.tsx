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

export default function Review() {
  // fetch basket data
  const { data: basket } = useFetchBasketQuery();

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
            address gose here
          </Typography>
          <Typography component="dt" color="text.secondary">
            payment details
          </Typography>
          <Typography component="dd" color="text.secondary">
            payment details gose here
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
