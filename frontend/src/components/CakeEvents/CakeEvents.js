import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function CakeEvents() {
  const [formData, setFormData] = useState({
    eventType: '',
    description: '',
    cakeType: '',
  });
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, photo });
  };

  const handleAddNewCake = () => {
    console.log('Add New Cake button clicked');
    navigate('/addnewcake');
  };


  return (
    <div className="cake-events-container">
      <style>
        {`
          :root {
            --primary-color: #6c5ce7;
            --primary-light: #a29bfe;
            --text-color: #2d3436;
            --light-color: #f8f9fa;
          }

          .cake-events-container {
            max-width: 600px;
            margin: 2rem auto;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .header-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .form-title {
            color: var(--text-color);
            font-size: 1.8rem;
            font-weight: 600;
            margin: 0;
          }

          .add-new-cake-btn {
            background: var(--primary-color);
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: background 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .add-new-cake-btn:hover {
            background: var(--primary-light);
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-label {
            display: block;
            color: var(--text-color);
            margin-bottom: 0.5rem;
            font-weight: 500;
          }

          .form-input,
          .form-textarea,
          .form-select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
          }

          .form-input:focus,
          .form-textarea:focus,
          .form-select:focus {
            outline: none;
            border-color: var(--primary-color);
          }

          .form-textarea {
            min-height: 120px;
            resize: vertical;
          }

          .photo-upload {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .photo-input {
            display: none;
          }

          .photo-button {
            background: var(--primary-color);
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s ease;
          }

          .photo-button:hover {
            background: var(--primary-light);
          }

          .photo-preview {
            color: var(--text-color);
            font-size: 0.9rem;
          }

          .submit-button {
            background: var(--primary-color);
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            width: 100%;
            transition: background 0.3s ease;
          }

          .submit-button:hover {
            background: var(--primary-light);
          }

          @media (max-width: 768px) {
            .cake-events-container {
              margin: 1rem;
              padding: 1.5rem;
            }

            .form-title {
              font-size: 1.5rem;
            }

            .header-section {
              flex-direction: column;
              align-items: flex-start;
              gap: 1rem;
            }

            .add-new-cake-btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}
      </style>

      <div className="header-section">
        <h2 className="form-title">Cakes for Events</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="eventType" className="form-label">
            Event Type
          </label>
          <select
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Select Event Type</option>
            <option value="Birthday">Birthday</option>
            <option value="Wedding">Wedding</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Corporate">Corporate</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Describe your event..."
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="photo" className="form-label">
            Add Photo
          </label>
          <div className="photo-upload">
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="photo-input"
            />
            <label htmlFor="photo" className="photo-button">
              <i className="bi bi-camera"></i> Choose Photo
            </label>
            <span className="photo-preview">
              {photo ? photo.name : 'No photo selected'}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="cakeType" className="form-label">
            Cake Type
          </label>
          <select
            id="cakeType"
            name="cakeType"
            value={formData.cakeType}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Select Cake Type</option>
            <option value="Chocolate">Chocolate</option>
            <option value="Vanilla">Vanilla</option>
            <option value="Red Velvet">Red Velvet</option>
            <option value="Fruit">Fruit</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CakeEvents;