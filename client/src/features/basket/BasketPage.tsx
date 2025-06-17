import { useFetchBasketQuery } from "./basketApi";
import { Typography } from "@mui/material";

export default function BasketPage() {
  const { data, isLoading } = useFetchBasketQuery();
  if (isLoading) return <Typography variant="h3">Loading basket...</Typography>;
  if (!data) return <Typography variant="h3">Basket is empty</Typography>;

  return <div>{data.basketId}</div>;
} 
