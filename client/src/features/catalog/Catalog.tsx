import { Product } from "../../app/models/product";
import { Button } from "@mui/material";

interface Props {
  products: Product[];
  addProduct: () => void;
}

export default function Catalog({ products, addProduct }: Props) {
  return (
    <>
      {" "}
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
      <Button variant="contained" onClick={addProduct}>
        Add Product
      </Button>
    </>
  );
}
