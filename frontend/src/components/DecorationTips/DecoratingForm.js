// DecoratingForm.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function DecoratingForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    media: '',
    author: '',
    tip: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/decoration-tips');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, media: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, media: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData({ ...formData, media: '' });
    fileInputRef.current.value = '';
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
          .upload-area {
            border: 2px dashed #007bff;
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            background-color: ${isDragging ? 'rgba(0, 123, 255, 0.1)' : 'white'};
          }
          .upload-area:hover {
            background-color: rgba(0, 123, 255, 0.05);
          }
          .upload-icon {
            font-size: 2.5rem;
            color: #007bff;
            margin-bottom: 1rem;
          }
          .image-preview {
            max-width: 100%;
            max-height: 200px;
            border-radius: 8px;
            margin-top: 1rem;
            object-fit: contain;
          }
          .remove-btn {
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 50px;
            padding: 5px 15px;
            font-size: 0.8rem;
            margin-top: 1rem;
            transition: all 0.3s;
          }
          .remove-btn:hover {
            background: #c82333;
          }
          .file-info {
            margin-top: 1rem;
            font-size: 0.9rem;
            color: #6c757d;
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
            <div className="mb-3">
              <label className="form-label">
                Upload Image
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="d-none"
              />
              <div
                className="upload-area"
                onClick={triggerFileInput}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Preview" className="image-preview" />
                    <div className="file-info">
                      {formData.media.name} ({(formData.media.size / 1024).toFixed(2)} KB)
                    </div>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                    >
                      <i className="bi bi-trash me-1"></i> Remove Image
                    </button>
                  </>
                ) : (
                  <>
                    <i className="bi bi-cloud-arrow-up upload-icon"></i>
                    <h5>Drag & Drop your image here</h5>
                    <p className="text-muted">or click to browse files</p>
                    <p className="text-muted small">Supports: JPG, PNG, GIF (Max 5MB)</p>
                  </>
                )}
              </div>
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