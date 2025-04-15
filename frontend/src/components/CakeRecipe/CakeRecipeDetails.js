import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CakeRecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/cake-recipes/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Recipe not found');
        }
        return response.json();
      })
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <h5>{error}</h5>
        <Link to="/displaycakerecipe" className="btn btn-primary mt-3">
          Back to Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <style>
        {`
          .recipe-details {
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            padding: 2rem;
          }
          .recipe-header {
            color: #2a5bd7;
            font-weight: 700;
            margin-bottom: 1rem;
          }
          .recipe-image {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 1.5rem;
          }
          .recipe-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            background: #f8faff;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
          }
          .meta-item {
            font-size: 0.9rem;
            color: #333;
          }
          .section-title {
            color: #2a5bd7;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 1rem;
            border-bottom: 2px solid #d6e4ff;
            padding-bottom: 0.5rem;
          }
          .ingredients-list,
          .instructions-list {
            font-size: 1rem;
            color: #333;
            line-height: 1.6;
          }
          .ingredients-list li,
          .instructions-list li {
            margin-bottom: 0.5rem;
          }
          .image-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
          }
          .gallery-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.3s;
          }
          .gallery-image:hover {
            transform: scale(1.05);
          }
          .back-btn {
            background: #2a5bd7;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            transition: background 0.3s;
          }
          .back-btn:hover {
            background: #1e4ac4;
          }
        `}
      </style>

      <div className="recipe-details">
        <Link to="/displaycakerecipe" className="btn back-btn mb-4">
          <i className="bi bi-arrow-left me-2"></i> Back to Recipes
        </Link>
        <h1 className="recipe-header">{recipe.cakeName}</h1>
        {recipe.images && recipe.images.length > 0 && (
          <img
            src={recipe.images[0]}
            alt={recipe.cakeName}
            className="recipe-image"
          />
        )}
        <div className="recipe-meta">
          <span className="meta-item">
            <strong>Author:</strong> {recipe.authorName}
          </span>
          <span className="meta-item">
            <strong>Type:</strong> {recipe.cakeType}
          </span>
          <span className="meta-item">
            <strong>Skill Level:</strong> {recipe.skillLevel}
          </span>
          <span className="meta-item">
            <strong>Prep Time:</strong> {recipe.prepTime}
          </span>
          <span className="meta-item">
            <strong>Cook Time:</strong> {recipe.cookTime}
          </span>
          <span className="meta-item">
            <strong>Servings:</strong> {recipe.servings}
          </span>
          <span className="meta-item">
            <strong>Date:</strong> {recipe.date}
          </span>
        </div>
        {recipe.subTitle && (
          <p className="lead">{recipe.subTitle}</p>
        )}
        {recipe.images && recipe.images.length > 1 && (
          <div>
            <h3 className="section-title">Gallery</h3>
            <div className="image-gallery">
              {recipe.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Cake ${index + 1}`}
                  className="gallery-image"
                />
              ))}
            </div>
          </div>
        )}
        <h3 className="section-title">Ingredients</h3>
        <ul className="ingredients-list">
          {recipe.ingredients.split('\n').map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <h3 className="section-title">Instructions</h3>
        <ol className="instructions-list">
          {recipe.instructions.split('\n').map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
        {recipe.comments && recipe.comments.length > 0 && (
          <div>
            <h3 className="section-title">Comments</h3>
            <ul className="list-group">
              {recipe.comments.map((comment, index) => (
                <li key={index} className="list-group-item">
                  {comment}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CakeRecipeDetails;