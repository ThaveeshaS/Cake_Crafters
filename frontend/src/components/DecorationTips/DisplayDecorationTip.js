import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const DisplayDecorationTip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMedia, setActiveMedia] = useState(0);
  const [editComment, setEditComment] = useState({});
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8080/api/decoration-tips/${id}`)
      .then((response) => {
        setTip(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data || 'Tip not found');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this decorating tip?')) {
      try {
        await axios.delete(`http://localhost:8080/api/decoration-tips/${id}`);
        navigate('/decorationtips');
      } catch (err) {
        setError(err.response?.data || 'Failed to delete tip');
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      text: newComment,
      author: 'User',
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post(`http://localhost:8080/api/decoration-tips/${id}/comment`, comment);
      setTip(response.data);
      setNewComment('');
    } catch (err) {
      setError(err.response?.data || 'Failed to add comment');
    }
  };

  const handleCommentEdit = async (commentId, e) => {
    e.preventDefault();
    if (!editComment[commentId]?.trim()) return;

    const updatedComment = {
      text: editComment[commentId],
      author: tip.comments.find(c => c.id === commentId)?.author || 'User',
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.put(`http://localhost:8080/api/decoration-tips/${id}/comment/${commentId}`, updatedComment);
      setTip(response.data);
      setEditComment({ ...editComment, [commentId]: null });
    } catch (err) {
      setError(err.response?.data || 'Failed to edit comment');
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/decoration-tips/${id}/comment/${commentId}`);
      setTip(response.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to delete comment');
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
          <Link to="/decorationtips" className="btn btn-primary btn-lg">
            <i className="bi bi-arrow-left me-2"></i> Back to Tips
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
            --neutral-color: #6c757d;
          }

          .tip-details-container {
            max-width: 1000px;
            margin: 0 auto;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            overflow: hidden;
          }

          .tip-header {
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          }

          .tip-title {
            color: var(--dark-color);
            font-weight: 800;
            margin-bottom: 0.5rem;
            font-size: 2.2rem;
          }

          .tip-subtitle {
            color: #6c757d;
            font-size: 1.1rem;
            font-weight: 400;
            margin-bottom: 1.5rem;
          }

          .tip-content {
            padding: 2rem;
          }

          .main-media-container {
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 2rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }

          .main-media-image,
          .main-media-video {
            width: 100%;
            height: 400px;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .main-media-image:hover,
          .main-media-video:hover {
            transform: scale(1.02);
          }

          .media-counter {
            position: absolute;
            bottom: 15px;
            right: 15px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
          }

          .nav-dots {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
            margin-bottom: 2rem;
          }

          .nav-dot {
            width: 10px;
            height: 10px;
            background: #d1c4e9;
            border-radius: 50%;
            cursor: pointer;
            transition: background 0.3s;
          }

          .nav-dot.active {
            background: var(--secondary-color);
          }

          .nav-dot:hover {
            background: #b39ddb;
          }

          .tip-meta {
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

          .tip-details {
            background: #f9f9ff;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            line-height: 1.6;
          }

          .action-buttons {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .right-buttons {
            display: flex;
            gap: 1rem;
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
            max-height: 300px;
            overflow-y: auto;
            margin-top: 1rem;
          }

          .comment-item {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            position: relative;
            padding-right: 50px; /* Reduced space for vertical buttons */
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

          .comment-meta {
            font-size: 0.9rem;
            color: #6c757d;
            margin-bottom: 0.5rem;
          }

          .comment-content {
            position: relative;
          }

          .comment-actions {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            flex-direction: column; /* Stack buttons vertically */
            gap: 0.5rem;
            align-items: flex-end;
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

          .comment-form {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
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
          .comment-list::-webkit-scrollbar {
            width: 6px;
          }

          .comment-list::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }

          .comment-list::-webkit-scrollbar-thumb {
            background: var(--secondary-color);
            border-radius: 3px;
          }

          .comment-list::-webkit-scrollbar-thumb:hover {
            background: #888;
          }

          @media (max-width: 768px) {
            .tip-title {
              font-size: 1.8rem;
            }

            .main-media-image,
            .main-media-video {
              height: 300px;
            }

            .action-buttons {
              flex-direction: column;
              align-items: stretch;
            }

            .right-buttons {
              flex-direction: column;
              width: 100%;
            }

            .back-btn,
            .update-btn,
            .delete-btn {
              width: 100%;
              justify-content: center;
            }

            .comment-item {
              padding-right: 40px; /* Further reduced for vertical buttons on mobile */
            }
          }
        `}
      </style>

      <div className="tip-details-container">
        <div className="tip-header">
          <h1 className="tip-title">{tip.title}</h1>
          {tip.description && (
            <p className="tip-subtitle">{tip.description}</p>
          )}
        </div>

        <div className="tip-content">
          {tip.media && tip.media.length > 0 && (
            <div className="main-media-container">
              {tip.mediaType === 'video' ? (
                <video
                  src={tip.media[activeMedia]}
                  className="main-media-video"
                  controls
                />
              ) : (
                <img
                  src={tip.media[activeMedia]}
                  alt={tip.title}
                  className="main-media-image"
                />
              )}
              {tip.media.length > 1 && (
                <span className="media-counter">
                  {activeMedia + 1}/{tip.media.length}
                </span>
              )}
            </div>
          )}
          {tip.media && tip.media.length > 1 && (
            <div className="nav-dots">
              {tip.media.map((_, index) => (
                <span
                  key={index}
                  className={`nav-dot ${index === activeMedia ? 'active' : ''}`}
                  onClick={() => setActiveMedia(index)}
                ></span>
              ))}
            </div>
          )}
          <div className="tip-meta">
            <span className="meta-item">
              <i className="bi bi-person meta-icon"></i>
              <strong>Author:</strong> {tip.author || 'Anonymous'}
            </span>
            <span className="meta-item">
              <i className="bi bi-tag meta-icon"></i>
              <strong>Category:</strong> {tip.category}
            </span>
            <span className="meta-item">
              <i className="bi bi-speedometer2 meta-icon"></i>
              <strong>Difficulty:</strong> {tip.difficulty}
            </span>
            <span className="meta-item">
              <i className="bi bi-calendar meta-icon"></i>
              <strong>Created:</strong> {new Date(tip.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div>
            <h3 className="section-title">Decoration Tip</h3>
            <div className="tip-details">
              {tip.tip.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
          <hr className="my-3" />
          <div className="action-buttons">
            <Link to="/decorationtips" className="btn back-btn">
              <i className="bi bi-arrow-left me-2"></i> Back to Tips
            </Link>
            <div className="right-buttons">
              <Link to="/create-decoration-tips" state={{ tip }} className="btn update-btn">
                <i className="bi bi-pencil-square me-2"></i> Update Tip
              </Link>
              <button onClick={handleDelete} className="btn delete-btn">
                <i className="bi bi-trash me-2"></i> Delete Tip
              </button>
            </div>
          </div>
          <div className="comments-section">
            <h3 className="section-title">Comments</h3>
            <form 
              className="comment-form" 
              onSubmit={handleCommentSubmit}
            >
              <textarea
                className="form-control comment-input mb-2"
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                aria-label="New comment"
              />
              <button type="submit" className="comment-submit" aria-label="Post new comment" title="Post comment">
                <i className="bi bi-send"></i>
              </button>
            </form>
            {tip.comments && tip.comments.length > 0 ? (
              <ul className="comment-list">
                {tip.comments.map((comment, index) => (
                  <li key={comment.id || index} className="comment-item">
                    {editComment[comment.id] ? (
                      <form 
                        className="comment-form" 
                        onSubmit={(e) => handleCommentEdit(comment.id, e)}
                      >
                        <textarea
                          className="form-control comment-input mb-2"
                          value={editComment[comment.id]}
                          onChange={(e) => setEditComment({
                            ...editComment,
                            [comment.id]: e.target.value
                          })}
                          aria-label="Edit comment text"
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
                            onClick={() => handleCommentDelete(comment.id)}
                            title="Delete comment"
                            aria-label="Delete comment"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        <div className="comment-meta">
                          <strong>{comment.author}</strong> on{' '}
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <p>{comment.text}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
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
    </div>
  );
};

export default DisplayDecorationTip;