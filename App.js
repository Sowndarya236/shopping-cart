import React, { useState, useEffect } from "react";
import "./App.css";

const THRESHOLD = 3000;
const FREE_GIFT = { id: "gift", name: "🎁 Free Gift", price: 0 };

const PRODUCTS = [
  { id: "1", name: "Laptop", price: 2600 },
  { id: "2", name: "Phone", price: 1400 },
  { id: "3", name: "Headphones", price: 1150 },
  { id: "4", name: "Keyboard", price: 1100 },
];

function App() {
  const [productQuantities, setProductQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [showGiftMessage, setShowGiftMessage] = useState(false);

  const getSubtotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const addToCart = (product) => {
    const quantity = productQuantities[product.id] || 1;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    if (id === "gift") return; // gift removal
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };


  useEffect(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const hasGift = cart.find((item) => item.id === "gift");
  
    if (subtotal >= THRESHOLD && !hasGift) {
      setCart((prevCart) => [...prevCart, { ...FREE_GIFT, quantity: 1 }]);
      setShowGiftMessage(true);
      setTimeout(() => setShowGiftMessage(false), 3000);
    }
  
    if (subtotal < THRESHOLD && hasGift) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== "gift"));
    }
  }, [cart]);
  




  
  return (
    <div className="App">
      <h1>🛒 Shopping Cart</h1>

      <div className="products">
        <h2>Products</h2>
        {PRODUCTS.map((product) => (
          <div key={product.id} className="product">
            <span>{product.name} - ₹{product.price}</span>
            <div>
              <button
                onClick={() =>
                  setProductQuantities((prev) => ({
                    ...prev,
                    [product.id]: Math.max((prev[product.id] || 1) - 1, 1),
                  }))
                }
              >
                -
              </button>
              <span>{productQuantities[product.id] || 1}</span>
              <button
                onClick={() =>
                  setProductQuantities((prev) => ({
                    ...prev,
                    [product.id]: (prev[product.id] || 1) + 1,
                  }))
                }
              >
                +
              </button>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>

      <div className="progress-bar">
        <p>
          {getSubtotal() >= THRESHOLD
            ? "🎉 You've unlocked the Free Gift!"
            : `Add ₹${THRESHOLD - getSubtotal()} more to get a Free Gift`}
        </p>
        <div className="bar">
          <div
            className="filled"
            style={{
              width: `${Math.min((getSubtotal() / THRESHOLD) * 100, 100)}%`,
            }}
          ></div>
        </div>
      </div>

      {showGiftMessage && <p className="gift-msg">🎁 Free Gift added to cart!</p>}

      <div className="cart">
        <h2>Cart</h2>
        {cart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <span>
                {item.name} - ₹{item.price} x {item.quantity}
              </span>
              {item.id !== "gift" && (
                <div>
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              )}
            </div>
          ))
        )}
        <p>
          <strong>Total:</strong> ₹{getSubtotal()}
        </p>
      </div>
    </div>
  );
}

export default App;
