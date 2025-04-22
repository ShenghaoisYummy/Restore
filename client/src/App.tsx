import { useEffect, useState } from "react";
import { Product } from "./product";

function App() {
  const [products, setProduct] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }, []);

  const addProduct = () => {
    setProduct((prevState) => [
      ...prevState,
      {
        id: prevState.length + 1,
        name: `Product ${prevState.length + 1}`,
        description: `Description for Product ${prevState.length + 1}`,
        price: Math.floor(Math.random() * 100),
        pictureUrl: "https://via.placeholder.com/150",
        type: "Type",
        brand: "Brand",
        quantityInStock: Math.floor(Math.random() * 100),
      },
    ]);
  };

  return (
    <div style={{ fontSize: "1.2rem" }}>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
      <button onClick={addProduct}>Add Product</button>
    </div>
  );
}

export default App;
