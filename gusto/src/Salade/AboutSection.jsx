import React from 'react';
import './AboutSection.css';

export default function AboutSection() {
  return (
    <section className="about-section reveal">
      <div className="about-inner">
        <div className="about-left">
          <div className="chef-wrap">
            <img src="/chef.webp" alt="Chef" className="chef-img" />
            <div className="badge badge-top">🥗</div>
            <div className="badge badge-bottom">🍰</div>
          </div>
        </div>

        <div className="about-right">
          <h2>We Are More Than Multiple Service</h2>
          <p className="lead">This is a type of restaurant which typically serves food and drinks, in addition to light refreshments such as baked goods or snacks. The term comes from the french word meaning food.</p>

          <ul className="features">
            <li><span className="f-icon">🛒</span><span>Online Order</span></li>
            <li><span className="f-icon">📅</span><span>Pre-Reservation</span></li>
            <li><span className="f-icon">⏱️</span><span>24/7 Service</span></li>
            <li><span className="f-icon">🏆</span><span>Organized Foodie Place</span></li>
            <li><span className="f-icon">🧽</span><span>Clean Kitchen</span></li>
            <li><span className="f-icon">👨‍🍳</span><span>Super Chefs</span></li>
          </ul>

          
        </div>
      </div>
     
    </section>
  );
}
