import React, { useRef } from 'react';
import './PopularDishes.css';
import { useCart } from './Navbar';



const DISHES = [
  { title: 'Pasta', img: '/restaurants/pasta.webp', price: '35.00', desc: 'Rich tomato sauce, parmesan and fresh basil.' },
  { title: 'French Fries', img: '/restaurants/frites.webp', price: '55.00', desc: 'Crispy golden fries seasoned with sea salt.' },
  { title: 'Chicken Shawarma', img: '/restaurants/shawarma.webp', price: '35.00', desc: 'Spiced chicken wrapped with garlic sauce and veggies.' },
  { title: 'Fish Curry', img: '/restaurants/fish-curry.webp', price: '35.00', desc: 'Creamy coconut curry with tender fish fillets.' },
  { title: 'Nuggets', img: '/restaurants/nuggets.webp', price: '35.00', desc: 'Crispy chicken nuggets served with dip.' },
  { title: 'Pizza', img: '/restaurants/pizza.webp', price: '35.00', desc: 'Stone-baked pizza with fresh toppings.' },
  
];

export default function PopularDishes() {
   const { addToCart } = useCart();
  const scroller = useRef(null);

  const scroll = (dir = 1) => {
    if (!scroller.current) return;
    const width = scroller.current.clientWidth || 300;
    scroller.current.scrollBy({ left: dir * width, behavior: 'smooth' });
  };

  return (
    <section className="popular-section reveal">
      <div className="popular-header">
        <h3>Popular Dishes</h3>
        <div className="popular-controls">
          <button className="arrow arrow-left" onClick={() => scroll(-1)} aria-label="previous">➜</button>
          <button className="arrow" onClick={() => scroll(1)} aria-label="next">➜ </button>
        </div>
      </div>

      <div className="popular-scroller" ref={scroller}>
        {DISHES.map(d => (
          <article key={d.title} className="dish-card">
            <div className="img-wrap">
              <img
                className="dish-img"
                src={d.img}
                alt={d.title}
                loading="lazy"
              />
            </div>
            <div className="dish-body">
              <h4>{d.title}</h4>
              <div className="stars">★★★★★</div>
              <p className="desc">{d.desc}</p>
              <div className="dish-foot">
                <div className="price">${d.price}</div>
                <button onClick={() => addToCart(d)} className="add"><i className="bi bi-cart"></i></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
