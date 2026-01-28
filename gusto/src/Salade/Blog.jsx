import React, { useState } from 'react';
import Footer from './Footer';

export default function Blog() {
  const [expandedPost, setExpandedPost] = useState(null);

  const posts = [
    { 
      title: 'How We Source Our Ingredients', 
      date: 'Dec 12, 2025',
      preview: 'Discover the secrets behind how we source our ingredients and learn from our expert chefs.',
      fullContent: 'At Gusto, we believe that great food starts with great ingredients. Our sourcing journey begins at dawn, when our chefs visit local farmers markets to handpick the freshest produce. We work directly with local farmers who share our commitment to sustainable and organic farming practices.'
    },
    { 
      title: '5 Tips for Perfect Home Grilling', 
      date: 'Nov 28, 2025',
      preview: 'Discover the secrets behind 5 tips for perfect home grilling and learn from our expert chefs.',
      fullContent: 'Grilling is an art form that combines technique, timing, and passion. Our head chef shares his top 5 secrets for achieving restaurant-quality grilling at home. First, always preheat your grill properly - this ensures even cooking and those perfect grill marks.'
    },
    { 
      title: 'The Art of Perfect Pasta Making', 
      date: 'Nov 15, 2025',
      preview: 'Discover the secrets behind the art of perfect pasta making and learn from our expert chefs.',
      fullContent: 'Pasta making is a time-honored tradition that requires skill, patience, and love. In our kitchen, we make fresh pasta daily using traditional Italian techniques passed down through generations.'
    },
    { 
      title: 'Seasonal Menu Updates', 
      date: 'Oct 30, 2025',
      preview: 'Discover the secrets behind seasonal menu updates and learn from our expert chefs.',
      fullContent: 'Our seasonal menu updates reflect our commitment to using the freshest ingredients at their peak flavor. As autumn arrives, we embrace the rich, warming flavors of the season.'
    },
  ];

  const toggleExpanded = (index) => {
    setExpandedPost(expandedPost === index ? null : index);
  };

  return ( <>
    <section style={{
      padding: 'clamp(100px, 15vw, 120px) clamp(16px, 5vw, 32px) 60px',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontFamily: 'Caveat, cursive',
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          color: '#2c1810',
          marginBottom: '20px'
        }}>From Our Blog</h2>
        <p style={{
          color: '#666',
          fontSize: 'clamp(1rem, 3vw, 1.1rem)',
          marginBottom: '40px'
        }}>Discover stories, recipes, and insights from our kitchen</p>
        <div style={{
          display: 'grid',
          gap: 'clamp(16px, 3vw, 24px)',
          marginTop: 32,
          textAlign: 'left'
        }}>
          {posts.map((p, index) => (
            <article key={p.title} style={{
              background: '#fff',
              padding: 'clamp(16px, 4vw, 24px)',
              borderRadius: 15,
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}>
              <h3 style={{
                margin: '0 0 10px 0',
                color: '#2c1810',
                fontSize: 'clamp(1.1rem, 4vw, 1.4rem)'
              }}>{p.title}</h3>
              <div style={{
                color: '#d4af37',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                marginBottom: 12,
                fontWeight: 600
              }}>{p.date}</div>
              <p style={{
                color: '#666',
                margin: '0 0 15px 0',
                lineHeight: 1.6,
                fontSize: 'clamp(14px, 3vw, 16px)'
              }}>
                {expandedPost === index ? p.fullContent : p.preview}
              </p>
              <button 
                onClick={() => toggleExpanded(index)}
                style={{
                  marginTop: 15,
                  background: 'linear-gradient(135deg, #d4af37, #f4d03f)',
                  border: 0,
                  padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
                  borderRadius: 20,
                  cursor: 'pointer',
                  color: '#2c1810',
                  fontWeight: 600,
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  transition: 'all 0.3s ease'
                }}
              >
                {expandedPost === index ? 'Read Less' : 'Read More'}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
    <Footer />
    </> 
  );
}
