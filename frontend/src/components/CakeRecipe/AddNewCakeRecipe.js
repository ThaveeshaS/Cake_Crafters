import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

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
    likes: 0,
    comments: [],
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const cakeTypes = [
    'Birthday cake',
    'Anniversary cake',
    'Chocolate cake',
    'Cheesecakes',
    'Butter cake',
    'Red Velvet',
    'Carrot cake',
    'Fruit cake',
    'Cupcakes',
    'Pound cake'
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
            resolve(reader.result);
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
    setIsSubmitting(true);
    
    const submittedData = {
      ...formData,
      servings: parseInt(formData.servings, 10),
      images: images,
    };

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
        navigate('/displaycakerecipe');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to submit recipe. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="create-recipe-page">
      <style>
        {`
          :root {
            --primary-color: #6c5ce7;
            --primary-light: #a29bfe;
            --secondary-color: #00b894;
            --accent-color: #fd79a8;
            --light-color: #f8f9fa;
            --dark-color: #343a40;
            --danger-color: #d63031;
            --text-color: #2d3436;
            --border-color: #dfe6e9;
          }
          
          .create-recipe-page {
            background: linear-gradient(135deg, #f5f7fa 0%, #f8f9ff 100%);
            min-height: 100vh;
            padding: 3rem 0;
          }
          
          .create-recipe-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 2.5rem;
            background: white;
            border-radius: 20px;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
            position: relative;
            overflow: hidden;
          }
          
          .create-recipe-container:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 8px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
          }
          
          .form-header {
            color: var(--dark-color);
            text-align: center;
            margin-bottom: 2.5rem;
            font-weight: 800;
            position: relative;
            padding-bottom: 1rem;
          }
          
          .form-header:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            border-radius: 2px;
          }
          
          .form-section {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            margin-bottom: 2rem;
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
          }
          
          .form-section:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          }
          
          .form-section h3 {
            color: var(--primary-color);
            font-weight: 700;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
          }
          
          .form-section h3 i {
            margin-right: 10px;
            font-size: 1.2rem;
          }
          
          .form-label {
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 0.5rem;
          }
          
          .form-control, .form-select {
            border-radius: 10px;
            padding: 12px 15px;
            border: 1px solid var(--border-color);
            transition: all 0.3s;
          }
          
          .form-control:focus, .form-select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.25rem rgba(108, 92, 231, 0.2);
          }
          
          textarea.form-control {
            min-height: 150px;
          }
          
          .submit-btn {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            border: none;
            padding: 12px 30px;
            font-size: 1.1rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            border-radius: 10px;
            color: white;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          
          .submit-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4);
          }
          
          .submit-btn:disabled {
            opacity: 0.7;
            transform: none !important;
          }
          
          .upload-area {
            border: 2px dashed ${isDragging ? 'var(--primary-color)' : 'var(--border-color)'};
            border-radius: 12px;
            padding: 2.5rem;
            text-align: center;
            margin-bottom: 1.5rem;
            background: ${isDragging ? 'rgba(162, 155, 254, 0.1)' : 'rgba(248, 249, 255, 0.5)'};
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .upload-area:hover {
            border-color: var(--primary-color);
            background: rgba(162, 155, 254, 0.1);
          }
          
          .upload-icon {
            font-size: 3.5rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
            opacity: 0.8;
          }
          
          .upload-text h5 {
            color: var(--primary-color);
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          
          .upload-text p {
            color: #636e72;
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
          }
          
          .browse-btn {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 500;
          }
          
          .browse-btn:hover {
            background: var(--primary-light);
          }
          
          .file-input {
            display: none;
          }
          
          .image-previews {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
          }
          
          .preview-item {
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            aspect-ratio: 1/1;
            transition: all 0.3s;
          }
          
          .preview-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
          }
          
          .preview-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .remove-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background: var(--danger-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
            opacity: 0.9;
          }
          
          .remove-btn:hover {
            opacity: 1;
            transform: scale(1.1);
          }
          
          .upload-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
            font-size: 0.9rem;
          }
          
          .upload-count {
            font-weight: 600;
            color: var(--primary-color);
          }
          
          .max-files {
            color: #b2bec3;
          }
          
          .form-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
          }
          
          .date-display {
            color: #636e72;
            font-size: 0.9rem;
          }
          
          .form-group {
            margin-bottom: 1.5rem;
          }
          
          .form-group:last-child {
            margin-bottom: 0;
          }
          
          .required-field:after {
            content: ' *';
            color: var(--danger-color);
          }
          
          @media (max-width: 768px) {
            .create-recipe-container {
              padding: 1.5rem;
              border-radius: 0;
            }
            
            .form-section {
              padding: 1.5rem;
            }
            
            .image-previews {
              grid-template-columns: repeat(2, 1fr);
            }
            
            .form-footer {
              flex-direction: column;
              gap: 1rem;
            }
            
            .submit-btn {
              width: 100%;
            }
          }
        `}
      </style>

      <div className="create-recipe-container">
        <h1 className="form-header">Create New Cake Recipe</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3><i className="bi bi-person-badge"></i> Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="authorName" className="form-label required-field">
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
                placeholder="Your name or nickname"
              />
            </div>

            <div className="row">
              <div className="col-md-6 form-group">
                <label htmlFor="cakeName" className="form-label required-field">
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
                  placeholder="e.g. Chocolate Fudge Cake"
                />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor="subTitle" className="form-label">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="subTitle"
                  name="subTitle"
                  value={formData.subTitle}
                  onChange={handleChange}
                  placeholder="A short description"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 form-group">
                <label htmlFor="cakeType" className="form-label required-field">
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
              <div className="col-md-6 form-group">
                <label htmlFor="skillLevel" className="form-label required-field">
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

            <div className="row">
              <div className="col-md-4 form-group">
                <label htmlFor="prepTime" className="form-label required-field">
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
              <div className="col-md-4 form-group">
                <label htmlFor="cookTime" className="form-label required-field">
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
              <div className="col-md-4 form-group">
                <label htmlFor="servings" className="form-label required-field">
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
            <h3><i className="bi bi-images"></i> Cake Images</h3>
            <div
              className="upload-area"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('cakeImages').click()}
            >
              <div className="upload-icon">
                <i className="bi bi-cloud-arrow-up-fill"></i>
              </div>
              <div className="upload-text">
                <h5>Drag & Drop your images here</h5>
                <p>Supports JPG, PNG up to 4MB</p>
              </div>
              <button type="button" className="browse-btn">
                <i className="bi bi-folder2-open me-2"></i> Browse Files
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
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-section">
            <h3><i className="bi bi-list-check"></i> Ingredients</h3>
            <div className="form-group">
              <label htmlFor="ingredients" className="form-label required-field">
                List all ingredients with quantities (one per line)
              </label>
              <textarea
                className="form-control"
                id="ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder={`Example:
2 cups all-purpose flour
1 cup granulated sugar
3 large eggs
1 cup whole milk
1/2 cup unsalted butter, melted
1 tsp vanilla extract
2 tsp baking powder
1/4 tsp salt`}
                rows="8"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3><i className="bi bi-list-ol"></i> Instructions</h3>
            <div className="form-group">
              <label htmlFor="instructions" className="form-label required-field">
                Step-by-step instructions
              </label>
              <textarea
                className="form-control"
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder={`Example:
1. Preheat oven to 350°F (175°C). Grease and flour a 9-inch round cake pan.
2. In a large bowl, whisk together flour, sugar, baking powder, and salt.
3. In another bowl, beat eggs, then add milk, melted butter, and vanilla.
4. Gradually mix wet ingredients into dry ingredients until just combined.
5. Pour batter into prepared pan and bake for 30-35 minutes.
6. Let cool in pan for 10 minutes, then transfer to wire rack.`}
                rows="10"
                required
              />
            </div>
          </div>

          <div className="form-footer">
            <div className="date-display">
              <i className="bi bi-calendar me-2"></i>
              {new Date(formData.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <button 
              type="submit" 
              className="btn submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle"></i> Add Cake Recipe
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipeForm;