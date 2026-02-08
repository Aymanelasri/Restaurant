import React, { useRef, useState, useEffect } from "react";
import "./OurChef.css";

export default function OurChef() {
	const scroller = useRef(null);
	const [chefs, setChefs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchChefs();
	}, []);

	const fetchChefs = async () => {
		try {
			const response = await fetch('http://localhost:8000/api/chefs');
			const data = await response.json();
			setChefs(data.map(chef => ({
				name: chef.name,
				img: `http://localhost:8000${chef.image}`
			})));
		} catch (error) {
			console.error('Error fetching chefs:', error);
		} finally {
			setLoading(false);
		}
	};

	const scroll = (dir = 1) => {
		if (!scroller.current) return;
		const width = scroller.current.clientWidth || 300;
		scroller.current.scrollBy({ left: dir * width, behavior: 'smooth' });
	};

	if (loading) {
		return (
			<section className="chef-section reveal">
				<div style={{textAlign: 'center', padding: '50px'}}>Loading chefs...</div>
			</section>
		);
	}

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
