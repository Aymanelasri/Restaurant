import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './Navbar';
import PaymentModal from './PaymentModal';
import './Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, decreaseQuantity, addToCart, getTotalItems } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
    } else {
      setShowPaymentModal(true);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h2 className="cart-title">Your Cart</h2>
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some delicious items from our menu!</p>
            <Link to="/menu" className="continue-shopping">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2 className="cart-title">Your Cart ({getTotalItems()} items)</h2>
        
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-item-image">
                <img src={item.img} alt={item.title} />
              </div>
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="cart-item-footer">
                  <div className="quantity-controls">
                    <button className="quantity-btn" onClick={() => decreaseQuantity(item.title)}>-</button>
                    <span className="quantity">Quantity: {item.quantity}</span>
                    <button className="quantity-btn" onClick={() => addToCart(item)}>+</button>
                  </div>
                  <div className="price">${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                  <button 
                    className="remove-btn" 
                    onClick={() => removeFromCart(item.title)}
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="total">
            <h3>Total: ${getTotalPrice()}</h3>
          </div>
          <div className="cart-actions">
            <Link to="/menu" className="continue-shopping">Continue Shopping</Link>
            <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        </div>
        
        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          totalAmount={getTotalPrice()}
          cartItems={cartItems}
        />
      </div>
    </div>
  );
}