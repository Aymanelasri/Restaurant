import React, { useState } from 'react';
import emailjs from 'emailjs-com';

export default function Contacts() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailUs = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setMessage('❌ Please fill in all fields.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    
    const emailData = {
      title: 'Gusto Restaurant',
      time: new Date().toLocaleString(),
      name: formData.name,
      message: formData.message,
      email: formData.email
    };

    try {
      await emailjs.send(
        "service_1y26y1n",
        "template_k35i50q",
        emailData,
        "mQ_ODkN5A4LF6_bMo"
      );
      setMessage('✅ Email sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Email error:', error);
      setMessage('❌ Failed to send email. Please try again.');
    }
    
    setIsLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };
  return (
    <section style={{padding:'100px 12px 60px', minHeight:'100vh', background:'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
      <div style={{maxWidth:'1000px', margin:'0 auto', textAlign:'center'}}>
        <h2 style={{fontFamily:'Caveat, cursive', fontSize:'3rem', color:'#2c1810', marginBottom:'20px'}}>Contact & Reservations</h2>
        <p style={{color:'#666', fontSize:'1.1rem', marginBottom:'40px'}}>Get in touch with us for reservations and inquiries</p>
        
        <div style={{display:'grid',  gap:20, marginTop:40, textAlign:'left', width:'100%', boxSizing:'border-box'}}>
          <div style={{background:'#fff', padding:'15px 12px', borderRadius:15, boxShadow:'0 8px 25px rgba(0,0,0,0.1)', boxSizing:'border-box'}}>
            <h3 style={{color:'#2c1810', marginBottom:20, fontSize:'1.5rem'}}>Contact Information</h3>
            <div style={{marginBottom:15}}>
              <strong style={{color:'#d4af37'}}>📍 Address:</strong>
              <p style={{margin:'5px 0', color:'#666'}}>123 Gusto Restaurant , Casablanca </p>
            </div>
            <div style={{marginBottom:15}}>
              <strong style={{color:'#d4af37'}}>📞 Phone:</strong>
              <p style={{margin:'5px 0', color:'#666'}}>+212 6 11 22 33 44</p>
            </div>
            <div style={{marginBottom:15}}>
              <strong style={{color:'#d4af37'}}>✉️ Email:</strong>
              <p style={{margin:'5px 0', color:'#666'}}>Aymane@gusto.com</p>
            </div>
            
            <h4 style={{color:'#2c1810', marginTop:25, marginBottom:15}}>Opening Hours</h4>
            <ul style={{listStyle:'none', padding:0, color:'#666'}}>
              <li style={{marginBottom:8}}>🕐 Monday-Friday: 11:30 AM — 10:00 PM</li>
              <li style={{marginBottom:8}}>🕐 Saturday-Sunday: 9:00 AM — 11:00 PM</li>
            </ul>
          </div>

          <div style={{background:'#fff', padding:'20px 12px', borderRadius:15, boxShadow:'0 8px 25px rgba(0,0,0,0.1)', boxSizing:'border-box', width:'100%'}}>
            <h3 style={{color:'#2c1810', marginBottom:20, fontSize:'1.5rem'}}>Book a Table</h3>
            <p style={{color:'#666', marginBottom:20, lineHeight:1.6}}>Ready to experience our delicious cuisine? Call us or send an email and we'll reserve the perfect spot for you.</p>
            
            <form onSubmit={handleEmailUs} style={{display:'flex', flexDirection:'column', gap:15}}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  padding: '12px 15px',
                  borderRadius: 8,
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  width: '100%'
                }}
              />
              
              <input
                type="email"
                name="email"
                placeholder="Your Email "
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  padding: '12px 15px',
                  borderRadius: 8,
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  width: '100%'
                }}
              />
              
              <textarea
                name="message"
                placeholder="Message ..."
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                style={{
                  padding: '12px 15px',
                  borderRadius: 8,
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  width: '100%'
                }}
              />
              
              <button 
                type="submit"
                disabled={isLoading}
                style={{
                  background: isLoading ? '#ccc' : 'linear-gradient(135deg, #2c1810, #1a0f08)', 
                  border: 0, 
                  padding: '15px 25px', 
                  borderRadius: 25, 
                  cursor: isLoading ? 'not-allowed' : 'pointer', 
                  color: '#fff', 
                  fontWeight: 600, 
                  fontSize: '1rem', 
                  transition: 'all 0.3s ease',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                {isLoading ? '⏳ Sending...' : '✉️ Email Us'}
              </button>
            </form>
            
            {message && (
              <div style={{
                marginTop: 15, 
                padding: 10, 
                borderRadius: 8, 
                textAlign: 'center',
                background: message.includes('✅') ? '#d4edda' : '#f8d7da',
                color: message.includes('✅') ? '#155724' : '#721c24'
              }}>
                {message}
              </div>
            )}
            
            <div style={{marginTop:25, padding:'12px 15px', background:'#f8f9fa', borderRadius:10, boxSizing:'border-box'}}>
              <h5 style={{color:'#2c1810', marginBottom:10}}>💡 Quick Tip</h5>
              <p style={{color:'#666', fontSize:'0.9rem', margin:0}}>For large groups (8+ people), please call us directly to ensure the best seating arrangement.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
