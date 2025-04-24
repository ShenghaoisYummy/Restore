import { Product } from "../../app/models/product";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Card elevation={3}>
      <CardMedia
        sx={{ height: 240, backgroundSize: "cover" }}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography
          gutterBottom
          sx={{ textTransform: "uppercase" }}
          variant="subtitle2"
          component="div"
        >
          {product.name}
        </Typography>
        <Typography variant="h5" sx={{ color: "secondary.main" }}>
          ${(product.price / 100).toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button>Add to cart</Button>
        <Button>View</Button>
      </CardActions>
    </Card>
  );
}
