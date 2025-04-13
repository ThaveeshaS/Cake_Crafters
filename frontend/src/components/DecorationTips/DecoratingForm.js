// DecoratingForm.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
    media: [],
    author: editTip?.author || '',
    tip: editTip?.tip || '',
    mediaType: editTip?.mediaType || 'images',
  });
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editTip?.media?.length > 0) {
      const initialPreviews = editTip.media.map((media, index) => ({
        url: media,
        file: null,
        isVideo: editTip.mediaType === 'video',
      }));
      setPreviews(initialPreviews);
      setFormData((prev) => ({ ...prev, media: editTip.media }));
    }
  }, [editTip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.mediaType === 'images' && formData.media.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    if (formData.mediaType === 'video' && formData.media.length === 0) {
      setError('Please upload a video');
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
      id: editTip?.id || Date.now(),
      ...formData,
      media: mediaBase64,
      createdAt: editTip?.createdAt || new Date().toISOString(),
    };

    const existingTips = JSON.parse(localStorage.getItem('decorationTips') || '[]');
    let updatedTips;
    if (editTip) {
      updatedTips = existingTips.map((tip) =>
        tip.id === editTip.id ? tipData : tip
      );
    } else {
      updatedTips = [...existingTips, tipData];
    }
    localStorage.setItem('decorationTips', JSON.stringify(updatedTips));

    navigate('/decorationtips');
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
          .media-preview {
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
          .media-selector {
            display: flex;
            margin-bottom: 1rem;
            border-radius: 8px;
            overflow: hidden;
          }
          .media-option {
            flex: 1;
            text-align: center;
            padding: 0.5rem;
            cursor: pointer;
            background: ${formData.mediaType === 'images' ? '#e7f1ff' : '#f8f9fa'};
            border: 1px solid #dee2e6;
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
            background: #007bff;
            color: white;
          }
          .media-option:nth-child(1).active {
            background: ${formData.mediaType === 'images' ? '#007bff' : '#f8f9fa'};
          }
          .media-option:nth-child(2).active {
            background: ${formData.mediaType === 'video' ? '#007bff' : '#f8f9fa'};
          }
          .preview-container {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-top: 1rem;
          }
          .preview-item {
            position: relative;
            width: calc(33.333% - 1rem);
          }
          .preview-item video {
            width: 100%;
            max-height: 150px;
            border-radius: 8px;
          }
          .error-message {
            color: #dc3545;
            font-size: 0.9rem;
            margin-top: 0.5rem;
          }
        `}
      </style>
      <div className="form-container">
        <div className="form-card">
          <h1 className="display-5 text-center mb-4" style={{ color: '#003087' }}>
            {editTip ? 'Edit Decoration Tip' : 'Create a Decoration Tip'}
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
              <label className="form-label">Upload Media</label>
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
                className="d-none"
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
                    <i
                      className={`bi ${
                        formData.mediaType === 'images' ? 'bi-images' : 'bi-camera-reels'
                      } upload-icon`}
                    ></i>
                    <h5>
                      {formData.mediaType === 'images'
                        ? 'Drag & Drop your images here'
                        : 'Drag & Drop your video here'}
                    </h5>
                    <p className="text-muted">or click to browse files</p>
                    <p className="text-muted small">
                      {formData.mediaType === 'images'
                        ? 'Supports: JPG, PNG, GIF (Max 5MB each)'
                        : 'Supports: MP4, MOV (Max 30 seconds)'}
                    </p>
                  </>
                ) : (
                  <div className="preview-container">
                    {previews.map((preview, index) => (
                      <div key={index} className="preview-item">
                        {preview.isVideo ? (
                          <video controls className="media-preview">
                            <source src={preview.url} type={preview.file?.type || 'video/mp4'} />
                          </video>
                        ) : (
                          <img src={preview.url} alt="Preview" className="media-preview" />
                        )}
                        <div className="file-info">
                          {(preview.file?.name || `Image ${index + 1}`) +
                            (preview.file ? ` (${(preview.file.size / 1024).toFixed(2)} KB)` : '')}
                        </div>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMedia(index);
                          }}
                        >
                          <i className="bi bi-trash me-1"></i> Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn submit-btn">
                <i className="bi bi-check-circle me-2"></i>
                {editTip ? 'Update Tip' : 'Submit Tip'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DecoratingForm;