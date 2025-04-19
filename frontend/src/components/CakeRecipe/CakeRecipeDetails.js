import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const CakeRecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/cake-recipes/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Recipe not found');
        }
        return response.json();
      })
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      fetch(`http://localhost:8080/api/cake-recipes/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete recipe');
          }
          navigate('/displaycakerecipe');
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };

  const handleCommentDelete = (commentIndex) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const updatedComments = recipe.comments.filter((_, index) => index !== commentIndex);
      fetch(`http://localhost:8080/api/cake-recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...recipe, comments: updatedComments }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete comment');
          }
          return response.json();
        })
        .then((updatedRecipe) => {
          setRecipe(updatedRecipe);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };

  const downloadPDF = async () => {
    if (!recipe || pdfGenerating) return;
    
    setPdfGenerating(true);
    try {
      // Create a temporary container for PDF generation
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.width = '800px';
      pdfContainer.style.padding = '40px';
      pdfContainer.style.background = 'linear-gradient(to right, #ffffff 70%, #f5f1e9 30%)';
      pdfContainer.style.fontFamily = 'Arial, sans-serif';

      // Build PDF content with new layout: image on right, ingredients on left, and a page border
      pdfContainer.innerHTML = `
        <div style="border: 2px solid #4a2c2a; border-radius: 8px; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4a2c2a; font-weight: 700; margin-bottom: 10px; font-size: 32px;">
              ${recipe.cakeName}
            </h1>
            ${recipe.subTitle ? `
              <p style="background-color:rgb(251, 227, 203); color: #4a2c2a; font-size: 12px; margin-bottom: 20px; padding: 5px 10px; display: inline-block; border-radius: 5px;">
                ${recipe.subTitle}
              </p>` : ''
            }
            <div style="height: 2px; background: linear-gradient(to right, transparent, #4a2c2a, transparent); margin: 0 auto 20px; width: 80%;"></div>
          </div>

          <div style="display: flex; margin-bottom: 30px; gap: 20px;">
            <div style="width: 50%;">
              <h2 style="color: #4a2c2a; border-bottom: 2px solid #f1f1f1; padding-bottom: 8px; margin-bottom: 15px; font-size: 24px;">
                Ingredients
              </h2>
              <ul style="list-style-type: none; padding: 0;">
                ${recipe.ingredients.split('\n').map(item => `
                  <li style="margin-bottom: 10px; padding-left: 25px; position: relative; line-height: 1.5;">
                    <span style="position: absolute; left: 0; top: 6px; width: 8px; height: 8px; background: #4a2c2a; border-radius: 50%;"></span>
                    ${item}
                  </li>
                `).join('')}
              </ul>
            </div>
            <div style="width: 50%; display: flex; justify-content: center; align-items: flex-start;">
              ${recipe.images && recipe.images.length > 0 ? `
                <img src="${recipe.images[0]}" style="max-height: 300px; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
              ` : ''}
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="color: #4a2c2a; border-bottom: 2px solid #f1f1f1; padding-bottom: 8px; margin-bottom: 15px; font-size: 24px;">
              Instructions
            </h2>
            <ol style="counter-reset: step-counter; list-style-type: none; padding: 0;">
              ${recipe.instructions.split('\n').map((step, index) => `
                <li style="margin-bottom: 20px; counter-increment: step-counter; position: relative; padding-left: 40px; line-height: 1.6;">
                  <div style="
                    position: absolute;
                    left: 0;
                    top: 0;
                    background: #4a2c2a;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                  ">
                    ${index + 1}
                  </div>
                  <div style="margin-top: 5px;">${step}</div>
                </li>
              `).join('')}
            </ol>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f1f1; color: #95a5a6; font-size: 14px;">
            <p>Recipe generated from Cake Crafters • ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      `;

      document.body.appendChild(pdfContainer);

      // Generate canvas
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        logging: false,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: pdfContainer.scrollWidth,
        windowHeight: pdfContainer.scrollHeight
      });

      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
      const pageHeight = imgHeight + 0; // Add some margin

      // Create PDF with dynamic height
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [imgWidth, pageHeight]
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${recipe.cakeName.replace(/\s+/g, '_')}_recipe.pdf`);

      // Clean up
      document.body.removeChild(pdfContainer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setPdfGenerating(false);
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

  if (error) {
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
    <div className="container py-5">
      <style>
        {`
          :root {
            --primary-color: #6c5ce7;
            --secondary-color: #a29bfe;
            --accent-color: #fd79a8;
            --light-color: #f8f9fa;
            --dark-color: #343a40;
            --success-color: #00b894;
            --danger-color: #d63031;
            --info-color: #0984e3;
          }
          
          .recipe-details-container {
            max-width: 1000px;
            margin: 0 auto;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            overflow: hidden;
          }
          
          .recipe-header {
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          }
          
          .recipe-title {
            color: var(--dark-color);
            font-weight: 800;
            margin-bottom: 0.5rem;
            font-size: 2.2rem;
          }
          
          .recipe-subtitle {
            color: #6c757d;
            font-size: 1.1rem;
            font-weight: 400;
            margin-bottom: 1.5rem;
          }
          
          .recipe-content {
            padding: 2rem;
          }
          
          .main-image-container {
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 2rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          
          .main-image {
            width: 100%;
            height: 400px;
            object-fit: cover;
            transition: transform 0.5s ease;
          }
          
          .main-image:hover {
            transform: scale(1.02);
          }
          
          .image-counter {
            position: absolute;
            bottom: 15px;
            right: 15px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
          }
          
          .recipe-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            background: #f9f9ff;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 2rem;
          }
          
          .meta-item {
            display: flex;
            align-items: center;
            font-size: 0.95rem;
            color: #555;
          }
          
          .meta-icon {
            margin-right: 8px;
            color: var(--primary-color);
            font-size: 1.1rem;
          }
          
          .section-title {
            color: var(--dark-color);
            font-weight: 700;
            margin: 2rem 0 1.5rem;
            position: relative;
            padding-bottom: 0.75rem;
            font-size: 1.5rem;
          }
          
          .section-title:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 2px;
          }
          
          .ingredients-list {
            list-style-type: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
          }
          
          .ingredient-item {
            background: #f9f9ff;
            padding: 1rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            transition: all 0.3s ease;
          }
          
          .ingredient-item:hover {
            background: #f0f0ff;
            transform: translateY(-3px);
          }
          
          .ingredient-icon {
            margin-right: 10px;
            color: var(--accent-color);
          }
          
          .instructions-list {
            counter-reset: step-counter;
            list-style-type: none;
            padding: 0;
            margin-bottom: 2rem;
          }
          
          .instruction-step {
            position: relative;
            padding-left: 3rem;
            margin-bottom: 1.5rem;
            line-height: 1.6;
          }
          
          .instruction-step:before {
            counter-increment: step-counter;
            content: counter(step-counter);
            position: absolute;
            left: 0;
            top: 0;
            width: 2rem;
            height: 2rem;
            background: var(--primary-color);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          }
          
          .image-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
          }
          
          .gallery-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
          }
          
          .gallery-image:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-color: var(--primary-color);
          }
          
          .gallery-image.active {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.3);
          }
          
          .action-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 2rem;
          }
          
          .back-btn {
            background: var(--primary-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            border: none;
          }
          
          .back-btn:hover {
            background: #5649d1;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
            color: white;
          }
          
          .update-btn {
            background: var(--success-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            border: none;
          }
          
          .update-btn:hover {
            background: #00997b;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 184, 148, 0.3);
            color: white;
          }
          
          .delete-btn {
            background: var(--danger-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            border: none;
          }
          
          .delete-btn:hover {
            background: #c0392b;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(214, 48, 49, 0.3);
            color: white;
          }
          
          .pdf-btn {
            background: var(--info-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            transition: all 0.3s;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            border: none;
          }
          
          .pdf-btn:hover {
            background: #0767b1;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(9, 132, 227, 0.3);
            color: white;
          }
          
          .pdf-btn:disabled {
            background: #95a5a6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
          
          .comments-section {
            background: #f9f9ff;
            padding: 2rem;
            border-radius: 12px;
            margin-top: 2rem;
          }
          
          .comment-list {
            list-style-type: none;
            padding: 0;
          }
          
          .comment-item {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .comment-item:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 4px;
            background: var(--secondary-color);
            border-radius: 0 4px 4px 0;
          }
          
          .comment-delete-btn {
            background: transparent;
            border: none;
            color: var(--danger-color);
            cursor: pointer;
            padding: 0.5rem;
            transition: all 0.3s;
          }
          
          .comment-delete-btn:hover {
            color: #c0392b;
            transform: scale(1.1);
          }
          
          .empty-state {
            text-align: center;
            padding: 3rem;
            background: #f9f9ff;
            border-radius: 12px;
          }
          
          .empty-state-icon {
            font-size: 4rem;
            color: var(--secondary-color);
            margin-bottom: 1rem;
          }
          
          @media (max-width: 768px) {
            .recipe-title {
              font-size: 1.8rem;
            }
            
            .main-image {
              height: 300px;
            }
            
            .ingredients-list {
              grid-template-columns: 1fr;
            }
            
            .action-buttons {
              flex-direction: column;
            }
            
            .back-btn,
            .update-btn,
            .delete-btn,
            .pdf-btn {
              width: 100%;
              justify-content: center;
            }
          }

          .button-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
          }

          .action-buttons {
            display: flex;
            gap: 10px;
          }
        `}
      </style>

      <div className="recipe-details-container">
        <div className="recipe-header">
          <h1 className="recipe-title">{recipe.cakeName}</h1>
          {recipe.subTitle && (
            <p className="recipe-subtitle">{recipe.subTitle}</p>
          )}
        </div>

        <div className="recipe-content" id="recipe-content">
          {recipe.images && recipe.images.length > 0 && (
            <div className="main-image-container">
              <img
                src={recipe.images[activeImage]}
                alt={recipe.cakeName}
                className="main-image"
              />
              {recipe.images.length > 1 && (
                <span className="image-counter">
                  {activeImage + 1}/{recipe.images.length}
                </span>
              )}
            </div>
          )}

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            margin: '20px 0',
            padding: '12px',
            background: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'white',
              borderRadius: '6px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <i className="bi bi-person" style={{ color: '#7c3aed', fontSize: '16px' }}></i>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Author</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{recipe.authorName || 'Anonymous'}</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'white',
              borderRadius: '6px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <i className="bi bi-cake" style={{ color: '#7c3aed', fontSize: '16px' }}></i>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Type</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{recipe.cakeType}</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'white',
              borderRadius: '6px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <i className="bi bi-speedometer2" style={{ color: '#7c3aed', fontSize: '16px' }}></i>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Skill</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{recipe.skillLevel}</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'white',
              borderRadius: '6px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <i className="bi bi-clock" style={{ color: '#7c3aed', fontSize: '16px' }}></i>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Prep</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{recipe.prepTime}</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'white',
              borderRadius: '6px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <i className="bi bi-egg-fried" style={{ color: '#7c3aed', fontSize: '16px' }}></i>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Cook</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{recipe.cookTime}</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'white',
              borderRadius: '6px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <i className="bi bi-people" style={{ color: '#7c3aed', fontSize: '16px' }}></i>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Servings</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{recipe.servings}</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'white',
              borderRadius: '6px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <i className="bi bi-calendar" style={{ color: '#7c3aed', fontSize: '16px' }}></i>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Date</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{recipe.date}</div>
              </div>
            </div>
          </div>

          {recipe.images && recipe.images.length > 1 && (
            <div>
              <h3 className="section-title">Gallery</h3>
              <div className="image-gallery">
                {recipe.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Cake ${index + 1}`}
                    className={`gallery-image ${index === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="section-title">Ingredients</h3>
            <ul className="ingredients-list">
              {recipe.ingredients.split('\n').map((item, index) => (
                <li key={index} className="ingredient-item">
                  <i className="bi bi-check-circle-fill ingredient-icon"></i>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-title">Instructions</h3>
            <ol className="instructions-list">
              {recipe.instructions.split('\n').map((step, index) => (
                <li key={index} className="instruction-step">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <hr className="my-3" />
          <hr className="my-3" />

          <div className="button-container">
            <div className="action-buttons">
              <Link to="/displaycakerecipe" className="btn back-btn">
                <i className="bi bi-arrow-left me-2"></i> Back to Recipes
              </Link>
              <button
                onClick={downloadPDF}
                className="btn pdf-btn"
                disabled={pdfGenerating}
              >
                {pdfGenerating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-file-earmark-pdf me-2"></i> Download Recipe
                  </>
                )}
              </button>
              <Link to={`/recipe/${id}/update`} className="btn update-btn">
                <i className="bi bi-pencil-square me-2"></i> Update Recipe
              </Link>
              <button onClick={handleDelete} className="btn delete-btn">
                <i className="bi bi-trash me-2"></i> Delete Recipe
              </button>
            </div>
          </div>

          {recipe.comments && recipe.comments.length > 0 ? (
            <div className="comments-section">
              <h3 className="section-title">Comments</h3>
              <ul className="comment-list">
                {recipe.comments.map((comment, index) => (
                  <li key={index} className="comment-item">
                    <span>{comment}</span>
                    <button 
                      className="comment-delete-btn" 
                      onClick={() => handleCommentDelete(index)}
                      title="Delete comment"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="empty-state">
              <i className="bi bi-chat-left-text empty-state-icon"></i>
              <h4>No Comments Yet</h4>
              <p className="text-muted">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CakeRecipeDetails;