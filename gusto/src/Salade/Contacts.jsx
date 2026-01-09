import React from 'react';

export default function Contacts() {
  return (
    <section style={{padding:'120px 32px 60px', minHeight:'100vh', background:'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
      <div style={{maxWidth:'1000px', margin:'0 auto', textAlign:'center'}}>
        <h2 style={{fontFamily:'Caveat, cursive', fontSize:'3rem', color:'#2c1810', marginBottom:'20px'}}>Contact & Reservations</h2>
        <p style={{color:'#666', fontSize:'1.1rem', marginBottom:'40px'}}>Get in touch with us for reservations and inquiries</p>
        
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, marginTop:40, textAlign:'left'}}>
          <div style={{background:'#fff', padding:30, borderRadius:15, boxShadow:'0 8px 25px rgba(0,0,0,0.1)'}}>
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
              <li style={{marginBottom:8}}>🕐 Monday–Friday: 11:30 AM — 10:00 PM</li>
              <li style={{marginBottom:8}}>🕐 Saturday–Sunday: 9:00 AM — 11:00 PM</li>
            </ul>
          </div>

          <div style={{background:'#fff', padding:30, borderRadius:15, boxShadow:'0 8px 25px rgba(0,0,0,0.1)'}}>
            <h3 style={{color:'#2c1810', marginBottom:20, fontSize:'1.5rem'}}>Book a Table</h3>
            <p style={{color:'#666', marginBottom:20, lineHeight:1.6}}>Ready to experience our delicious cuisine? Call us or send an email and we'll reserve the perfect spot for you.</p>
            
            <div style={{display:'flex', flexDirection:'column', gap:15}}>
              <button style={{background:'linear-gradient(135deg, #d4af37, #f4d03f)', border:0, padding:'15px 25px', borderRadius:25, cursor:'pointer', color:'#2c1810', fontWeight:600, fontSize:'1rem', transition:'all 0.3s ease'}}>📞 Call to Reserve</button>
              <button style={{background:'linear-gradient(135deg, #2c1810, #1a0f08)', border:0, padding:'15px 25px', borderRadius:25, cursor:'pointer', color:'#fff', fontWeight:600, fontSize:'1rem', transition:'all 0.3s ease'}}>✉️ Email Us</button>
            </div>
            
            <div style={{marginTop:25, padding:20, background:'#f8f9fa', borderRadius:10}}>
              <h5 style={{color:'#2c1810', marginBottom:10}}>💡 Quick Tip</h5>
              <p style={{color:'#666', fontSize:'0.9rem', margin:0}}>For large groups (8+ people), please call us directly to ensure the best seating arrangement.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
