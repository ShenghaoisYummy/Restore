import {useEffect, useState} from 'react'


function App() {
  const [products, setProduct] = useState([
    {name:'product1', price: 100},
    {name:'product2', price: 200},
    {name:'product3', price: 300},
  ]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data =>  setProduct(data))}, [])

  const addProduct = () =>{
    setProduct([...products, {name:'product4', price: 400}])
  }

  return (
    <div style={{fontSize:'1.2rem' }}>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            {product.name} - ${product.price}
          </li>
        ))}
        </ul>
        <button onClick={addProduct}>Add Product</button>
    </div>
  )
}

export default App