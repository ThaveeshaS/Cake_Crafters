// DecorationTips.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function DecorationTips() {
  const [tips, setTips] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showComments, setShowComments] = useState({});
  const navigate = useNavigate();
  const menuRefs = useRef({});

  useEffect(() => {
    const storedTips = JSON.parse(localStorage.getItem('decorationTips') || '[]');
    const sortedTips = storedTips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setTips(sortedTips.map(tip => ({ ...tip, likes: tip.likes || 0 })));
    
    // Load comments from localStorage
    const storedComments = JSON.parse(localStorage.getItem('tipComments') || '{}');
    setComments(storedComments);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!Object.values(menuRefs.current).some(ref => ref && ref.contains(event.target))) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = (id) => {
    const updatedTips = tips.filter((tip) => tip.id !== id);
    localStorage.setItem('decorationTips', JSON.stringify(updatedTips));
    setTips(updatedTips);
    setMenuOpen(null);
  };

  const handleEdit = (tip) => {
    navigate('/create-decoration-tips', { state: { tip } });
    setMenuOpen(null);
  };

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleLike = (id) => {
    const updatedTips = tips.map(tip => 
      tip.id === id ? { ...tip, likes: (tip.likes || 0) + 1 } : tip
    );
    setTips(updatedTips);
    localStorage.setItem('decorationTips', JSON.stringify(updatedTips));
  };

  const handleCommentSubmit = (id, e) => {
    e.preventDefault();
    if (!newComment[id]?.trim()) return;

    const updatedComments = {
      ...comments,
      [id]: [
        ...(comments[id] || []),
        {
          id: Date.now(),
          text: newComment[id],
          createdAt: new Date().toISOString(),
          author: 'User' // Could be enhanced with actual user data
        }
      ]
    };

    setComments(updatedComments);
    localStorage.setItem('tipComments', JSON.stringify(updatedComments));
    
    setNewComment({
      ...newComment,
      [id]: ''
    });
  };

  const handleCommentDelete = (tipId, commentId) => {
    const updatedComments = {
      ...comments,
      [tipId]: (comments[tipId] || []).filter(comment => comment.id !== commentId)
    };

    setComments(updatedComments);
    localStorage.setItem('tipComments', JSON.stringify(updatedComments));
  };

  const toggleComments = (id) => {
    setShowComments({
      ...showComments,
      [id]: !showComments[id]
    });
  };

  return (
    <div className="container py-5">
      <style>
        {`
          .tips-container {
            max-width: 1000px;
            margin: 0 auto;
          }
          .create-btn {
            background: linear-gradient(45deg, #007bff, #00d4ff);
            border: none;
            padding: 12px 30px;
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 50px;
            transition: all 0.3s ease;
            color: white;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            box-shadow: 0 2px 8px rgba(0,123,255,0.3);
          }
          .create-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,123,255,0.4);
            color: white;
            text-decoration: none;
          }
          .tip-card {
            background: linear-gradient(145deg, #ffffff, #f8f9fa);
            border-radius: 16px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
            padding: 2rem;
            margin-bottom: 2rem;
            position: relative;
            border: none;
            width: 100%;
            max-width: 950px;
            transition: transform 0.3s ease;
          }
          .tip-card:hover {
            transform: translateY(-5px);
          }
          .tip-card-header {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid #e9ecef;
            padding-bottom: 1rem;
          }
          .tip-card-author {
            font-weight: 700;
            color: #1a3c87;
            font-size: 1.2rem;
            background: linear-gradient(45deg, #007bff, #00d4ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .tip-card-time {
            color: #6c757d;
            font-size: 0.9rem;
            margin-left: 1rem;
            font-style: italic;
          }
          .tip-card-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1a3c87;
            margin-bottom: 1rem;
            line-height: 1.3;
          }
          .tip-card-description {
            color: #343a40;
            margin-bottom: 1.5rem;
            font-size: 1rem;
            line-height: 1.6;
          }
          .tip-card-tip {
            background: #e7f1ff;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            color: #343a40;
            font-size: 1rem;
            line-height: 1.6;
            border-left: 4px solid #007bff;
          }
          .tip-card-media {
            margin-bottom: 1.5rem;
          }
          .tip-card-media img,
          .tip-card-media video {
            width: 100%;
            max-height: 450px;
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .tip-card-media-carousel {
            display: flex;
            overflow-x: auto;
            gap: 1.5rem;
            padding-bottom: 1rem;
            scrollbar-width: thin;
          }
          .tip-card-media-carousel img {
            flex: 0 0 auto;
            width: 100%;
            max-width: 350px;
            height: 250px;
            object-fit: cover;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .tip-card-hashtags {
            position: absolute;
            top: 1.5rem;
            right: 4rem;
            display: flex;
            gap: 0.75rem;
          }
          .hashtag {
            background: linear-gradient(45deg, #007bff, #00d4ff);
            color: white;
            padding: 0.4rem 0.8rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            box-shadow: 0 1px 4px rgba(0,123,255,0.2);
          }
          .no-tips-card {
            background: linear-gradient(145deg, #e7f1ff, #f8f9fa);
            border-radius: 16px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.08);
            padding: 3rem;
            text-align: center;
            max-width: 950px;
            margin: 0 auto;
          }
          .no-tips-card h5 {
            color: #1a3c87;
            font-weight: 700;
            font-size: 1.5rem;
          }
          .no-tips-card p {
            color: #6c757d;
            font-size: 1.1rem;
          }
          .menu-container {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            cursor: pointer;
          }
          .menu-icon {
            font-size: 1.4rem;
            color: #6c757d;
            transition: color 0.2s ease;
          }
          .menu-icon:hover {
            color: #1a3c87;
          }
          .dropdown-menu {
            position: absolute;
            top: 2.5rem;
            right: 0;
            background: #fff;
            border: none;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            min-width: 140px;
            display: block;
          }
          .dropdown-item {
            padding: 0.75rem 1.5rem;
            color: #343a40;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .dropdown-item:hover {
            background: #e7f1ff;
            color: #007bff;
          }
          .dropdown-item.delete {
            color: #dc3545;
          }
          .dropdown-item.delete:hover {
            background: #f8d7da;
            color: #dc3545;
          }
          .interaction-bar {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
            padding: 1rem 0;
            border-top: 1px solid #e9ecef;
          }
          .like-btn, .comment-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: none;
            border: none;
            color: #6c757d;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .like-btn:hover {
            color: #dc3545;
          }
          .comment-btn:hover {
            color: #007bff;
          }
          .like-btn.liked {
            color: #dc3545;
          }
          .like-btn i, .comment-btn i {
            font-size: 1.2rem;
          }
          .comment-section {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e9ecef;
            transition: all 0.3s ease;
          }
          .comment-form {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }
          .comment-input {
            flex: 1;
            border-radius: 20px;
            border: 1px solid #e9ecef;
            padding: 0.75rem 1.5rem;
            font-size: 0.95rem;
          }
          .comment-input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
          }
          .comment-submit {
            background: linear-gradient(45deg, #007bff, #00d4ff);
            border: none;
            border-radius: 20px;
            padding: 0.75rem 1.5rem;
            color: white;
            font-weight: 600;
            transition: all 0.2s ease;
          }
          .comment-submit:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,123,255,0.3);
          }
          .comment-list {
            max-height: 300px;
            overflow-y: auto;
            padding-right: 1rem;
          }
          .comment-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 1rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 12px;
            position: relative;
          }
          .comment-content {
            flex: 1;
          }
          .comment-author {
            font-weight: 600;
            color: #1a3c87;
            font-size: 0.95rem;
          }
          .comment-text {
            color: #343a40;
            font-size: 0.95rem;
            line-height: 1.5;
          }
          .comment-time {
            color: #6c757d;
            font-size: 0.85rem;
            font-style: italic;
          }
          .comment-delete {
            background: none;
            border: none;
            color: #dc3545;
            cursor: pointer;
            font-size: 0.9rem;
            padding: 0.25rem 0.5rem;
            transition: all 0.2s ease;
          }
          .comment-delete:hover {
            color: #bd2130;
            background: #f8d7da;
            border-radius: 4px;
          }
          .comment-delete i {
            font-size: 1rem;
          }
        `}
      </style>
      <div className="tips-container">
        <div className="d-flex justify-content-end mb-4">
          <Link to="/create-decoration-tips" className="btn create-btn">
            <i className="bi bi-plus-circle me-2"></i>
            Create Decoration Tips
          </Link>
        </div>
        <div className="row">
          <div className="col-lg-12 mx-auto">
            <h1 className="display-5 text-center mb-5" style={{ color: '#1a3c87' }}>
              Cake Decorating Tips
            </h1>
            {tips.length === 0 ? (
              <div className="no-tips-card">
                <h5 className="mb-3">No Decorating Tips Yet</h5>
                <p>Be the first to share a creative decorating tip!</p>
              </div>
            ) : (
              tips.map((tip) => (
                <div key={tip.id} className="tip-card">
                  <div className="tip-card-hashtags">
                    <span className="hashtag">#{tip.category}</span>
                    <span className="hashtag">#{tip.difficulty}</span>
                  </div>
                  <div 
                    className="menu-container" 
                    ref={(el) => (menuRefs.current[tip.id] = el)}
                  >
                    <i
                      className="bi bi-three-dots menu-icon"
                      onClick={() => toggleMenu(tip.id)}
                    ></i>
                    {menuOpen === tip.id && (
                      <div className="dropdown-menu">
                        <div
                          className="dropdown-item"
                          onClick={() => handleEdit(tip)}
                        >
                          Edit
                        </div>
                        <div
                          className="dropdown-item delete"
                          onClick={() => handleDelete(tip.id)}
                        >
                          Delete
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="tip-card-header">
                    <span className="tip-card-author">{tip.author}</span>
                    <span className="tip-card-time">
                      {new Date(tip.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="tip-card-title">{tip.title}</h3>
                  <p className="tip-card-description">{tip.description}</p>
                  <div className="tip-card-tip">
                    <strong>Tip:</strong> {tip.tip}
                  </div>
                  {tip.media.length > 0 && (
                    <div className="tip-card-media">
                      {tip.mediaType === 'images' ? (
                        <div className="tip-card-media-carousel">
                          {tip.media.map((media, index) => (
                            <img key={index} src={media} alt={`Tip media ${index + 1}`} />
                          ))}
                        </div>
                      ) : (
                        <video controls>
                          <source src={tip.media[0]} type="video/mp4" />
                        </video>
                      )}
                    </div>
                  )}
                  <div className="interaction-bar">
                    <button 
                      className={`like-btn ${tip.liked ? 'liked' : ''}`}
                      onClick={() => handleLike(tip.id)}
                    >
                      <i className={`bi ${tip.liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                      <span>{tip.likes || 0} Likes</span>
                    </button>
                    <button 
                      className="comment-btn"
                      onClick={() => toggleComments(tip.id)}
                    >
                      <i className="bi bi-chat"></i>
                      <span>{(comments[tip.id] || []).length} Comments</span>
                    </button>
                  </div>
                  {showComments[tip.id] && (
                    <div className="comment-section">
                      <form 
                        className="comment-form" 
                        onSubmit={(e) => handleCommentSubmit(tip.id, e)}
                      >
                        <input
                          type="text"
                          className="comment-input"
                          placeholder="Add a comment..."
                          value={newComment[tip.id] || ''}
                          onChange={(e) => setNewComment({
                            ...newComment,
                            [tip.id]: e.target.value
                          })}
                        />
                        <button type="submit" className="comment-submit">
                          Post
                        </button>
                      </form>
                      <div className="comment-list">
                        {(comments[tip.id] || []).map((comment) => (
                          <div key={comment.id} className="comment-item">
                            <div className="comment-content">
                              <div className="comment-author">{comment.author}</div>
                              <div className="comment-text">{comment.text}</div>
                              <div className="comment-time">
                                {new Date(comment.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <button 
                              className="comment-delete"
                              onClick={() => handleCommentDelete(tip.id, comment.id)}
                              title="Delete comment"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DecorationTips;