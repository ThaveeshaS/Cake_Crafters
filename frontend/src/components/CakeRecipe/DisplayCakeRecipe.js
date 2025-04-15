import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CakeRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all recipes on component mount
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/api/cake-recipes')
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      });
  }, []);

  // Handle like button click
  const handleLike = (id) => {
    fetch(`http://localhost:8080/api/cake-recipes/${id}/like`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((updatedRecipe) => {
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe.id === id ? { ...recipe, likes: updatedRecipe.likes } : recipe
          )
        );
      })
      .catch((error) => console.error('Error liking recipe:', error));
  };

  // Handle comment submission
  const handleCommentSubmit = (id) => {
    const comment = commentInputs[id];
    if (!comment) return;

    fetch(`http://localhost:8080/api/cake-recipes/${id}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    })
      .then((response) => response.json())
      .then((updatedRecipe) => {
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe.id === id ? { ...recipe, comments: updatedRecipe.comments } : recipe
          )
        );
        setCommentInputs((prev) => ({ ...prev, [id]: '' }));
      })
      .catch((error) => console.error('Error adding comment:', error));
  };

  // Handle comment input change
  const handleCommentChange = (id, value) => {
    setCommentInputs((prev) => ({ ...prev, [id]: value }));
  };

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
          }
          
          body {
            background-color: #f8f9fa;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          
          .recipe-card {
            transition: all 0.3s ease;
            border-radius: 12px;
            overflow: hidden;
            background: #fff;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
            margin-bottom: 2rem;
            border: none;
            position: relative;
          }
          
          .recipe-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
          }
          
          .recipe-image-container {
            position: relative;
            overflow: hidden;
          }
          
          .recipe-image {
            width: 100%;
            height: 220px;
            object-fit: cover;
            transition: transform 0.5s ease;
          }
          
          .recipe-card:hover .recipe-image {
            transform: scale(1.05);
          }
          
          .recipe-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
            padding: 1rem;
            color: white;
          }
          
          .recipe-body {
            padding: 1.5rem;
          }
          
          .recipe-title {
            color: var(--dark-color);
            font-weight: 700;
            margin-bottom: 0.5rem;
            font-size: 1.25rem;
          }
          
          .recipe-author {
            color: #6c757d;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
          }
          
          .recipe-author i {
            margin-right: 5px;
            color: var(--secondary-color);
          }
          
          .like-btn {
            background: none;
            border: none;
            color: var(--accent-color);
            font-size: 1.2rem;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            padding: 0.5rem 0;
          }
          
          .like-btn:hover {
            color: #e84393;
            transform: scale(1.1);
          }
          
          .like-count {
            margin-left: 5px;
            font-size: 0.9rem;
            color: var(--dark-color);
          }
          
          .comment-area {
            margin-top: 1.5rem;
            border-top: 1px solid #eee;
            padding-top: 1rem;
          }
          
          .comment-input {
            resize: none;
            height: 80px;
            border-radius: 8px;
            border: 1px solid #ddd;
            padding: 0.75rem;
            font-size: 0.9rem;
            transition: border 0.3s;
          }
          
          .comment-input:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(108, 92, 231, 0.25);
            outline: none;
          }
          
          .comment-submit {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: 500;
            margin-top: 0.5rem;
          }
          
          .comment-submit:hover {
            background: #5649d1;
            transform: translateY(-2px);
          }
          
          .comment-list {
            max-height: 150px;
            overflow-y: auto;
            margin-top: 1rem;
            padding: 0.75rem;
            background: #f9f9f9;
            border-radius: 8px;
          }
          
          .comment-item {
            font-size: 0.85rem;
            color: #495057;
            margin-bottom: 0.75rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid #eee;
            position: relative;
            padding-left: 1rem;
          }
          
          .comment-item:before {
            content: '';
            position: absolute;
            left: 0;
            top: 5px;
            height: 60%;
            width: 3px;
            background: var(--secondary-color);
            border-radius: 3px;
          }
          
          .add-recipe-btn {
            background: var(--success-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: 500;
            border: none;
            display: inline-flex;
            align-items: center;
          }
          
          .add-recipe-btn:hover {
            background: #00997b;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 184, 148, 0.3);
            color: white;
          }
          
          .loading-spinner {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
          }
          
          .spinner {
            width: 3rem;
            height: 3rem;
            color: var(--primary-color);
          }
          
          .empty-state {
            text-align: center;
            padding: 3rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          
          .empty-state-icon {
            font-size: 4rem;
            color: var(--secondary-color);
            margin-bottom: 1rem;
          }
          
          .empty-state-text {
            color: #6c757d;
            font-size: 1.1rem;
          }
          
          .section-title {
            color: var(--dark-color);
            font-weight: 700;
            margin-bottom: 2rem;
            position: relative;
            padding-bottom: 0.5rem;
          }
          
          .section-title:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 3px;
            background: var(--primary-color);
            border-radius: 3px;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: var(--secondary-color);
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #888;
          }
        `}
      </style>

      {/* Header and Add Recipe Button */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="section-title">Delicious Cake Recipes</h1>
        <Link to="/addnewcakerecipe" className="btn add-recipe-btn">
          <i className="bi bi-plus-circle me-2"></i> Add New Recipe
        </Link>
      </div>

      {/* Recipes Grid */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border spinner" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-cake empty-state-icon"></i>
          <h3>No Recipes Found</h3>
          <p className="empty-state-text">Be the first to add a delicious cake recipe!</p>
          <Link to="/addnewcakerecipe" className="btn add-recipe-btn mt-3">
            <i className="bi bi-plus-circle me-2"></i> Add Recipe
          </Link>
        </div>
      ) : (
        <div className="row">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="col-lg-4 col-md-6 mb-4">
              <div className="recipe-card h-100">
                <div className="recipe-image-container">
                  {recipe.images && recipe.images.length > 0 ? (
                    <img
                      src={recipe.images[0]}
                      alt={recipe.cakeName}
                      className="recipe-image"
                      onClick={() => navigate(`/recipe/${recipe.id}`)}
                    />
                  ) : (
                    <div
                      className="recipe-image bg-light d-flex align-items-center justify-content-center"
                      style={{ height: '220px' }}
                      onClick={() => navigate(`/recipe/${recipe.id}`)}
                    >
                      <i className="bi bi-cake2 text-muted" style={{ fontSize: '3rem' }}></i>
                    </div>
                  )}
                  <div className="recipe-overlay">
                    <h5 className="recipe-title text-white mb-0">{recipe.cakeName}</h5>
                  </div>
                </div>
                <div className="recipe-body">
                  <p className="recipe-author">
                    <i className="bi bi-person"></i> By {recipe.authorName || 'Anonymous'}
                  </p>
                  <div className="d-flex align-items-center mb-3">
                    <button
                      className="like-btn"
                      onClick={() => handleLike(recipe.id)}
                    >
                      <i className="bi bi-heart-fill"></i>
                      <span className="like-count">{recipe.likes || 0}</span>
                    </button>
                  </div>
                  <div className="comment-area">
                    <textarea
                      className="form-control comment-input mb-2"
                      placeholder="Share your thoughts..."
                      value={commentInputs[recipe.id] || ''}
                      onChange={(e) => handleCommentChange(recipe.id, e.target.value)}
                    />
                    <button
                      className="btn comment-submit"
                      onClick={() => handleCommentSubmit(recipe.id)}
                    >
                      <i className="bi bi-send me-2"></i>Post Comment
                    </button>
                    {recipe.comments && recipe.comments.length > 0 && (
                      <div className="comment-list mt-3">
                        <h6 className="mb-3 text-muted" style={{ fontSize: '0.8rem' }}>
                          <i className="bi bi-chat-left-text me-2"></i>Comments
                        </h6>
                        {recipe.comments.map((comment, index) => (
                          <p key={index} className="comment-item">
                            {comment}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CakeRecipe;