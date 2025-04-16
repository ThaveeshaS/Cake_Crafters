import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

function DecorationTips() {
  const [tips, setTips] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const menuRefs = useRef({});

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/decoration-tips');
      const sortedTips = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTips(sortedTips);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch tips:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!Object.values(menuRefs.current).some(ref => ref && ref.contains(event.target))) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/decoration-tips/${id}`);
      setTips(tips.filter((tip) => tip.id !== id));
      setMenuOpen(null);
    } catch (err) {
      console.error('Failed to delete tip:', err);
    }
  };

  const handleEdit = (tip) => {
    navigate('/create-decoration-tips', { state: { tip } });
    setMenuOpen(null);
  };

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleLike = async (id) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/decoration-tips/${id}/like`);
      setTips(tips.map(tip => tip.id === id ? response.data : tip));
    } catch (err) {
      console.error('Failed to like tip:', err);
    }
  };

  const handleCommentSubmit = async (id, e) => {
    e.preventDefault();
    if (!newComment[id]?.trim()) return;

    const comment = {
      text: newComment[id],
      author: 'User',
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post(`http://localhost:8080/api/decoration-tips/${id}/comment`, comment);
      setTips(tips.map(tip => tip.id === id ? response.data : tip));
      setNewComment({ ...newComment, [id]: '' });
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleCommentDelete = async (tipId, commentId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/decoration-tips/${tipId}/comment/${commentId}`);
      setTips(tips.map(tip => tip.id === tipId ? response.data : tip));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
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

          .tip-card {
            transition: all 0.3s ease;
            border-radius: 12px;
            overflow: hidden;
            background: #fff;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
            margin-bottom: 2rem;
            border: none;
            position: relative;
          }

          .tip-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
          }

          .tip-image-container {
            position: relative;
            overflow: hidden;
            cursor: pointer;
            height: 220px;
          }

          .tip-image-carousel {
            display: flex;
            width: 100%;
            height: 100%;
          }

          .tip-image {
            width: 100%;
            height: 220px;
            object-fit: cover;
            flex-shrink: 0;
            transition: transform 0.5s ease;
          }

          .tip-card:hover .tip-image {
            transform: scale(1.05);
          }

          .tip-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
            padding: 1rem;
            color: white;
          }

          .tip-body {
            padding: 1.5rem;
          }

          .tip-title {
            color: white;
            font-weight: 700;
            margin-bottom: 0;
            font-size: 1.25rem;
          }

          .tip-author {
            color: #6c757d;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
          }

          .tip-author i {
            margin-right: 5px;
            color: var(--secondary-color);
          }

          .like-btn, .comment-btn {
            background: none;
            border: none;
            color: var(--accent-color);
            font-size: 1.2rem;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            padding: 0.5rem 0;
            margin-right: 1rem;
          }

          .like-btn:hover, .comment-btn:hover {
            color: #e84393;
            transform: scale(1.1);
          }

          .like-count, .comment-count {
            margin-left: 5px;
            font-size: 0.9rem;
            color: var(--dark-color);
          }

          .comment-section {
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
            width: 100%;
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
            display: flex;
            align-items: center;
            gap: 0.5rem;
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

          .create-btn {
            background: var(--secondary-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: 500;
            border: none;
            display: inline-flex;
            align-items: center;
          }

          .create-btn:hover {
            background: #8a84fb;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(162, 155, 254, 0.3);
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

          .no-tips-card {
            text-align: center;
            padding: 3rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }

          .no-tips-icon {
            font-size: 4rem;
            color: var(--secondary-color);
            margin-bottom: 1rem;
          }

          .no-tips-text {
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

          .menu-container {
            position: absolute;
            top: 1rem;
            right: 1rem;
            cursor: pointer;
            z-index: 10;
          }

          .menu-icon {
            font-size: 1.2rem;
            color: #fff;
            background: rgba(0, 0, 0, 0.5);
            padding: 5px;
            border-radius: 50%;
            transition: color 0.2s ease;
          }

          .menu-icon:hover {
            color: #ddd;
          }

          .dropdown-menu {
            position: absolute;
            top: 2rem;
            right: 0;
            background: #fff;
            border: none;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            min-width: 120px;
            display: block;
          }

          .dropdown-item {
            padding: 0.5rem 1rem;
            color: #343a40;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .dropdown-item:hover {
            background: #e7f1ff;
            color: #007bff;
          }

          .dropdown-item.edit i {
            color: #007bff;
          }

          .dropdown-item.delete {
            color: #dc3545;
          }

          .dropdown-item.delete i {
            color: #dc3545;
          }

          .dropdown-item.delete:hover {
            background: #f8d7da;
            color: #dc3545;
          }

          .comment-delete {
            background: none;
            border: none;
            color: #dc3545;
            cursor: pointer;
            font-size: 0.8rem;
            padding: 0.25rem 0.5rem;
            transition: all 0.2s ease;
          }

          .comment-delete:hover {
            color: #bd2130;
            background: #f8d7da;
            border-radius: 4px;
          }

          .comment-delete i {
            font-size: 0.9rem;
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

      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="section-title">Cake Decorating Tips</h1>
        <Link to="/create-decoration-tips" className="btn create-btn">
          <i className="bi bi-plus-circle me-2"></i>
          Create Decoration Tips
        </Link>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border spinner" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-12 mx-auto">
            {tips.length === 0 ? (
              <div className="no-tips-card">
                <i className="bi bi-lightbulb no-tips-icon"></i>
                <h3>No Decorating Tips Yet</h3>
                <p className="no-tips-text">Be the first to share a creative decorating tip!</p>
                <Link to="/create-decoration-tips" className="btn create-btn mt-3">
                  <i className="bi bi-plus-circle me-2"></i> Create Tip
                </Link>
              </div>
            ) : (
              <div className="row">
                {tips.map((tip) => {
                  const imageCount = tip.media && tip.mediaType !== 'video' ? tip.media.length : 1;
                  const slideDuration = imageCount * 10; // 10 seconds per image (as per original code)
                  const percentagePerImage = 100 / imageCount;
                  const keyframes = Array.from({ length: imageCount }, (_, i) => {
                    const start = i * percentagePerImage;
                    const end = (i + 1) * percentagePerImage;
                    const translateX = -(i * 100);
                    return `
                      ${start}% { transform: translateX(${translateX}%); }
                      ${end}% { transform: translateX(${translateX}%); }
                    `;
                  }).join('');

                  return (
                    <div key={tip.id} className="col-lg-4 col-md-6 mb-4">
                      <style>
                        {`
                          .tip-image-carousel-${tip.id} {
                            animation: slide-${tip.id} ${slideDuration}s infinite linear;
                          }
                          @keyframes slide-${tip.id} {
                            ${keyframes}
                            100% { transform: translateX(0); }
                          }
                        `}
                      </style>
                      <div className="tip-card h-100">
                        <div className="tip-image-container">
                          <Link to={`/display-decoration-tip/${tip.id}`}>
                            {tip.media && tip.media.length > 0 ? (
                              tip.mediaType === 'video' ? (
                                <video
                                  src={tip.media[0]}
                                  className="tip-image"
                                  muted
                                  loop
                                  autoPlay
                                />
                              ) : tip.media.length > 1 ? (
                                <div className={`tip-image-carousel tip-image-carousel-${tip.id}`}>
                                  {tip.media.map((media, index) => (
                                    <img
                                      key={index}
                                      src={media}
                                      alt={`${tip.title} ${index + 1}`}
                                      className="tip-image"
                                    />
                                  ))}
                                </div>
                              ) : (
                                <img
                                  src={tip.media[0]}
                                  alt={tip.title}
                                  className="tip-image"
                                />
                              )
                            ) : (
                              <div
                                className="tip-image bg-light d-flex align-items-center justify-content-center"
                                style={{ height: '220px' }}
                              >
                                <i className="bi bi-cake2 text-muted" style={{ fontSize: '3rem' }}></i>
                              </div>
                            )}
                          </Link>
                          <div className="tip-overlay">
                            <h5 className="tip-title">{tip.title}</h5>
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
                                  className="dropdown-item edit"
                                  onClick={() => handleEdit(tip)}
                                >
                                  <i className="bi bi-pencil"></i>
                                  Edit
                                </div>
                                <div
                                  className="dropdown-item delete"
                                  onClick={() => handleDelete(tip.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                  Delete
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="tip-body">
                          <p className="tip-author">
                            <i className="bi bi-person"></i> {tip.author}
                          </p>
                          <div className="d-flex align-items-center mb-3">
                            <button 
                              className="like-btn"
                              onClick={() => handleLike(tip.id)}
                            >
                              <i className="bi bi-heart-fill"></i>
                              <span className="like-count">{tip.likes || 0}</span>
                            </button>
                            <button 
                              className="comment-btn"
                              onClick={() => toggleComments(tip.id)}
                            >
                              <i className="bi bi-chat"></i>
                              <span className="comment-count">{(tip.comments || []).length}</span>
                            </button>
                          </div>
                          {showComments[tip.id] && (
                            <div className="comment-section">
                              <form 
                                className="comment-form" 
                                onSubmit={(e) => handleCommentSubmit(tip.id, e)}
                              >
                                <textarea
                                  className="form-control comment-input mb-2"
                                  placeholder="Share your thoughts..."
                                  value={newComment[tip.id] || ''}
                                  onChange={(e) => setNewComment({
                                    ...newComment,
                                    [tip.id]: e.target.value
                                  })}
                                />
                                <button type="submit" className="comment-submit">
                                  <i className="bi bi-send me-2"></i>
                                  Post Comment
                                </button>
                              </form>
                              {(tip.comments || []).length > 0 && (
                                <div className="comment-list mt-3">
                                  <h6 className="mb-3 text-muted" style={{ fontSize: '0.8rem' }}>
                                    <i className="bi bi-chat-left-text me-2"></i>Comments
                                  </h6>
                                  {(tip.comments || []).map((comment) => (
                                    <div key={comment.id} className="comment-item">
                                      <div className="comment-content">
                                        <p className="comment-text">{comment.text}</p>
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
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DecorationTips;