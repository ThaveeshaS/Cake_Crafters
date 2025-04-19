import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Navbar() {
  const location = useLocation();

  return (

    <nav className="navbar-container">
      <style>
        {`
          :root {
            --primary-color: #6c5ce7;
            --primary-light: #a29bfe;
            --text-color: #2d3436;
            --light-color: #f8f9fa;
          }
          
          .navbar-container {
            background: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 1000;
          }
          
          .navbar-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
          }
          
          .nav-list {
            display: flex;
            justify-content: center;
            align-items: center;
            list-style: none;
            padding: 0;
            margin: 0;
            gap: 2rem;
          }
          
          .nav-item {
            position: relative;
          }
          
          .nav-link {
            color: var(--text-color);
            text-decoration: none;
            font-weight: 500;
            font-size: 1.1rem;
            padding: 0.5rem 0;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .nav-link:hover {
            color: var(--primary-color);
          }
          
          .nav-link.active {
            color: var(--primary-color);
            font-weight: 600;
          }
          
          .nav-link.active:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: var(--primary-color);
            border-radius: 3px;
          }
          
          @media (max-width: 768px) {
            .nav-list {
              gap: 1rem;
            }
            
            .nav-link {
              font-size: 1rem;
            }
          }
        `}
      </style>

      <div className="navbar-content">
        <ul className="nav-list">
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`}
              to="/create">
              Create Post
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/displaycakerecipe' ? 'active' : ''}`}
              to="/displaycakerecipe">
            Cake Recipes
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/decorationtips' ? 'active' : ''}`}
              to="/decorationtips">
            Decoration Tips
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/Voice' ? 'active' : ''}`}
              to="/Voice">
            <i className="bi bi-mic"></i> Voice Navigator
            </Link>
          </li> 
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;