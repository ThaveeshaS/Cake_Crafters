import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const UpdateRecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/cake-recipes/${id}`);
        if (!response.ok) {
          throw new Error('Recipe not found');
        }
        const data = await response.json();
        setFormData({
          authorName: data.authorName || '',
          cakeName: data.cakeName || '',
          subTitle: data.subTitle || '',
          cakeType: data.cakeType || '',
          skillLevel: data.skillLevel || '',
          prepTime: data.prepTime || '',
          cookTime: data.cookTime || '',
          servings: data.servings ? data.servings.toString() : '1',
          ingredients: data.ingredients || '',
          instructions: data.instructions || '',
          date: data.date || new Date().toISOString().split('T')[0],
          likes: data.likes || 0,
          comments: data.comments || [],
          images: data.images || [],
        });
        setImagePreviews(data.images || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecipe();

    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      if (newPreviews[index]?.startsWith('blob:')) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });
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
      const imageFiles = files.filter(
        (file) => file.type.startsWith('image/') && file.size < 5 * 1024 * 1024
      );
      const selectedFiles = imageFiles.slice(0, 4 - formData.images.length);

      if (selectedFiles.length < files.length) {
        alert('Max 4 images allowed, each under 5MB.');
      }

      const base64Promises = selectedFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(base64Promises).then((base64Images) => {
        const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...base64Images],
        }));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
      });
    }
  };

  const validateForm = () => {
    if (!formData.authorName.trim()) return 'Author Name is required.';
    if (!formData.cakeName.trim()) return 'Cake Name is required.';
    if (!cakeTypes.includes(formData.cakeType)) return 'Please select a valid Cake Type.';
    if (!skillLevels.includes(formData.skillLevel)) return 'Please select a valid Skill Level.';
    if (!formData.prepTime.trim()) return 'Prep Time is required.';
    if (!formData.cookTime.trim()) return 'Cook Time is required.';
    const servings = parseInt(formData.servings, 10);
    if (isNaN(servings) || servings <= 0) return 'Servings must be a positive number.';
    if (!formData.ingredients.trim()) return 'Ingredients are required.';
    if (!formData.instructions.trim()) return 'Instructions are required.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSubmitting(false);
      return;
    }

    const submittedData = {
      ...formData,
      servings: parseInt(formData.servings, 10),
    };

    try {
      const response = await fetch(`http://localhost:8080/api/cake-recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submittedData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to update recipe');
      }

      await response.json();
      navigate(`/recipe/${id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
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

  if (error && !formData.cakeName) {
    return (
      <div className="container py-5">
        <div className="error-state text-center py-5">
          <div className="error-icon mb-4">
            <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '4rem' }}></i>
          </div>
          <h2 className="mb-4">Oops! Something went wrong</h2>
          <p className="text-muted mb-4">{error}</p>
          <Link to="/displaycakerecipe" className="btn btn-primary btn-lg">
            <i className="bi bi-arrow-left me-2"></i> Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="update-recipe-page">
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
          
          .update-recipe-page {
            background: linear-gradient(135deg, #f5f7fa 0%, #f8f9ff 100%);
            min-height: 100vh;
            padding: 3rem 0;
          }
          
          .update-recipe-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 2.5rem;
            background: white;
            border-radius: 20px;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
            position: relative;
            overflow: hidden;
          }
          
          .update-recipe-container:before {
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
          
          .required-field:after {
            content: ' *';
            color: var(--danger-color);
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
          
          .error-message {
            color: var(--danger-color);
            background: rgba(214, 48, 49, 0.1);
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            text-align: center;
            border-left: 4px solid var(--danger-color);
          }
          
          @media (max-width: 768px) {
            .update-recipe-container {
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

      <div className="update-recipe-container">
        <h1 className="form-header">Update Cake Recipe</h1>

        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            {error}
          </div>
        )}

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
                  {skillLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
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
                <p>Supports JPG, PNG up to 5MB</p>
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
                disabled={formData.images.length >= 4}
              />
            </div>

            <div className="upload-status">
              <div className="upload-count">
                {formData.images.length} {formData.images.length === 1 ? 'image' : 'images'} selected
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
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-save"></i> Update Recipe
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRecipeForm;