// DecoratingForm.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function DecoratingForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    media: '',
    author: '',
    tip: '',
  });

  const categories = ['Piping', 'Fondant', 'Icing', 'Sprinkles', 'Modeling'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      media: e.target.files[0]?.name || '',
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      title: '',
      description: '',
      category: '',
      difficulty: '',
      media: '',
      author: '',
      tip: '',
    });
    if (onSubmit) onSubmit();
  };

  return (
    <div className="fb-post-form">
      <style>
        {`
          .fb-post-form {
            max-width: 100%;
          }
          .form-section {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          }
          .form-section h5 {
            color: #4a4e69;
            border-bottom: 2px solid #e4e6f0;
            padding-bottom: 0.5rem;
            margin-bottom: 1.5rem;
          }
          .form-control, .form-select {
            border-radius: 10px;
          }
          .form-control:focus, .form-select:focus {
            border-color: #4a4e69;
            box-shadow: 0 0 0 0.25rem rgba(74, 78, 105, 0.25);
          }
          .avatar {
            width: 40px;
            height: 40px;
            background: #e4e6f0;
            color: #4a4e69;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
          }
          .submit-btn {
            background: #4a4e69;
            border: none;
            padding: 8px 20px;
            font-weight: 600;
            border-radius: 20px;
            transition: all 0.3s;
          }
          .submit-btn:hover {
            background: #3a3d56;
            transform: translateY(-2px);
          }
          .cancel-btn {
            border-radius: 20px;
          }
          textarea.form-control {
            min-height: 100px;
          }
        `}
      </style>
      <h4 className="mb-4" style={{ color: '#4a4e69', fontWeight: '700' }}>
        Create Decoration Tips
      </h4>
      <form onSubmit={handleFormSubmit}>
        <div className="form-section">
          <div className="d-flex align-items-center mb-3">
            <div className="rounded-circle avatar me-3">
              <i className="bi bi-person-fill"></i>
            </div>
            <input
              type="text"
              className="form-control"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Tip title..."
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-select"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <option value="">Select difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
        <div className="form-section">
          <h5>Tip Details</h5>
          <div className="mb-3">
            <textarea
              className="form-control"
              id="tip"
              name="tip"
              value={formData.tip}
              onChange={handleChange}
              placeholder="Share your decoration tip..."
              rows="3"
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a detailed description..."
              rows="4"
            ></textarea>
          </div>
        </div>
        <div className="form-section">
          <h5>Media (Optional)</h5>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              id="media"
              name="media"
              onChange={handleFileChange}
              accept="image/*,video/*"
            />
            <small className="form-text text-muted">
              Upload a photo or video to enhance your tip.
            </small>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-secondary cancel-btn me-2"
            onClick={onSubmit}
          >
            Cancel
          </button>
          <button type="submit" className="btn submit-btn">
            Share Tip
          </button>
        </div>
      </form>
    </div>
  );
}

export default DecoratingForm;