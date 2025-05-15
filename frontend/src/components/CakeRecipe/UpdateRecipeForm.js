import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Form, Button } from 'react-bootstrap';

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
  const [errors, setErrors] = useState({});

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
        setErrors({ fetch: err.message });
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

  const validateForm = () => {
    const newErrors = {};

    // Author Name validation
    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Author name is required';
    } else if (formData.authorName.length < 2) {
      newErrors.authorName = 'Author name must be at least 2 characters';
    } else if (formData.authorName.length > 50) {
      newErrors.authorName = 'Author name must be less than 50 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.authorName.trim())) {
      newErrors.authorName = 'Author name must contain only letters and spaces';
    }

    // Cake Name validation
    if (!formData.cakeName.trim()) {
      newErrors.cakeName = 'Cake name is required';
    } else if (formData.cakeName.length < 3) {
      newErrors.cakeName = 'Cake name must be at least 3 characters';
    } else if (formData.cakeName.length > 100) {
      newErrors.cakeName = 'Cake name must be less than 100 characters';
    }

    // Subtitle validation
    if (formData.subTitle && formData.subTitle.length > 200) {
      newErrors.subTitle = 'Subtitle must be less than 200 characters';
    }

    // Cake Type validation
    if (!formData.cakeType) {
      newErrors.cakeType = 'Please select a cake type';
    }

    // Skill Level validation
    if (!formData.skillLevel) {
      newErrors.skillLevel = 'Please select a skill level';
    }

    // Prep Time validation
    if (!formData.prepTime.trim()) {
      newErrors.prepTime = 'Prep time is required';
    } else if (!/^\d+\s*(min|hour|hr|hrs|minutes|hours)$/.test(formData.prepTime.trim())) {
      newErrors.prepTime = 'Please enter valid prep time (e.g., "30 min" or "1 hour")';
    }

    // Cook Time validation
    if (!formData.cookTime.trim()) {
      newErrors.cookTime = 'Cook time is required';
    } else if (!/^\d+\s*(min|hour|hr|hrs|minutes|hours)$/.test(formData.cookTime.trim())) {
      newErrors.cookTime = 'Please enter valid cook time (e.g., "30 min" or "1 hour")';
    }

    // Servings validation
    if (!formData.servings) {
      newErrors.servings = 'Servings is required';
    } else if (isNaN(formData.servings) || formData.servings < 1 || formData.servings > 100) {
      newErrors.servings = 'Servings must be a number between 1 and 100';
    }

    // Ingredients validation
    if (!formData.ingredients.trim()) {
      newErrors.ingredients = 'Ingredients are required';
    } else if (formData.ingredients.split('\n').length < 2) {
      newErrors.ingredients = 'Please provide at least 2 ingredients';
    } else if (formData.ingredients.length > 1000) {
      newErrors.ingredients = 'Ingredients list is too long';
    }

    // Instructions validation
    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    } else if (formData.instructions.split('\n').length < 2) {
      newErrors.instructions = 'Please provide at least 2 instruction steps';
    } else if (formData.instructions.length > 2000) {
      newErrors.instructions = 'Instructions are too long';
    }

    // Image validation
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'authorName') {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.target.name === 'authorName') {
      const allowedKeys = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'
      ];
      if (!(/[a-zA-Z\s]/.test(e.key) || allowedKeys.includes(e.key))) {
        e.preventDefault();
      }
    }
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
    setErrors((prev) => ({ ...prev, images: '' }));
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
      const imageFiles = files.filter((file) => {
        if (!file.type.startsWith('image/')) {
          setErrors((prev) => ({ ...prev, images: 'Only image files are allowed' }));
          return false;
        }
        if (file.size > 4 * 1024 * 1024) {
          setErrors((prev) => ({ ...prev, images: 'Image size must be less than 4MB' }));
          return false;
        }
        return true;
      });

      const selectedFiles = imageFiles.slice(0, 4 - formData.images.length);

      if (selectedFiles.length < files.length) {
        setErrors((prev) => ({ ...prev, images: 'Max 4 images allowed, each under 4MB' }));
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
        setErrors((prev) => ({ ...prev, images: '' }));
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!validateForm()) {
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
      setErrors((prev) => ({ ...prev, submit: error.message }));
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

  if (errors.fetch && !formData.cakeName) {
    return (
      <div className="container py-5">
        <div className="error-state text-center py-5">
          <div className="error-icon mb-4">
            <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '4rem' }}></i>
          </div>
          <h2 className="mb-4">Oops! Something went wrong</h2>
          <p className="text-muted mb-4">{errors.fetch}</p>
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
          
          .is-invalid {
            border-color: var(--danger-color) !important;
          }
          
          .invalid-feedback {
            font-size: 0.9rem;
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
          
          .upload-area.is-invalid {
            border-color: var(--danger-color);
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

        {errors.submit && (
          <div className="error-message">
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            {errors.submit}
          </div>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          <div className="form-section">
            <h3><i className="bi bi-person-badge"></i> Basic Information</h3>
            
            <Form.Group className="form-group" controlId="authorName">
              <Form.Label className="form-label required-field">
                Author Name
              </Form.Label>
              <Form.Control
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                isInvalid={!!errors.authorName}
                placeholder="Your name or nickname"
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.authorName}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="form-group" controlId="cakeName">
                  <Form.Label className="form-label required-field">
                    Cake Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="cakeName"
                    value={formData.cakeName}
                    onChange={handleChange}
                    isInvalid={!!errors.cakeName}
                    placeholder="e.g. Chocolate Fudge Cake"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cakeName}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="form-group" controlId="subTitle">
                  <Form.Label className="form-label">
                    Subtitle (Optional)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="subTitle"
                    value={formData.subTitle}
                    onChange={handleChange}
                    isInvalid={!!errors.subTitle}
                    placeholder="A short description"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.subTitle}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="form-group" controlId="cakeType">
                  <Form.Label className="form-label required-field">
                    Cake Type
                  </Form.Label>
                  <Form.Select
                    name="cakeType"
                    value={formData.cakeType}
                    onChange={handleChange}
                    isInvalid={!!errors.cakeType}
                    required
                  >
                    <option value="">Select cake type</option>
                    {cakeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.cakeType}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="form-group" controlId="skillLevel">
                  <Form.Label className="form-label required-field">
                    Skill Level
                  </Form.Label>
                  <Form.Select
                    name="skillLevel"
                    value={formData.skillLevel}
                    onChange={handleChange}
                    isInvalid={!!errors.skillLevel}
                    required
                  >
                    <option value="">Select level</option>
                    {skillLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.skillLevel}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <Form.Group className="form-group" controlId="prepTime">
                  <Form.Label className="form-label required-field">
                    Prep Time
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="prepTime"
                    placeholder="e.g. 30 mins"
                    value={formData.prepTime}
                    onChange={handleChange}
                    isInvalid={!!errors.prepTime}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.prepTime}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="form-group" controlId="cookTime">
                  <Form.Label className="form-label required-field">
                    Cook Time
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="cookTime"
                    placeholder="e.g. 1 hour"
                    value={formData.cookTime}
                    onChange={handleChange}
                    isInvalid={!!errors.cookTime}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cookTime}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="form-group" controlId="servings">
                  <Form.Label className="form-label required-field">
                    Servings
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="servings"
                    min="1"
                    value={formData.servings}
                    onChange={handleChange}
                    isInvalid={!!errors.servings}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.servings}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3><i className="bi bi-images"></i> Cake Images</h3>
            <div
              className={`upload-area ${errors.images ? 'is-invalid' : ''}`}
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
                disabled={formData.images.length >= 4}
              />
            </div>
            {errors.images && (
              <div className="invalid-feedback d-block">
                {errors.images}
              </div>
            )}

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
            <Form.Group className="form-group" controlId="ingredients">
              <Form.Label className="form-label required-field">
                List all ingredients with quantities (one per line)
              </Form.Label>
              <Form.Control
                as="textarea"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                isInvalid={!!errors.ingredients}
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
              <Form.Control.Feedback type="invalid">
                {errors.ingredients}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="form-section">
            <h3><i className="bi bi-list-ol"></i> Instructions</h3>
            <Form.Group className="form-group" controlId="instructions">
              <Form.Label className="form-label required-field">
                Step-by-step instructions
              </Form.Label>
              <Form.Control
                as="textarea"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                isInvalid={!!errors.instructions}
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
              <Form.Control.Feedback type="invalid">
                {errors.instructions}
              </Form.Control.Feedback>
            </Form.Group>
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
            <Button 
              type="submit" 
              className="submit-btn"
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
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UpdateRecipeForm;