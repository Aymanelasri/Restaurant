import React, { useState } from 'react';
import Footer from './Footer';
import './Blog.css';

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

export default function Blog() {
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      <section className="bl-page">
        <div className="bl-wrap">
          <header className="bl-head">
            <h2>From Our Blog</h2>
            <p>Discover stories, recipes, and insights from our kitchen</p>
          </header>

          <div className="bl-list">
            {posts.map((p, i) => (
              <article key={p.title} className="bl-card">
                <h3>{p.title}</h3>
                <div className="bl-date">{p.date}</div>
                <p>{expanded === i ? p.fullContent : p.preview}</p>
                <button
                  type="button"
                  className="bl-btn"
                  aria-expanded={expanded === i}
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  {expanded === i ? 'Read Less' : 'Read More'}
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