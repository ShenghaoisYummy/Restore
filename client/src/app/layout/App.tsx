import { useEffect, useState } from "react";
import { Product } from "../models/product";
import Catalog from "../../features/catalog/Catalog";
import {
  Container,
  Typography,
  Button,
  Box,
  createTheme,
  CssBaseline,
} from "@mui/material";
import NavBar from "./NavBar";
import { ThemeProvider } from "@mui/material/styles";

function App() {
  const [products, setProduct] = useState<Product[]>([]);
  const darkMode = false;
  const paletteType = darkMode ? "dark" : "light";

  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      },
    },
  });

  useEffect(() => {
    fetch("https://localhost:5001/api/products")
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <NavBar />
        <Container maxWidth="xl" sx={{ mt: 14 }}>
          <Catalog products={products} />
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
