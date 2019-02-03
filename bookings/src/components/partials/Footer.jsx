import React, { Component } from 'react';
import '../css/Footer.css';

class Footer extends Component {
	render() {
		return (
			<footer>
				<div className="base container">
					<div className="collab">
						<div>
							<span className="base-title">xtacy</span><br/>
							The annual techno-cultural extravaganza organized by Faculty of Engineering, Jamia Millia Islamia
						</div>
						<div className="collab-imgs">
							<img src="/static/img/collaborators.png" alt=""/>
						</div>
					</div>
					<p className="dev">Developed with <span role="img" aria-label="love">💛</span> by NAMAK</p>
				</div>
			</footer>
		);
	}
}

export default Footer;