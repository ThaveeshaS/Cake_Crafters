import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CakeRecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

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

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      fetch(`http://localhost:8080/api/cake-recipes/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete recipe');
          }
          navigate('/displaycakerecipe');
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="error-state text-center py-5">
          <div className="error-icon mb-4">
            <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '4rem' }}></i>
          </div>
          <h2 className="mb-4">Oops! Something went wrong</h2>
          <p className="text-muted mb-4">{error}</p>
          <Link to="/displaycakerecipe" className="btn btn-primary btn-lg">
            <i className="bi bi-arrow-left me-2"></i> Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <style>
        {`
          :root {
            --primary-color: #6c5ce7;
            --secondary-color: #a29bfe;
            --accent-color: #fd79a8;
            --light-color: #f8f9fa;
            --dark-color: #343a40;
            --success-color: #00b894;
            --danger-color: #d63031;
          }
          
          .recipe-details-container {
            max-width: 1000px;
            margin: 0 auto;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            overflow: hidden;
          }
          
          .recipe-header {
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          }
          
          .recipe-title {
            color: var(--dark-color);
            font-weight: 800;
            margin-bottom: 0.5rem;
            font-size: 2.2rem;
          }
          
          .recipe-subtitle {
            color: #6c757d;
            font-size: 1.1rem;
            font-weight: 400;
            margin-bottom: 1.5rem;
          }
          
          .recipe-content {
            padding: 2rem;
          }
          
          .main-image-container {
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 2rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          
          .main-image {
            width: 100%;
            height: 400px;
            object-fit: cover;
            transition: transform 0.5s ease;
          }
          
          .main-image:hover {
            transform: scale(1.02);
          }
          
          .image-counter {
            position: absolute;
            bottom: 15px;
            right: 15px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
          }
          
          .recipe-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            background: #f9f9ff;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 2rem;
          }
          
          .meta-item {
            display: flex;
            align-items: center;
            font-size: 0.95rem;
            color: #555;
          }
          
          .meta-icon {
            margin-right: 8px;
            color: var(--primary-color);
            font-size: 1.1rem;
          }
          
          .section-title {
            color: var(--dark-color);
            font-weight: 700;
            margin: 2rem 0 1.5rem;
            position: relative;
            padding-bottom: 0.75rem;
            font-size: 1.5rem;
          }
          
          .section-title:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 2px;
          }
          
          .ingredients-list {
            list-style-type: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
          }
          
          .ingredient-item {
            background: #f9f9ff;
            padding: 1rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            transition: all 0.3s ease;
          }
          
          .ingredient-item:hover {
            background: #f0f0ff;
            transform: translateY(-3px);
          }
          
          .ingredient-icon {
            margin-right: 10px;
            color: var(--accent-color);
          }
          
          .instructions-list {
            counter-reset: step-counter;
            list-style-type: none;
            padding: 0;
            margin-bottom: 2rem;
          }
          
          .instruction-step {
            position: relative;
            padding-left: 3rem;
            margin-bottom: 1.5rem;
            line-height: 1.6;
          }
          
          .instruction-step:before {
            counter-increment: step-counter;
            content: counter(step-counter);
            position: absolute;
            left: 0;
            top: 0;
            width: 2rem;
            height: 2rem;
            background: var(--primary-color);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          }
          
          .image-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
          }
          
          .gallery-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
          }
          
          .gallery-image:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-color: var(--primary-color);
          }
          
          .gallery-image.active {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.3);
          }
          
          .action-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 2rem;
          }
          
          .back-btn {
            background: var(--primary-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            border: none;
          }
          
          .back-btn:hover {
            background: #5649d1;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
            color: white;
          }
          
          .update-btn {
            background: var(--success-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            border: none;
          }
          
          .update-btn:hover {
            background: #00997b;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 184, 148, 0.3);
            color: white;
          }
          
          .delete-btn {
            background: var(--danger-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            border: none;
          }
          
          .delete-btn:hover {
            background: #c0392b;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(214, 48, 49, 0.3);
            color: white;
          }
          
          .comments-section {
            background: #f9f9ff;
            padding: 2rem;
            border-radius: 12px;
            margin-top: 2rem;
          }
          
          .comment-list {
            list-style-type: none;
            padding: 0;
          }
          
          .comment-item {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            position: relative;
          }
          
          .comment-item:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 4px;
            background: var(--secondary-color);
            border-radius: 0 4px 4px 0;
          }
          
          .empty-state {
            text-align: center;
            padding: 3rem;
            background: #f9f9ff;
            border-radius: 12px;
          }
          
          .empty-state-icon {
            font-size: 4rem;
            color: var(--secondary-color);
            margin-bottom: 1rem;
          }
          
          @media (max-width: 768px) {
            .recipe-title {
              font-size: 1.8rem;
            }
            
            .main-image {
              height: 300px;
            }
            
            .ingredients-list {
              grid-template-columns: 1fr;
            }
            
            .action-buttons {
              flex-direction: column;
            }
            
            .back-btn,
            .update-btn,
            .delete-btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}
      </style>

      <div className="recipe-details-container">
        <div className="recipe-header">
          <h1 className="recipe-title">{recipe.cakeName}</h1>
          {recipe.subTitle && (
            <p className="recipe-subtitle">{recipe.subTitle}</p>
          )}
        </div>

        <div className="recipe-content">
          
          {recipe.images && recipe.images.length > 0 && (
            <div className="main-image-container">
              <img
                src={recipe.images[activeImage]}
                alt={recipe.cakeName}
                className="main-image"
              />
              {recipe.images.length > 1 && (
                <span className="image-counter">
                  {activeImage + 1}/{recipe.images.length}
                </span>
              )}
            </div>
          )}

          <div className="recipe-meta">
            <span className="meta-item">
              <i className="bi bi-person meta-icon"></i>
              <strong>Author:</strong> {recipe.authorName || 'Anonymous'}
            </span>
            <span className="meta-item">
              <i className="bi bi-cake meta-icon"></i>
              <strong>Type:</strong> {recipe.cakeType}
            </span>
            <span className="meta-item">
              <i className="bi bi-speedometer2 meta-icon"></i>
              <strong>Skill:</strong> {recipe.skillLevel}
            </span>
            <span className="meta-item">
              <i className="bi bi-clock meta-icon"></i>
              <strong>Prep:</strong> {recipe.prepTime}
            </span>
            <span className="meta-item">
              <i className="bi bi-egg-fried meta-icon"></i>
              <strong>Cook:</strong> {recipe.cookTime}
            </span>
            <span className="meta-item">
              <i className="bi bi-people meta-icon"></i>
              <strong>Servings:</strong> {recipe.servings}
            </span>
            <span className="meta-item">
              <i className="bi bi-calendar meta-icon"></i>
              <strong>Date:</strong> {recipe.date}
            </span>
          </div>

          {recipe.images && recipe.images.length > 1 && (
            <div>
              <h3 className="section-title">Gallery</h3>
              <div className="image-gallery">
                {recipe.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Cake ${index + 1}`}
                    className={`gallery-image ${index === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="section-title">Ingredients</h3>
            <ul className="ingredients-list">
              {recipe.ingredients.split('\n').map((item, index) => (
                <li key={index} className="ingredient-item">
                  <i className="bi bi-check-circle-fill ingredient-icon"></i>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-title">Instructions</h3>
            <ol className="instructions-list">
              {recipe.instructions.split('\n').map((step, index) => (
                <li key={index} className="instruction-step">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <hr className="my-3" />

          <div className="action-buttons">
            <Link to="/displaycakerecipe" className="btn back-btn" style={{ marginRight: '365px' }}>
              <i className="bi bi-arrow-left me-2"></i> Back to Recipes
            </Link>
            <Link to={`/recipe/${id}/update`} className="btn update-btn" style={{ marginRight: '5px' }}>
              <i className="bi bi-pencil-square me-2"></i> Update Recipe
            </Link>
            <button onClick={handleDelete} className="btn delete-btn">
              <i className="bi bi-trash me-2"></i> Delete Recipe
            </button>
          </div>

          {recipe.comments && recipe.comments.length > 0 ? (
            <div className="comments-section">
              <h3 className="section-title">Comments</h3>
              <ul className="comment-list">
                {recipe.comments.map((comment, index) => (
                  <li key={index} className="comment-item">
                    {comment}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="empty-state">
              <i className="bi bi-chat-left-text empty-state-icon"></i>
              <h4>No Comments Yet</h4>
              <p className="text-muted">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CakeRecipeDetails;