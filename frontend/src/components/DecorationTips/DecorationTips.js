// DecorationTips.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function DecorationTips() {
  const [tips, setTips] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const navigate = useNavigate();
  const menuRefs = useRef({});

  useEffect(() => {
    const storedTips = JSON.parse(localStorage.getItem('decorationTips') || '[]');
    setTips(storedTips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
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

  return (
    <div className="container py-5">
      <style>
        {`
          .tips-container {
            max-width: 900px;
            margin: 0 auto;
          }
          .create-btn {
            background: #007bff;
            border: none;
            padding: 10px 25px;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 50px;
            transition: all 0.3s;
            color: white;
            text-decoration: none;
            display: inline-block;
          }
          .create-btn:hover {
            background: #0056b3;
            transform: translateY(-2px);
            color: white;
            text-decoration: none;
          }
          .tip-card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            position: relative;
            border: 1px solid #e7f1ff;
            width: 100%;
            max-width: 850px;
          }
          .tip-card-header {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
          }
          .tip-card-author {
            font-weight: 600;
            color: #003087;
            font-size: 1.1rem;
          }
          .tip-card-time {
            color: #6c757d;
            font-size: 0.9rem;
            margin-left: 0.5rem;
          }
          .tip-card-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #003087;
            margin-bottom: 0.5rem;
          }
          .tip-card-description {
            color: #333;
            margin-bottom: 1rem;
          }
          .tip-card-tip {
            background: #e7f1ff;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            color: #333;
          }
          .tip-card-media {
            margin-bottom: 1rem;
          }
          .tip-card-media img,
          .tip-card-media video {
            width: 100%;
            max-height: 400px;
            object-fit: contain;
            border-radius: 8px;
          }
          .tip-card-media-carousel {
            display: flex;
            overflow-x: auto;
            gap: 1rem;
            padding-bottom: 0.5rem;
          }
          .tip-card-media-carousel img {
            flex: 0 0 auto;
            width: 100%;
            max-width: 300px;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
          }
          .tip-card-hashtags {
            position: absolute;
            top: 1rem;
            right: 3rem;
            display: flex;
            gap: 0.5rem;
          }
          .hashtag {
            background: #007bff;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
          }
          .no-tips-card {
            background: #e7f1ff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            text-align: center;
            max-width: 850px;
            margin: 0 auto;
          }
          .no-tips-card h5 {
            color: #003087;
            font-weight: 700;
          }
          .no-tips-card p {
            color: #6c757d;
          }
          .menu-container {
            position: absolute;
            top: 1rem;
            right: 1rem;
            cursor: pointer;
          }
          .menu-icon {
            font-size: 1.2rem;
            color: #6c757d;
          }
          .menu-icon:hover {
            color: #003087;
          }
          .dropdown-menu {
            position: absolute;
            top: 2rem;
            right: 0;
            background: #fff;
            border: 1px solid #e7f1ff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            min-width: 120px;
            display: block;
          }
          .dropdown-item {
            padding: 0.5rem 1rem;
            color: #333;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background 0.2s;
          }
          .dropdown-item:hover {
            background: #e7f1ff;
            color: #003087;
          }
          .dropdown-item.delete {
            color: #dc3545;
          }
          .dropdown-item.delete:hover {
            background: #f8d7da;
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
            <h1 className="display-5 text-center mb-4" style={{ color: '#003087' }}>
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