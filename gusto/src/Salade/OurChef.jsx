import React, { useRef } from "react";
import "./OurChef.css";

const chefs = [
	{ name: "Claire Dubois", img: "/chefs/Claire-Dubois.webp" },
    { name: "Lucas Moreau", img: "/chefs/Lucas-Moreau.webp" },
	{ name: "Marco Bianchi", img: "/chefs/Marco-Bianchi.webp" },
	{ name: "Elena Martínez", img: "/chefs/Elena-Martínez.webp" },
	{ name: "MJulien Lefèvre", img: "/chefs/Julien-Lefèvre.webp" },
	{ name: "Sofia Romano", img: "/chefs/Sofia-romano.webp" },
	{ name: "Thomas Schneider", img: "/chefs/Thomas-Schneider.webp" },
	{ name: "Yassine Amrani", img: "/chefs/Yassine-Amrani.webp" }
];

export default function OurChef() {
	const scroller = useRef(null);

	const scroll = (dir = 1) => {
		if (!scroller.current) return;
		const width = scroller.current.clientWidth || 300;
		scroller.current.scrollBy({ left: dir * width, behavior: 'smooth' });
	};

	return (
		<section className="chef-section reveal">
			<div className="chef-header">
				<h2>Meet Our Chefs</h2>
				<div className="chef-controls">
					<button className="chef-arrow chef-arrow-left" onClick={() => scroll(-1)}>➜</button>
					<button className="chef-arrow" onClick={() => scroll(1)}>➜</button>
				</div>
			</div>

			<div className="chef-scroller" ref={scroller}>
				{chefs.map((chef, i) => (
					<div className="chef-card" key={i}>
						<div className="chef-photo-wrap">
							<img src={chef.img} alt={chef.name} className="chef-photo" />
						</div>
						<div className="chef-name">{chef.name}</div>
					</div>
				))}
			</div>
		</section>
	);
}
