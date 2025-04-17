import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';


function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }
    // Here you would typically make an API call to register the user
    console.log('User registered:', formData);
    navigate('/login');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0" style={{
              borderRadius: '15px',
              animation: 'fadeIn 0.5s ease-in'
            }}>
              <div className="card-body p-5">
                <h2 className="text-center mb-4" style={{
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>Create Your Account</h2>
                
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <svg className="bi flex-shrink-0 me-2" width="24" height="24">
                      <use xlinkHref="#exclamation-triangle-fill" />
                    </svg>
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4 position-relative">
                    <label htmlFor="username" className="form-label fw-medium">Username</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FontAwesomeIcon icon={faUser} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Enter your username"
                        style={{ borderRadius: '0 5px 5px 0' }}
                      />
                    </div>
                  </div>

                  <div className="mb-4 position-relative">
                    <label htmlFor="email" className="form-label fw-medium">Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        style={{ borderRadius: '0 5px 5px 0' }}
                      />
                    </div>
                  </div>

                  <div className="mb-4 position-relative">
                    <label htmlFor="password" className="form-label fw-medium">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                        style={{ borderRadius: '0 5px 5px 0' }}
                      />
                    </div>
                  </div>

                  <div className="mb-4 position-relative">
                    <label htmlFor="confirmPassword" className="form-label fw-medium">Confirm Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm your password"
                        style={{ borderRadius: '0 5px 5px 0' }}
                      />
                    </div>
                  </div>

                  <div className="d-grid mb-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg" 
                      style={{
                        background: 'linear-gradient(90deg, #007bff, #0056b3)',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        borderRadius: '8px'
                      }}
                      onMouseOver={(e) => e.target.style.opacity = '0.9'}
                      onMouseOut={(e) => e.target.style.opacity = '1'}
                    >
                      Sign Up
                    </button>
                  </div>
                </form>

                <p className="text-center text-muted mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary fw-medium text-decoration-none">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(0,123,255,0.25);
          border-color: #80bdff;
        }

        @media (max-width: 576px) {
          .card {
            margin: 0 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default SignUp;