import { useEffect, useState } from "react";
import { Product } from "../models/product";
import Catalog from "../../features/catalog/Catalog";
import { Container, Typography, Button, Box } from "@mui/material";
import NavBar from "./NavBar";
function App() {
  const [products, setProduct] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://localhost:5001/api/products")
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }, []);

  return (
    <div>
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 14 }}>
        <Catalog products={products} />
      </Container>
    </div>
  );
}

export default App;
