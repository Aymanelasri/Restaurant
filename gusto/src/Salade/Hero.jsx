import React, { useState, useEffect, useRef } from "react";
import "./Hero.css";
import PopularDishes from './PopularDishes';
import AboutSection from './AboutSection';
import MenuPack from "./MenuPack"
import useScrollReveal from './useScrollReveal';
import MakeReservation from "./MakeReservation";
import OurChef from './OurChef';
import Footer from "./Footer";


const IMAGES = {
  Dishes: "/dish.webp",
  Dessert: "/desserts.webp",
  Drinks: "/drinks.webp",
  Platter: "/platter.webp",
  Snacks: "/snacks.webp",
};

function Hero() {
  const [selected, setSelected] = useState("Dishes");
  const heroRef = useRef(null);

  useScrollReveal();

  

  const handleSelect = (key) => {
    if (key === selected) return;
    setSelected(key);
  };

  const currentImage = IMAGES[selected] || IMAGES.Dishes;

  
  useEffect(() => {
    if (!heroRef.current) return;
    const el = heroRef.current;
    const children = Array.from(el.querySelectorAll('.reveal-child'));
    if (!children.length) return;

    const rect = el.getBoundingClientRect();
    
    if (rect.top >= -40 && rect.top <= window.innerHeight * 0.6) {
      const timers = [];
      children.forEach((ch, i) => {
        const t = window.setTimeout(() => ch.classList.add('is-visible'), i * 110 + 80);
        timers.push(t);
      });
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, []);

  return (
    <>
      
      <section className="hero reveal" ref={heroRef}>
        <div className="hero-inner">
          <div className="hero-left">
            <h1 className="hero-title reveal-child">
              Real Food. Real Flavor. 
              <span className="hero-title-accent reveal-child"> Real Love </span>
            </h1>

            <p className="hero-sub reveal-child">Discover a place where passion meets taste, serving meals and drinks made to delight your senses</p>

            <div className="hero-ctas">
              <button className="btn-primary reveal-child">Explore Food</button>
              
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-visual">
            <div className="plate-wrap reveal-child">
              <div className="plate">
                <img
                  className="plate-img"
                  src={currentImage}
                  key={selected}
                  loading="lazy"
                  decoding="async"
                  alt={`${selected} dish`}
                />
              </div>
              </div>
            </div>

            <ul className="categories">
              {Object.keys(IMAGES).map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    className={`cat ${selected === key ? "active" : ""}`}
                    onClick={() => handleSelect(key)}
                  >
                    <span className="dot" aria-hidden>
                      {key === "Dishes" ? "🍽️" : key === "Dessert" ? "🍰" : key === "Drinks" ? "🥤" : key === "Platter" ? "🧺" : "🍿"}
                    </span>
                    <span className="cat-label">{key}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <PopularDishes />
      <AboutSection/>
      
      <MenuPack/>
      <MakeReservation/>
      <OurChef />
      
      <Footer/>

      
    </>
  );
}

export default Hero;
