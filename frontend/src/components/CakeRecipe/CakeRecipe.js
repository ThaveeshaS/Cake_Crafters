import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CakeRecipe = () => {
  return (
    <div className="container py-5">
      {/* Only the Create Recipe Button remains */}
      <div className="d-flex justify-content-end mb-4">
        <Link to="/createrecipe" className="btn btn-success">
          <i className="bi bi-plus-circle me-2"></i> Create Cake Recipe
        </Link>
      </div>
    </div>
  );
};

export default CakeRecipe;