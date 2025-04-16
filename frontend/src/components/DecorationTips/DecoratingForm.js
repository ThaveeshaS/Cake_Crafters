import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

function DecoratingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const editTip = location.state?.tip;

  const [formData, setFormData] = useState({
    title: editTip?.title || '',
    description: editTip?.description || '',
    category: editTip?.category || '',
    difficulty: editTip?.difficulty || '',
    media: editTip?.media || [],
    author: editTip?.author || '',
    tip: editTip?.tip || '',
    mediaType: editTip?.mediaType || 'images',
    createdAt: editTip?.createdAt || new Date().toISOString(),
  });
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editTip?.media?.length > 0) {
      const initialPreviews = editTip.media.map((media, index) => ({
        url: media,
        file: null,
        isVideo: editTip.mediaType === 'video',
      }));
      setPreviews(initialPreviews);
    }
  }, [editTip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (formData.mediaType === 'images' && formData.media.length === 0) {
      setError('Please upload at least one image');
      setIsSubmitting(false);
      return;
    }
    if (formData.mediaType === 'video' && formData.media.length === 0) {
      setError('Please upload a video');
      setIsSubmitting(false);
      return;
    }

    let mediaBase64 = formData.media;
    if (formData.media.some((m) => m instanceof File)) {
      mediaBase64 = await Promise.all(
        formData.media.map((file) =>
          file instanceof File
            ? new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
              })
            : Promise.resolve(file)
        )
      );
    }

    const tipData = {
      ...formData,
      media: mediaBase64,
    };

    try {
      if (editTip) {
        await axios.put(`http://localhost:8080/api/decoration-tips/${editTip.id}`, tipData);
      } else {
        await axios.post('http://localhost:8080/api/decoration-tips', tipData);
      }
      navigate('/decorationtips');
    } catch (err) {
      setError('Failed to save tip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaTypeChange = (type) => {
    setFormData({
      ...formData,
      mediaType: type,
      media: [],
    });
    setPreviews([]);
    setError('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    setError('');

    if (formData.mediaType === 'images') {
      if (formData.media.length + files.length > 3) {
        setError('You can upload a maximum of 3 images');
        return;
      }

      const imageFiles = files.filter((file) => file.type.match('image.*'));
      if (imageFiles.length !== files.length) {
        setError('Please upload only image files');
        return;
      }

      const newPreviews = [];
      const newMedia = [...formData.media];

      imageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push({
            url: reader.result,
            file: file,
          });
          newMedia.push(file);

          if (newPreviews.length === imageFiles.length) {
            setPreviews([...previews, ...newPreviews]);
            setFormData({ ...formData, media: newMedia });
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      if (files.length > 1) {
        setError('Please upload only one video');
        return;
      }

      const videoFile = files[0];
      if (!videoFile.type.match('video.*')) {
        setError('Please upload a video file');
        return;
      }

      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          setError('Video must be 30 seconds or shorter');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews([
            {
              url: reader.result,
              file: videoFile,
              isVideo: true,
            },
          ]);
          setFormData({ ...formData, media: [videoFile] });
        };
        reader.readAsDataURL(videoFile);
      };

      video.src = URL.createObjectURL(videoFile);
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
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeMedia = (index) => {
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    const newMedia = [...formData.media];
    newMedia.splice(index, 1);
    setFormData({ ...formData, media: newMedia });
  };

  const handleBack = () => {
    navigate('/decorationtips');
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

          .back-btn {
            background: linear-gradient(135deg, #6c757d, #adb5bd);
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

          .back-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4);
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

          .preview-item img,
          .preview-item video {
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

          .error-message {
            color: var(--danger-color);
            font-size: 0.9rem;
            margin-top: 0.5rem;
          }

          .media-selector {
            display: flex;
            margin-bottom: 1rem;
            border-radius: 8px;
            overflow: hidden;
          }

          .media-option {
            flex: 1;
            text-align: center;
            padding: 0.75rem;
            cursor: pointer;
            background: #f8f9fa;
            border: 1px solid var(--border-color);
            transition: all 0.3s;
          }

          .media-option:first-child {
            border-right: none;
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }

          .media-option:last-child {
            border-left: none;
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
          }

          .media-option.active {
            background: var(--primary-color);
            color: white;
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

            .submit-btn, .back-btn {
              width: 100%;
            }
          }
        `}
      </style>

      <div className="create-recipe-container">
        <h1 className="form-header">{editTip ? 'Edit Decoration Tip' : 'Create a Decoration Tip'}</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3><i className="bi bi-person-badge"></i> Basic Information</h3>

            <div className="form-group">
              <label htmlFor="author" className="form-label required-field">
                Author Name
              </label>
              <input
                type="text"
                className="form-control"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Your name or nickname"
              />
            </div>

            <div className="form-group">
              <label htmlFor="title" className="form-label required-field">
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
                placeholder="e.g. Perfect Frosting Technique"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label required-field">
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
                placeholder="Briefly describe your decorating tip"
              />
            </div>

            <div className="row">
              <div className="col-md-6 form-group">
                <label htmlFor="category" className="form-label required-field">
                  Category
                </label>
                <select
                  className="form-select"
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
              <div className="col-md-6 form-group">
                <label htmlFor="difficulty" className="form-label required-field">
                  Difficulty
                </label>
                <select
                  className="form-select"
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
            </div>
          </div>

          <div className="form-section">
            <h3><i className="bi bi-lightbulb"></i> Tip Details</h3>
            <div className="form-group">
              <label htmlFor="tip" className="form-label required-field">
                Decoration Tip
              </label>
              <textarea
                className="form-control"
                id="tip"
                name="tip"
                value={formData.tip}
                onChange={handleChange}
                rows="6"
                required
                placeholder="Explain your decorating tip in detail"
              />
            </div>
          </div>

          <div className="form-section">
            <h3><i className="bi bi-images"></i> Media Upload</h3>
            <div className="media-selector">
              <div
                className={`media-option ${formData.mediaType === 'images' ? 'active' : ''}`}
                onClick={() => handleMediaTypeChange('images')}
              >
                <i className="bi bi-images me-2"></i>
                Images (Max 3)
              </div>
              <div
                className={`media-option ${formData.mediaType === 'video' ? 'active' : ''}`}
                onClick={() => handleMediaTypeChange('video')}
              >
                <i className="bi bi-camera-reels me-2"></i>
                Video (Max 30s)
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={formData.mediaType === 'images' ? 'image/*' : 'video/*'}
              className="file-input"
              multiple={formData.mediaType === 'images'}
            />
            <div
              className="upload-area"
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previews.length === 0 ? (
                <>
                  <div className="upload-icon">
                    <i className={`bi ${formData.mediaType === 'images' ? 'bi-images' : 'bi-camera-reels'}`}></i>
                  </div>
                  <div className="upload-text">
                    <h5>
                      {formData.mediaType === 'images'
                        ? 'Drag & Drop your images here'
                        : 'Drag & Drop your video here'}
                    </h5>
                    <p>or click to browse files</p>
                    <p className="small">
                      {formData.mediaType === 'images'
                        ? 'Supports: JPG, PNG, GIF (Max 5MB each)'
                        : 'Supports: MP4, MOV (Max 30 seconds)'}
                    </p>
                  </div>
                  <button type="button" className="browse-btn">
                    <i className="bi bi-folder2-open me-2"></i> Browse Files
                  </button>
                </>
              ) : (
                <div className="image-previews">
                  {previews.map((preview, index) => (
                    <div key={index} className="preview-item">
                      {preview.isVideo ? (
                        <video controls>
                          <source src={preview.url} type={preview.file?.type || 'video/mp4'} />
                        </video>
                      ) : (
                        <img src={preview.url} alt={`Preview ${index + 1}`} />
                      )}
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMedia(index);
                        }}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="upload-status">
              <div className="upload-count">
                {previews.length} {previews.length === 1 ? 'file' : 'files'} selected
              </div>
              <div className="max-files">
                {formData.mediaType === 'images' ? 'Max 3 images' : 'Max 1 video'}
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="form-footer">
            <div className="date-display">
              <i className="bi bi-calendar me-2"></i>
              {new Date(formData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div>
              <button type="button" className="btn back-btn me-2" onClick={handleBack}>
                <i className="bi bi-arrow-left-circle me-2"></i>
                Back
              </button>
              <button type="submit" className="btn submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    {editTip ? 'Update Tip' : 'Add Tip'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DecoratingForm;