import React, { Component } from 'react';
import '../css/Header.css';

class Header extends Component {
  render() {
        return (
            <header>
                <div className="container">
                    <div className="logo">
                        <div className="logo-rotor">
                            <div className="rotary"></div>
                        </div>
                        <p className="logo-text">xtacy</p>
                    </div>

                    <input type="checkbox" id="sidebar-toggle" hidden={true} />
                    <label htmlFor="sidebar-toggle" className="hamburger"><span></span></label>

                    <div className="sidebar">
                        <nav className="sidebar-nav">
                            <ul>
                                <li><a href="/">home</a></li>
                                <li><a href="/about">about</a></li>
                                <li><a href="/events">events</a></li>
                                <li><a href="/contact">contact</a></li>
                                <li><a href="/register">register</a></li>
                            </ul>
                        </nav>
                        <div className="accent"></div>
                    </div>
                    <div className="sidebar-shadow" id="sidebar-shadow"></div>
                    
                    <nav className="desktop-nav">
                        <ul>
                            <li><a href="/">home</a></li>
                            <li><a href="/about">about</a></li>
                            <li><a href="/events">events</a></li>
                            <li><a href="/contact">contact</a></li>
                            <li className="highlight"><a href="/register" className="highlight">register</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}

export default Header;
