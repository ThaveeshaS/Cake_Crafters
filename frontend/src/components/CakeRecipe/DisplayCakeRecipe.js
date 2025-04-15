import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CakeRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const navigate = useNavigate();

  // Fetch all recipes on component mount
  useEffect(() => {
    fetch('http://localhost:8080/api/cake-recipes')
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error('Error fetching recipes:', error));
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
          .recipe-card {
            transition: transform 0.3s, box-shadow 0.3s;
            border-radius: 15px;
            overflow: hidden;
            background: #fff;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
          }
          .recipe-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          }
          .recipe-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            cursor: pointer;
          }
          .recipe-body {
            padding: 1.5rem;
          }
          .recipe-title {
            color: #2a5bd7;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }
          .recipe-author {
            color: #666;
            font-size: 0.9rem;
          }
          .like-btn {
            background: none;
            border: none;
            color: #2a5bd7;
            font-size: 1.2rem;
            transition: color 0.3s;
          }
          .like-btn:hover {
            color: #e63946;
          }
          .comment-area {
            margin-top: 1rem;
          }
          .comment-input {
            resize: none;
            height: 80px;
          }
          .comment-submit {
            background: #2a5bd7;
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 5px;
            transition: background 0.3s;
          }
          .comment-submit:hover {
            background: #1e4ac4;
          }
          .comment-list {
            max-height: 150px;
            overflow-y: auto;
            margin-top: 1rem;
            padding: 0.5rem;
            background: #f8faff;
            border-radius: 5px;
          }
          .comment-item {
            font-size: 0.9rem;
            color: #333;
            margin-bottom: 0.5rem;
          }
          .add-recipe-btn {
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            transition: background 0.3s;
          }
          .add-recipe-btn:hover {
            background: #218838;
          }
        `}
      </style>

      {/* Add New Cake Recipe Button */}
      <div className="d-flex justify-content-end mb-4">
        <Link to="/addnewcakerecipe" className="btn add-recipe-btn">
          <i className="bi bi-plus-circle me-2"></i> Add New Cake Recipe
        </Link>
      </div>

      {/* Recipes Grid */}
      <div className="row">
        {recipes.length === 0 ? (
          <p className="text-center text-muted">No recipes found.</p>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe.id} className="col-md-4">
              <div className="recipe-card">
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
                    style={{ height: '200px' }}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  >
                    <span className="text-muted">No Image</span>
                  </div>
                )}
                <div className="recipe-body">
                  <h5 className="recipe-title">{recipe.cakeName}</h5>
                  <p className="recipe-author">By {recipe.authorName}</p>
                  <div className="d-flex align-items-center mb-2">
                    <button
                      className="like-btn"
                      onClick={() => handleLike(recipe.id)}
                    >
                      <i className="bi bi-heart-fill"></i> {recipe.likes || 0}
                    </button>
                  </div>
                  <div className="comment-area">
                    <textarea
                      className="form-control comment-input"
                      placeholder="Add a comment..."
                      value={commentInputs[recipe.id] || ''}
                      onChange={(e) => handleCommentChange(recipe.id, e.target.value)}
                    />
                    <button
                      className="comment-submit mt-2"
                      onClick={() => handleCommentSubmit(recipe.id)}
                    >
                      Submit
                    </button>
                    {recipe.comments && recipe.comments.length > 0 && (
                      <div className="comment-list">
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
          ))
        )}
      </div>
    </div>
  );
};

export default CakeRecipe;