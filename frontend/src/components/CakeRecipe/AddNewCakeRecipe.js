import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateRecipeForm = () => {
  const [formData, setFormData] = useState({
    authorName: '',
    cakeName: '',
    subTitle: '',
    cakeType: '',
    skillLevel: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    ingredients: '',
    instructions: '',
    date: new Date().toISOString().split('T')[0],
    likes: 0, // Initialize likes
    comments: [], // Initialize comments
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const cakeTypes = [
    'Birthday cake',
    'Anniversary cake',
    'Chocolate cake',
    'Cheesecakes',
    'Butter cake',
  ];

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    handleDragEvents(e);
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    handleDragEvents(e);
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    handleDragEvents(e);
  };

  const handleDrop = (e) => {
    handleDragEvents(e);
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));
      const selectedFiles = imageFiles.slice(0, 4 - images.length);

      const previews = [];
      const base64Promises = selectedFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            previews.push(URL.createObjectURL(file));
            resolve(reader.result); // Base64 string
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(base64Promises).then((base64Images) => {
        setImages([...images, ...base64Images]);
        setImagePreviews([...imagePreviews, ...previews]);
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedData = {
      ...formData,
      servings: parseInt(formData.servings, 10),
      images: images, // Base64 strings
    };

    // Send to backend
    fetch('http://localhost:8080/api/cake-recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submittedData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        // Reset form
        setFormData({
          authorName: '',
          cakeName: '',
          subTitle: '',
          cakeType: '',
          skillLevel: '',
          prepTime: '',
          cookTime: '',
          servings: '',
          ingredients: '',
          instructions: '',
          date: new Date().toISOString().split('T')[0],
          likes: 0,
          comments: [],
        });
        setImages([]);
        setImagePreviews([]);
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="create-recipe-container">
      <style>
        {`
          .create-recipe-container {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
            background: #f5f9ff;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          }
          .form-header {
            color: #2a5bd7;
            text-align: center;
            margin-bottom: 2rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .form-section {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          }
          .form-section h3 {
            color: #2a5bd7;
            border-bottom: 2px solid #d6e4ff;
            padding-bottom: 0.5rem;
            margin-bottom: 1.5rem;
          }
          .submit-btn {
            background: #2a5bd7;
            border: none;
            padding: 10px 25px;
            font-size: 1.1rem;
            font-weight: 600;
            letter-spacing: 1px;
            transition: all 0.3s;
          }
          .submit-btn:hover {
            background: #1e4ac4;
            transform: translateY(-2px);
          }
          .form-control:focus,
          .form-select:focus {
            border-color: #2a5bd7;
            box-shadow: 0 0 0 0.25rem rgba(42, 91, 215, 0.25);
          }
          textarea.form-control {
            min-height: 120px;
          }
          .upload-area {
            border: 2px dashed ${isDragging ? '#2a5bd7' : '#d3d3d3'};
            border-radius: 10px;
            padding: 30px;
            text-align: center;
            margin-bottom: 20px;
            background: ${isDragging ? '#f0f5ff' : '#f8faff'};
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .upload-area:hover {
            border-color: #2a5bd7;
            background: #f0f5ff;
          }
          .upload-icon {
            font-size: 48px;
            color: #2a5bd7;
            margin-bottom: 15px;
          }
          .upload-text {
            margin-bottom: 15px;
          }
          .upload-text h5 {
            color: #2a5bd7;
            font-weight: 600;
          }
          .upload-text p {
            color: #666;
            font-size: 14px;
          }
          .browse-btn {
            background: #2a5bd7;
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-block;
          }
          .browse-btn:hover {
            background: #1e4ac4;
          }
          .file-input {
            display: none;
          }
          .image-previews {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
          }
          .preview-item {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            aspect-ratio: 1/1;
          }
          .preview-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .remove-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(255, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 12px;
          }
          .upload-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            font-size: 14px;
            color: #666;
          }
          .upload-count {
            font-weight: 600;
            color: #2a5bd7;
          }
          .max-files {
            color: #999;
          }
          @media (max-width: 576px) {
            .image-previews {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}
      </style>

      <h1 className="form-header">Create New Cake Recipe</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="row mb-3">
            <div className="col-md-12">
              <label htmlFor="authorName" className="form-label">
                Author Name
              </label>
              <input
                type="text"
                className="form-control"
                id="authorName"
                name="authorName"
                value={formData.authorName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="cakeName" className="form-label">
                Cake Name
              </label>
              <input
                type="text"
                className="form-control"
                id="cakeName"
                name="cakeName"
                value={formData.cakeName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="subTitle" className="form-label">
                Sub Title
              </label>
              <input
                type="text"
                className="form-control"
                id="subTitle"
                name="subTitle"
                value={formData.subTitle}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="cakeType" className="form-label">
                Cake Type
              </label>
              <select
                className="form-select"
                id="cakeType"
                name="cakeType"
                value={formData.cakeType}
                onChange={handleChange}
                required
              >
                <option value="">Select cake type</option>
                {cakeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="skillLevel" className="form-label">
                Skill Level
              </label>
              <select
                className="form-select"
                id="skillLevel"
                name="skillLevel"
                value={formData.skillLevel}
                onChange={handleChange}
                required
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4 mb-3">
              <label htmlFor="prepTime" className="form-label">
                Prep Time
              </label>
              <input
                type="text"
                className="form-control"
                id="prepTime"
                name="prepTime"
                placeholder="e.g. 30 mins"
                value={formData.prepTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="cookTime" className="form-label">
                Cook Time
              </label>
              <input
                type="text"
                className="form-control"
                id="cookTime"
                name="cookTime"
                placeholder="e.g. 1 hour"
                value={formData.cookTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="servings" className="form-label">
                Servings
              </label>
              <input
                type="number"
                className="form-control"
                id="servings"
                name="servings"
                min="1"
                value={formData.servings}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Cake Images</h3>
          <div
            className="upload-area"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('cakeImages').click()}
          >
            <div className="upload-icon">
              <i className="bi bi-cloud-arrow-up"></i>
            </div>
            <div className="upload-text">
              <h5>Drag & Drop your images here</h5>
              <p>or click to browse files</p>
            </div>
            <button type="button" className="browse-btn">
              Select Images
            </button>
            <input
              type="file"
              id="cakeImages"
              className="file-input"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={images.length >= 4}
            />
          </div>

          <div className="upload-status">
            <div className="upload-count">
              {images.length} {images.length === 1 ? 'image' : 'images'} selected
            </div>
            <div className="max-files">Max 4 images allowed</div>
          </div>

          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="preview-item">
                  <img src={preview} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Ingredients</h3>
          <div className="mb-3">
            <label htmlFor="ingredients" className="form-label">
              List all ingredients with quantities (separate with new lines)
            </label>
            <textarea
              className="form-control"
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="Example:
                2 cups all-purpose flour
                1 cup sugar
                3 eggs
                1 cup milk
                ..."
              rows="6"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Instructions</h3>
          <div className="mb-3">
            <label htmlFor="instructions" className="form-label">
              Step-by-step instructions
            </label>
            <textarea
              className="form-control"
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Example:
                1. Preheat oven to 350°F (175°C)
                2. Mix dry ingredients in a large bowl
                3. Add wet ingredients and mix well
                ..."
              rows="8"
              required
            />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-muted">
            <small>Date: {formData.date}</small>
          </div>
          <button type="submit" className="btn submit-btn text-white">
            Add Cake Recipe
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipeForm;