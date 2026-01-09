import React, { useState } from 'react';
import './PaymentModal.css';

export default function PaymentModal({ isOpen, onClose, totalAmount, cartItems }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    guests: 1
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [loading, setLoading] = useState(false);

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleConfirmOrder = async () => {
    setLoading(true);
    
    const token = localStorage.getItem('token');
    const orderData = {
      items: cartItems.map(item => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price
      })),
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      delivery_address: customerInfo.address,
      city: 'Casablanca',
      payment_method: paymentMethod,
      total_amount: totalAmount
    };

    try {
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage('Order confirmed successfully! Your food will be delivered within 30-45 minutes to your address.');
        setCurrentStep(5);
      } else {
        alert('Error placing order: ' + result.message);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-header">
          <h2>
            {currentStep === 1 && 'Order Review'}
            {currentStep === 2 && 'Customer Information'}
            {currentStep === 3 && 'Payment Method'}
            {currentStep === 4 && 'Order Confirmation'}
            {currentStep === 5 && 'Order Success'}
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>4</div>
          <div className={`step ${currentStep >= 5 ? 'active' : ''}`}>✅</div>
        </div>

        <div className="payment-content">
          {currentStep === 1 && (
            <div className="step-content">
              <h3>Order Review</h3>
              <div className="order-review">
                {cartItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.img} alt={item.title} className="item-image" />
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                      <div className="item-price">
                        <span>Quantity: {item.quantity}</span>
                        <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="total-price">
                  <strong>Total: ${totalAmount}</strong>
                </div>
              </div>
              <button className="next-btn" onClick={nextStep}>Proceed to Checkout</button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content">
              <h3>Customer Information</h3>
              <form className="customer-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value="Casablanca"
                    readOnly
                    style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}
                  />
                </div>
              </form>
              <div className="step-buttons">
                <button className="prev-btn" onClick={prevStep}>Previous</button>
                <button 
                  className="next-btn" 
                  onClick={nextStep}
                  disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-content">
              <h3>Payment Method</h3>
              <div className="payment-methods">
                <div className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`} 
                     onClick={() => setPaymentMethod('card')}>
                  <span>💳</span>
                  <span>Credit Card</span>
                </div>
                <div className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`} 
                     onClick={() => setPaymentMethod('paypal')}>
                  <i className="fa-brands fa-paypal"></i>
                  <span>PayPal</span>
                </div>
              </div>
              
              {paymentMethod === 'card' && (
                <form className="card-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                        placeholder="123"
                        maxLength="3"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                      
                    />
                  </div>
                </form>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className="payment-info">
                  <div className="info-box">
                    <h4><i className="fa-brands fa-paypal"></i> PayPal Payment</h4>
                    <p>You will be redirected to PayPal to complete your payment securely.</p>
                    <div className="paypal-button">
                      <button className="paypal-btn"><i className="fa-brands fa-paypal"></i> Continue with PayPal</button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="step-buttons">
                <button className="prev-btn" onClick={prevStep}>Previous</button>
                <button 
                  className="next-btn" 
                  onClick={nextStep}
                  disabled={
                    paymentMethod === 'card' 
                      ? !paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardName
                      : false
                  }
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="step-content">
              <h3>Order Confirmation</h3>
              <div className="confirmation-summary">
                <div className="summary-section">
                  <h4>Customer Information:</h4>
                  <p><strong>Name:</strong> {customerInfo.name}</p>
                  <p><strong>Phone:</strong> {customerInfo.phone}</p>
                  <p><strong>Address:</strong> {customerInfo.address}, Casablanca</p>
                </div>
                <div className="summary-section">
                  <h4>Payment Method:</h4>
                  <p>
                    {paymentMethod === 'card' && '💳 Credit Card'}
                    {paymentMethod === 'paypal' && <><i className="fa-brands fa-paypal"></i> PayPal</>}
                  </p>
                </div>
                <div className="summary-section">
                  <h4>Final Total:</h4>
                  <p className="final-total">${totalAmount}</p>
                </div>
              </div>
              
              <div className="step-buttons">
                <button className="prev-btn" onClick={prevStep}>Previous</button>
                <button 
                  className="confirm-btn" 
                  onClick={handleConfirmOrder}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm Order ✅'}
                </button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="step-content">
              <div className="success-message">
                <div className="success-icon">✅</div>
                <h3>Order Confirmed!</h3>
                <p>{message}</p>
                <button className="close-success-btn" onClick={() => {
                  onClose();
                  setCurrentStep(1);
                  setMessage('');
                }}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}