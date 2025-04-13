// DecorationTips.js
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function DecorationTips() {
  return (
    <div className="container py-5">
      <style>
        {`
          .tips-container {
            max-width: 800px;
            margin: 0 auto;
          }
          .create-btn {
            background: #007bff;
            border: none;
            padding: 10px 25px;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 50px;
            transition: all 0.3s;
            color: white;
            text-decoration: none;
            display: inline-block;
          }
          .create-btn:hover {
            background: #0056b3;
            transform: translateY(-2px);
            color: white;
            text-decoration: none;
          }
          .tip-card {
            background: #e7f1ff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            text-align: center;
          }
          .tip-card h5 {
            color: #003087;
            font-weight: 700;
          }
          .tip-card p {
            color: #6c757d;
          }
        `}
      </style>
      <div className="tips-container">
        <div className="d-flex justify-content-end mb-4">
          <Link to="/create-decoration-tips" className="btn create-btn">
            <i className="bi bi-plus-circle me-2"></i>
            Create Decoration Tips
          </Link>
        </div>
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <h1 className="display-5 text-center mb-4" style={{ color: '#003087' }}>
              Cake Decorating Tips
            </h1>
            <div className="tip-card">
              <h5 className="mb-3">No Decorating Tips Yet</h5>
              <p>Be the first to share a creative decorating tip!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DecorationTips;