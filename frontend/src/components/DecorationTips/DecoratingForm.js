// DecoratingForm.js
import React, { useState } from 'react';

function DecoratingForm() {
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with your form submission logic (e.g., API call)
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      title: '',
      description: '',
      category: '',
      difficulty: '',
      media: '',
      author: '',
      tip: '',
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Share Your Decoration Tip</h2>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
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
          <label htmlFor="description" className="form-label">Description</label>
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
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Home Decor">Home Decor</option>
            <option value="Event Decor">Event Decor</option>
            <option value="Seasonal Decor">Seasonal Decor</option>
            <option value="DIY Crafts">DIY Crafts</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="difficulty" className="form-label">Difficulty</label>
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
        <div className="mb-3">
          <label htmlFor="media" className="form-label">Media URL (Image/Video)</label>
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
          <label htmlFor="author" className="form-label">Author</label>
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
          <label htmlFor="tip" className="form-label">Decoration Tip</label>
          <textarea
            className="form-control"
            id="tip"
            name="tip"
            value={formData.tip}
            onChange={handleChange}
            rows="3"
            required
          ></textarea>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary px-4">
            Submit Tip
          </button>
        </div>
      </form>
    </div>
  );
}

export default DecoratingForm;