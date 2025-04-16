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

          .media-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .gallery-media {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
          }

          .gallery-media:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-color: var(--primary-color);
          }

          .gallery-media.active {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.3);
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

          .comment-meta {
            font-size: 0.9rem;
            color: #6c757d;
            margin-bottom: 0.5rem;
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

          {tip.media && tip.media.length > 1 && (
            <div>
              <h3 className="section-title">Media Gallery</h3>
              <div className="media-gallery">
                {tip.media.map((media, index) => (
                  <div key={index}>
                    {tip.mediaType === 'video' ? (
                      <video
                        src={media}
                        className={`gallery-media ${index === activeMedia ? 'active' : ''}`}
                        onClick={() => setActiveMedia(index)}
                        muted
                      />
                    ) : (
                      <img
                        src={media}
                        alt={`Media ${index + 1}`}
                        className={`gallery-media ${index === activeMedia ? 'active' : ''}`}
                        onClick={() => setActiveMedia(index)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {tip.comments && tip.comments.length > 0 ? (
            <div className="comments-section">
              <h3 className="section-title">Comments</h3>
              <ul className="comment-list">
                {tip.comments.map((comment, index) => (
                  <li key={comment.id || index} className="comment-item">
                    <div className="comment-meta">
                      <strong>{comment.author}</strong> on{' '}
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <p>{comment.text}</p>
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

export default DisplayDecorationTip;