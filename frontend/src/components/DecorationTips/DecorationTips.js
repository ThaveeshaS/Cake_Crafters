import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

function DecorationTips() {
  const [tips, setTips] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [newComment, setNewComment] = useState({});
  const [editComment, setEditComment] = useState({});
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

  const handleCommentEdit = async (tipId, commentId, e) => {
    e.preventDefault();
    if (!editComment[commentId]?.trim()) return;

    const updatedComment = {
      text: editComment[commentId],
      author: 'User',
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.put(`http://localhost:8080/api/decoration-tips/${tipId}/comment/${commentId}`, updatedComment);
      setTips(tips.map(tip => tip.id === tipId ? response.data : tip));
      setEditComment({ ...editComment, [commentId]: null });
    } catch (err) {
      console.error('Failed to edit comment:', err);
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

  // Function to format date to MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
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
            --danger-color: #d63031;
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

          .tip-details {
            color: #6c757d;
            font-size: 0.85rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
          }

          .tip-details i {
            margin-right: 5px;
            color: var(--primary-color);
            font-size: 0.9rem;
          }

          .tip-details span {
            font-weight: 500;
            color: #6c757d;
          }

          .provided-by span {
            font-weight: bold;
          }

          .vote-btn, .comment-btn {
            background: none;
            border: none;
            color: var(--accent-color);
            font-size: 1.2rem;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            padding: 0.5rem;
            margin-right: 1rem;
          }

          .vote-btn:hover, .comment-btn:hover {
            color: #e84393;
            transform: scale(1.1);
          }

          .vote-count, .comment-count {
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

          .comment-submit, .comment-edit-submit, .comment-cancel {
            border: none;
            cursor: pointer;
            font-size: 0.9rem;
            padding: 0.5rem;
            border-radius: 6px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            margin-top: 0.5rem;
          }

          .comment-submit {
            background: var(--primary-color);
            color: white;
          }

          .comment-submit:hover {
            background: #5649d1;
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(108, 92, 231, 0.3);
          }

          .comment-edit-submit {
            background: var(--primary-color);
            color: white;
          }

          .comment-edit-submit:hover {
            background: #5649d1;
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(108, 92, 231, 0.3);
          }

          .comment-cancel {
            background: #f8f9fa;
            border: 1px solid var(--primary-color);
            color: var(--primary-color);
          }

          .comment-cancel:hover {
            background: var(--primary-color);
            color: white;
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(108, 92, 231, 0.3);
          }

          .comment-submit i, .comment-edit-submit i, .comment-cancel i {
            font-size: 1rem;
          }

          .comment-list {
            max-height: 150px;
            overflow-y: auto;
            margin-top: 1rem;
            padding: 0.75rem;
            background: #f9f9f9;
            border-radius: 8px;
            position: relative;
          }

          .comment-item {
            font-size: 0.85rem;
            color: #495057;
            margin-bottom: 0.75rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid #eee;
            position: relative;
            padding-left: 1rem;
            padding-right: 80px; /* Space for horizontal buttons */
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

          .comment-content {
            position: relative;
          }

          .comment-actions {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            flex-direction: row; /* Stack buttons horizontally */
            gap: 0.5rem;
            align-items: center;
          }

          .create-btn {
            background: var(--primary-color);
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
            background: #5649d1;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
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
            color: var(--primary-color);
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
            font-size: 1.5rem;
            color: #fff;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            padding: 10px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }

          .menu-icon:hover {
            background: linear-gradient(135deg, #5649d1, #8e7ce0);
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            color: #fff;
            opacity: 0.9;
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
            min-width: 140px; /* Increased to fit styled buttons */
            display: block;
            padding: 0.5rem;
          }

          .dropdown-item {
            padding: 0.5rem 0.75rem;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border-radius: 8px;
            margin: 0.25rem 0;
            background: var(--light-color);
            border: 1px solid transparent;
          }

          .dropdown-item:hover {
            transform: scale(1.05);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .dropdown-item.edit {
            color: var(--primary-color);
            border-color: var(--primary-color);
          }

          .dropdown-item.edit i {
            color: var(--primary-color);
            font-size: 1.1rem;
          }

          .dropdown-item.edit:hover {
            background: var(--primary-color);
            color: #fff;
            border-color: var(--primary-color);
          }

          .dropdown-item.edit:hover i {
            color: #fff;
          }

          .dropdown-item.delete {
            color: var(--danger-color);
            border-color: var(--danger-color);
          }

          .dropdown-item.delete i {
            color: var(--danger-color);
            font-size: 1.1rem;
          }

          .dropdown-item.delete:hover {
            background: var(--danger-color);
            color: #fff;
            border-color: var(--danger-color);
          }

          .dropdown-item.delete:hover i {
            color: #fff;
          }

          .comment-edit, .comment-delete {
            background: #f8f9fa; /* Light background for contrast */
            border: 1px solid var(--primary-color);
            cursor: pointer;
            font-size: 0.9rem;
            padding: 0.5rem;
            border-radius: 6px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
          }

          .comment-edit {
            color: var(--primary-color);
          }

          .comment-delete {
            color: var(--danger-color);
            border-color: var(--danger-color);
          }

          .comment-edit:hover {
            background: var(--primary-color);
            color: white;
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(108, 92, 231, 0.3);
          }

          .comment-delete:hover {
            background: var(--danger-color);
            color: white;
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(214, 48, 49, 0.3);
          }

          .comment-edit i, .comment-delete i {
            font-size: 1rem;
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

          @media (max-width: 768px) {
            .comment-item {
              padding-right: 70px; /* Adjust for smaller screens */
            }

            .menu-icon {
              width: 36px;
              height: 36px;
              font-size: 1.3rem;
              padding: 8px;
            }

            .dropdown-menu {
              min-width: 120px; /* Slightly smaller for mobile */
            }

            .dropdown-item {
              padding: 0.4rem 0.6rem;
              font-size: 0.9rem;
              gap: 0.6rem;
            }

            .dropdown-item i {
              font-size: 1rem;
            }
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
                  const slideDuration = imageCount * 10; // 10 seconds per image
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
                              aria-label="Open menu"
                              title="Open menu"
                            ></i>
                            {menuOpen === tip.id && (
                              <div className="dropdown-menu">
                                <div
                                  className="dropdown-item edit"
                                  onClick={() => handleEdit(tip)}
                                  aria-label="Edit tip"
                                  title="Edit tip"
                                >
                                  <i className="bi bi-pencil"></i>
                                  Edit
                                </div>
                                <div
                                  className="dropdown-item delete"
                                  onClick={() => handleDelete(tip.id)}
                                  aria-label="Delete tip"
                                  title="Delete tip"
                                >
                                  <i className="bi bi-trash"></i>
                                  Delete
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="tip-body">
                          <p className="tip-details provided-by">
                            <i className="bi bi-person"></i>
                            <span>Provided By: {tip.author}</span>
                          </p>
                          <p className="tip-details">
                            <i className="bi bi-bar-chart"></i>
                            <span>Difficulty: {tip.difficulty || 'N/A'}</span>
                          </p>
                          <p className="tip-details">
                            <i className="bi bi-calendar"></i>
                            <span>Published Date: {formatDate(tip.createdAt)}</span>
                          </p>
                          <div className="d-flex align-items-center mb-3">
                            <button 
                              className="vote-btn"
                              onClick={() => handleLike(tip.id)}
                            >
                              <i className="bi bi-hand-thumbs-up"></i>
                              <span className="vote-count">{tip.likes || 0} Likes</span>
                            </button>
                            <button 
                              className="comment-btn"
                              onClick={() => setNewComment((prev) => ({ ...prev, [tip.id]: prev[tip.id] || '' }))}
                            >
                              <i className="bi bi-chat-left-text"></i>
                              <span className="comment-count">{(tip.comments || []).length} Comments</span>
                            </button>
                          </div>
                          {newComment[tip.id] !== undefined && (
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
                                  aria-label="New comment"
                                />
                                <button type="submit" className="comment-submit" aria-label="Post new comment">
                                  <i className="bi bi-send"></i>
                                </button>
                              </form>
                              {(tip.comments || []).length > 0 && (
                                <div className="comment-list mt-3">
                                  <h6 className="mb-3 text-muted" style={{ fontSize: '0.8rem' }}>
                                    <i className="bi bi-chat-left-text me-2"></i>Comments
                                  </h6>
                                  {(tip.comments || []).map((comment) => (
                                    <div key={comment.id} className="comment-item">
                                      {editComment[comment.id] ? (
                                        <form 
                                          className="comment-form" 
                                          onSubmit={(e) => handleCommentEdit(tip.id, comment.id, e)}
                                        >
                                          <textarea
                                            className="form-control comment-input mb-2"
                                            value={editComment[comment.id]}
                                            onChange={(e) => setEditComment({
                                              ...editComment,
                                              [comment.id]: e.target.value
                                            })}
                                            aria-label="Edit comment"
                                          />
                                          <div className="d-flex gap-2">
                                            <button 
                                              type="submit" 
                                              className="comment-edit-submit"
                                              aria-label="Save edited comment"
                                              title="Save comment"
                                            >
                                              <i className="bi bi-check"></i>
                                            </button>
                                            <button 
                                              type="button" 
                                              className="comment-cancel"
                                              onClick={() => setEditComment({ ...editComment, [comment.id]: null })}
                                              aria-label="Cancel editing comment"
                                              title="Cancel editing"
                                            >
                                              <i className="bi bi-x"></i>
                                            </button>
                                          </div>
                                        </form>
                                      ) : (
                                        <div className="comment-content">
                                          <div className="comment-actions">
                                            <button 
                                              className="comment-edit"
                                              onClick={() => setEditComment({
                                                ...editComment,
                                                [comment.id]: comment.text
                                              })}
                                              title="Edit comment"
                                              aria-label="Edit comment"
                                            >
                                              <i className="bi bi-pencil"></i>
                                            </button>
                                            <button 
                                              className="comment-delete"
                                              onClick={() => handleCommentDelete(tip.id, comment.id)}
                                              title="Delete comment"
                                              aria-label="Delete comment"
                                            >
                                              <i className="bi bi-trash"></i>
                                            </button>
                                          </div>
                                          <p className="comment-text">{comment.text}</p>
                                        </div>
                                      )}
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