import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ 
      background: 'linear-gradient(135deg,rgba(111, 69, 226, 0.81) 0%,rgba(95, 180, 245, 0.86) 100%)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}>
      <div className="container-fluid">
        {/* Company Logo and Name */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="ms-2" style={{ 
            fontSize: '2.1rem', 
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>Cake Crafters</span>
        </Link>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Right Side: Login & Sign Up Buttons - pushed to right with ms-auto */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className="btn me-2" 
                to="/login"
                style={{
                  background: 'linear-gradient(45deg,rgba(181, 49, 204, 0.72),rgba(128, 70, 228, 0.77))',
                  border: 'none',
                  color: 'white',
                  fontWeight: '500',
                  padding: '0.5rem 1.2rem',   
                  fontSize: '1rem'
                }}
              >
                Log in
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="btn" 
                to="/signup"
                style={{
                  background: 'linear-gradient(45deg,rgba(181, 49, 204, 0.72),rgba(128, 70, 228, 0.77))',
                  border: 'none',
                  color: 'white',
                  fontWeight: '500',
                  padding: '0.5rem 1.2rem',   
                  fontSize: '1rem'
                }}
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;