import React, { Component } from 'react';
import '../css/Footer.css';

class Footer extends Component {
	render() {
		return (
			<footer>
				<div className="container">
				<div className="footer-links">
					<div className="links">
					<ul>
						<li><a href="/">Home</a></li>
						<li><a href="/about">About</a></li>
						<li><a href="/contact">Contact</a></li>
						<li><a href="/register">Register</a></li>
					</ul>
					</div>

					<div className="faqs">
						<ul>
						<li><a href="/">FAQs</a></li>
						<li><a href="/contact">Contact</a></li>
						</ul>
					</div>
				</div>
				<p className="dev">Developed with <span role="img" aria-label="love">💛</span> by NAMAK</p>
				</div>
			</footer>
		);
	}
}

export default Footer;