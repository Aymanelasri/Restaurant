import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './MenuPack.css';
import { useCart } from './Navbar';

const categories = [
  "Mexican",
  "Italian",
  "Japanese",
  "Drinks",
];

const items = [
  {
    name: "Pasta",
    price: "$20.00",
    image: "/restaurants/pasta.webp",
    category: "Italian"
  },
  {
    name: "Spaghetti",
    price: "$25.00",
    image: "/restaurants/Categories/spaghetti.webp",
    category: "Italian"
  },
  {
    name: "Potatoes Mexico",
    price: "$10.00",
    image: "/restaurants/Categories/potatoes-mexico.webp",
    category: "Mexican"
  },
  {
    name: "Mexican Tacos",
    price: "$25.00",
    image: "/restaurants/Categories/Mexican-Dishes.webp",
    category: "Mexican"
  },
  {
    name: "Recipe Mexican",
    price: "$15.00",
    image: "/restaurants/Categories/Recipe-mexican.webp",
    category: "Mexican"
  },
  {
    name: "Empanadas",
    price: "$15.00",
    image: "/restaurants/Categories/Hispanic-mexico.webp",
    category: "Mexican"
  },
  {
    name: "Fish Curry",
    price: "$35.00",
    image: "/restaurants/fish-curry.webp",
    category: "Japanese"
  },
  {
    name: "Sushi Platter",
    price: "$28.00",
    image: "/restaurants/Categories/sushi.webp",
    category: "Japanese"
  },
  {
    name: "Ramen Noodles",
    price: "$30.00",
    image: "/restaurants/Categories/Ramen-japon.webp",
    category: "Japanese"
  },
  {
    name: "Japanese Soup",
    price: "$30.00",
    image: "/restaurants/Categories/Soup japanesse.webp",
    category: "Japanese"
  },
  {
    name: "Jus Orange",
    price: "$5.00",
    image: "/restaurants/Orange-jus.webp",
    category: "Drinks"
  },
  {
    name: "Jus Melon",
    price: "$7.00",
    image: "/restaurants/Melon-jus.webp",
    category: "Drinks"
  },
  {
    name: "Jus Starawberry",
    price: "$8.00",
    image: "/restaurants/Strawberry-jus.webp",
    category: "Drinks"
  },
  {
    name: "Oreo Milk",
    price: "$8.00",
    image: "/restaurants/Oreo-milk.webp",
    category: "Drinks"
  },
  {
    name: "Pizza",
    price: "$25.00",
    image: "/restaurants/pizza.webp",
    category: "Italian"
  },
  {
    name: "Lasagna",
    price: "$30.00",
    image: "/restaurants/Categories/Lasagna.webp",
    category: "Italian"
  },
];

export default function MenuPack() {
  const [selectedCategory, setSelectedCategory] = useState("Italian");
  const { addToCart } = useCart();

  const filteredItems = items.filter(item => item.category === selectedCategory);

  return (
    <div className="container py-5 reveal">
      <h1 className="text-center  mb-4 mt-3">
        Our Regular Menu Pack
      </h1>

      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn rounded-pill px-4 py-2 shadow-sm ${
              selectedCategory === cat 
                ? "btn-light" 
                : "btn-outline-light"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="row g-4">
        {filteredItems.map((d, index) => (
          <div className="col-12 col-sm-6 col-lg-3" key={index}>
            <div className="card h-100 shadow-sm border-0 rounded-4 text-center">
              <div className="card-body d-flex flex-column">
                <div className="position-relative mb-3">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="img-fluid rounded-circle mx-auto d-block menu-item-img"
                    style={{ 
                      objectFit: "cover",
                      border: "4px solid #fff",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                    }}
                  />
                </div>
                <h5 className="fw-semibold">{d.name}</h5>
                <p className="text-muted small">
                  Delicious {d.category.toLowerCase()} cuisine
                </p>
                <div className="text-warning mb-3">★★★★★</div>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{d.price}</span>
                  <button onClick={() => addToCart(d)} className="menu-add-btn"><i className="bi bi-cart"></i></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
