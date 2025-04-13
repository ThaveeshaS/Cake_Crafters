// DecoratingForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function DecoratingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    media: '',
    author: '',
    tip: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/decoration-tips');
  };

  return (
    <div className="container py-5">
      <style>
        {`
          .form-container {
            max-width: 600px;
            margin: 0 auto;
          }
          .submit-btn {
            background: #007bff;
            border: none;
            padding: 10px 25px;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 50px;
            transition: all 0.3s;
            color: white;
          }
          .submit-btn:hover {
            background: #0056b3;
            transform: translateY(-2px);
          }
          .form-card {
            background: #e7f1ff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 2rem;
          }
          .form-label {
            color: #003087;
            font-weight: 600;
          }
        `}
      </style>
      <div className="form-container">
        <div className="form-card">
          <h1 className="display-5 text-center mb-4" style={{ color: '#003087' }}>
            Create a Decoration Tip
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                className="form-control"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="difficulty" className="form-label">
                Difficulty
              </label>
              <select
                className="form-control"
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="media" className="form-label">
                Media URL (Image/Video)
              </label>
              <input
                type="url"
                className="form-control"
                id="media"
                name="media"
                value={formData.media}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="author" className="form-label">
                Author
              </label>
              <input
                type="text"
                className="form-control"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="tip" className="form-label">
                Tip Details
              </label>
              <textarea
                className="form-control"
                id="tip"
                name="tip"
                value={formData.tip}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn submit-btn">
                <i className="bi bi-check-circle me-2"></i>
                Submit Tip
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DecoratingForm;