// DecorationTips.js
import React, { useState } from 'react';
import DecoratingForm from './DecoratingForm'; // Adjust path as needed
import 'bootstrap/dist/css/bootstrap.min.css';

function DecorationTips() {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  return (
    <div className="container py-5">
      <style>
        {`
          .create-btn {
            background: #4a4e69;
            border: none;
            padding: 10px 25px;
            font-size: 1.1rem;
            font-weight: 600;
            letter-spacing: 1px;
            border-radius: 20px;
            transition: all 0.3s;
          }
          .create-btn:hover {
            background: #3a3d56;
            transform: translateY(-2px);
          }
          .tips-container {
            max-width: 800px;
            margin: 0 auto;
          }
          .placeholder-card {
            background: #f9f9ff;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            text-align: center;
          }
        `}
      </style>
      <div className="tips-container">
        <div className="d-flex justify-content-end mb-4">
          <button className="btn create-btn" onClick={toggleForm}>
            <i className="bi bi-plus-circle me-2"></i>Create Decoration Tips
          </button>
        </div>
        {showForm && (
          <div className="card p-4 mb-4" style={{ borderRadius: '15px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
            <DecoratingForm onSubmit={toggleForm} />
          </div>
        )}
        <div className="placeholder-card">
          <h4 className="text-muted mb-3" style={{ color: '#4a4e69' }}>
            No Decoration Tips Yet
          </h4>
          <p>Be the first to share a creative decorating tip!</p>
        </div>
      </div>
    </div>
  );
}

export default DecorationTips;