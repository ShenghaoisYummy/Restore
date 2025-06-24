import { useParams } from "react-router-dom";
import {
  TableCell,
  Grid2,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableBody,
  TextField,
  Button,
  TableRow,
} from "@mui/material";
import { useFetchProductDetailsQuery } from "./catalogApi";
import {
  useAddBasketItemMutation,
  useRemoveBasketItemMutation,
  useFetchBasketQuery,
} from "../basket/basketApi";
import { ChangeEvent, useEffect, useState } from "react";

export default function ProductDetails() {
  const { id } = useParams();
  const [removeBsketItem] = useRemoveBasketItemMutation();
  const [addBasketItem] = useAddBasketItemMutation();
  const { data: basket } = useFetchBasketQuery();
  const item = basket?.items.find((item) => item.productId === Number(id));
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
    }
  }, [item]);

  const { data: product, isLoading } = useFetchProductDetailsQuery(Number(id));

  if (isLoading || !product) return <div>Loading</div>;

  const handleUpdateBasket = () => {
    const updateQuantity = item ? Math.abs(quantity - item.quantity) : quantity;

    if (!item || quantity > item.quantity) {
      addBasketItem({ product, quantity: updateQuantity });
    } else {
      removeBsketItem({ productId: product.id, quantity: updateQuantity });
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    if (Number(value) >= 0) {
      setQuantity(Number(value));
    }
  };

  const productDetails = [
    { label: "Name", value: product.name },
    { label: "Description", value: product.description },
    { label: "Type", value: product.type },
    { label: "Brand", value: product.brand },
    { label: "Quantity in Stock", value: product.quantityInStock },
  ];

  return (
    <Grid2 container spacing={6} maxWidth="lg">
      <Grid2 size={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%", height: "100%" }}
        />
      </Grid2>
      <Grid2 size={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          ${product.price}
        </Typography>
        <TableContainer>
          <Table sx={{ "&td": { fontSize: "1rem" } }}>
            <TableBody>
              {productDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {detail.label}
                  </TableCell>
                  <TableCell>{detail.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid2 container spacing={2} marginTop={3}>
          <Grid2 size={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in Cart"
              fullWidth
              value={quantity}
              onChange={handleInputChange}
            />
          </Grid2>
          <Grid2 size={6}>
            <Button
              sx={{ height: "55px" }}
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              disabled={
                item?.quantity === quantity || (!item && quantity === 0)
              }
              onClick={handleUpdateBasket}
            >
              {item ? "Update Quantity" : "Add to Cart"}
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
