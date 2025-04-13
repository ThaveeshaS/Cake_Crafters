import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="collapse navbar-collapse d-flex justify-content-center">
          <ul className="navbar-nav">
            <li className="nav-item mx-3">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item mx-3">
              <Link className="nav-link" to="/create">Create Post</Link>
            </li>
            <li className="nav-item mx-3">
              <Link className="nav-link" to="/cakerecipe">Cake Recipe</Link>
            </li>
            <li className="nav-item mx-3">
              <Link className="nav-link" to="/decorationtips">Decoration Tips</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;