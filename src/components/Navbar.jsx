import React from 'react';
// import './Navbar.css';
import '../styles/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>My App</h1>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;