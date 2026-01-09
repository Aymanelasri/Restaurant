import React from 'react';
import './Menu.css';
import { useCart } from './Navbar';

export default function Menu() {
  const { addToCart } = useCart();
  const dishes = [
    // Popular Dishes
    { title: 'Pasta', desc: 'Rich tomato sauce, parmesan and fresh basil', price: '35.00', img: '/restaurants/pasta.webp' },
    { title: 'French Fries', desc: 'Crispy golden fries seasoned with sea salt', price: '55.00', img: '/restaurants/frites.webp' },
    { title: 'Chicken Shawarma', desc: 'Spiced chicken wrapped with garlic sauce and veggies', price: '35.00', img: '/restaurants/shawarma.webp' },
    { title: 'Fish Curry', desc: 'Creamy coconut curry with tender fish fillets', price: '35.00', img: '/restaurants/fish-curry.webp' },
    { title: 'Nuggets', desc: 'Crispy chicken nuggets served with dip', price: '35.00', img: '/restaurants/nuggets.webp' },
    { title: 'Pizza', desc: 'Stone-baked pizza with fresh toppings', price: '25.00', img: '/restaurants/pizza.webp' },
    
    // Italian
    { title: 'Spaghetti', desc: 'Classic Italian pasta with rich sauce', price: '25.00', img: '/restaurants/Categories/spaghetti.webp' },
    { title: 'Lasagna', desc: 'Layered pasta with meat and cheese', price: '30.00', img: '/restaurants/Categories/Lasagna.webp' },
    
    // Mexican
    { title: 'Potatoes Mexico', desc: 'Spicy Mexican-style potatoes', price: '10.00', img: '/restaurants/Categories/potatoes-mexico.webp' },
    { title: 'Mexican Tacos', desc: 'Authentic Mexican tacos with fresh ingredients', price: '25.00', img: '/restaurants/Categories/Mexican-Dishes.webp' },
    { title: 'Recipe Mexican', desc: 'Traditional Mexican recipe with authentic flavors', price: '15.00', img: '/restaurants/Categories/Recipe-mexican.webp' },
    { title: 'Empanadas', desc: 'Crispy pastries filled with savory ingredients', price: '15.00', img: '/restaurants/Categories/Hispanic-mexico.webp' },
    
    // Japanese
    { title: 'Sushi Platter', desc: 'Fresh sushi selection with wasabi and ginger', price: '28.00', img: '/restaurants/Categories/sushi.webp' },
    { title: 'Ramen Noodles', desc: 'Hot Japanese noodle soup with rich broth', price: '30.00', img: '/restaurants/Categories/Ramen-japon.webp' },
    { title: 'Japanese Soup', desc: 'Traditional Japanese soup with fresh ingredients', price: '30.00', img: '/restaurants/Categories/soup japanesse.webp' },
    
    // Drinks
    { title: 'Orange Juice', desc: 'Fresh squeezed orange juice', price: '5.00', img: '/restaurants/Orange-jus.webp' },
    { title: 'Melon Juice', desc: 'Sweet and refreshing melon juice', price: '7.00', img: '/restaurants/Melon-jus.webp' },
    { title: 'Strawberry Juice', desc: 'Fresh strawberry juice with natural sweetness', price: '8.00', img: '/restaurants/Strawberry-jus.webp' },
    { title: 'Oreo Milkshake', desc: 'Creamy milkshake with Oreo cookies', price: '8.00', img: '/restaurants/oreo-milk.webp' },
    
    // Additional Items
    { title: 'Croissants', desc: 'Buttery French pastries, perfect for breakfast', price: '6.00', img: '/restaurants/croissants.webp' },
    { title: 'Grilled Chicken', desc: 'Tender grilled chicken with herbs and spices', price: '22.00', img: '/restaurants/chicken.webp' },
    { title: 'Crepes', desc: 'Thin French pancakes with sweet or savory fillings', price: '12.00', img: '/restaurants/crepes.webp' },

    
  ];

  return (
    <div>
      <section className="menu-section">
        <h2 className="menu-title">Our Menu</h2>
        <p className="menu-subtitle">Seasonal, locally-sourced dishes crafted for sharing with love and passion</p>
        <div className="menu-grid">
          {dishes.map(d => (
            <article key={d.title} className="menu-card">
              <div className="menu-card-image">
                <img src={d.img} alt={d.title} />
              </div>
              <div className="menu-card-content">
                <h3 className="menu-card-title">{d.title}</h3>
                <div className="menu-card-desc">{d.desc}</div>
                <div className="menu-card-footer">
                  <div className="menu-card-price">${d.price}</div>
                  <button className="menu-add-btn" onClick={() => addToCart(d)}><i className="bi bi-cart"></i></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
