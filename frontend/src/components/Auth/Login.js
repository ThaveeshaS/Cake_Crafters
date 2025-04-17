import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faLock, 
  faEye, 
  faEyeSlash, 
  faCheckCircle, 
  faTimesCircle,
  faSignInAlt,
  faStar,
  faGem,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
// Need to import additional brand icons
import { faFacebookF as fabFacebookF, faGoogle as fabGoogle } from '@fortawesome/free-brands-svg-icons';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user was redirected from signup page
  useEffect(() => {
    if (location.state?.fromSignup) {
      setSuccessMessage(location.state.message || 'Account created successfully! Please login with your credentials.');
      // Pre-fill email if provided from signup
      if (location.state.email) {
        setFormData(prev => ({
          ...prev,
          email: location.state.email
        }));
      }
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear specific field error when user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      try {
        // Here you would typically make an API call to authenticate the user
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated delay
        console.log('User logged in:', formData);
        navigate('/dashboard');
      } catch (error) {
        setErrors({ form: 'Login failed. Please check your credentials and try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic here
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 100%)',
      padding: '20px'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="card shadow-lg border-0" style={{
              borderRadius: '20px',
              overflow: 'hidden',
              animation: 'fadeIn 0.7s ease-out',
              background: 'linear-gradient(to bottom, #ffffff, #f9f9ff)'
            }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="login-icon mb-3">
                    <FontAwesomeIcon 
                      icon={faSignInAlt} 
                      className="text-primary" 
                      style={{ 
                        fontSize: '2.5rem',
                        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }} 
                    />
                  </div>
                  <h2 style={{
                    color: '#2c3e50',
                    fontWeight: '700',
                    textShadow: '0px 1px 2px rgba(0,0,0,0.1)',
                    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>Welcome Back to Cake Crafters</h2>
                  <p className="text-muted" style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                    color: '#6c757d',
                    textShadow: '0px 1px 1px rgba(255,255,255,0.8)'
                  }}>
                    <FontAwesomeIcon icon={faGem} className="me-2" style={{color: '#ffc107'}} />
                    Sign in to your account
                    <FontAwesomeIcon icon={faGem} className="ms-2" style={{color: '#ffc107'}} />
                  </p>
                </div>
                
                {successMessage && (
                  <div className="alert alert-success d-flex align-items-center mb-4" role="alert" style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 10px rgba(25, 135, 84, 0.2)',
                    border: 'none',
                    background: 'linear-gradient(to right, #a8e063, #56ab2f)',
                    color: '#fff',
                    fontWeight: '500',
                    padding: '1rem'
                  }}>
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    <div>{successMessage}</div>
                  </div>
                )}
                
                {errors.form && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert" style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 10px rgba(255, 77, 77, 0.2)',
                    border: 'none',
                    background: 'linear-gradient(to right, #ff9a9e, #fad0c4)',
                    color: '#842029',
                    fontWeight: '500'
                  }}>
                    <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                    <div>{errors.form}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3 position-relative">
                    <label htmlFor="email" className="form-label fw-medium" style={{
                      fontSize: '0.95rem',
                      color: '#495057',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <FontAwesomeIcon icon={faStar} className="me-2" style={{fontSize: '0.7rem', color: '#6a11cb'}} />
                      Email Address
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text" style={{
                        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                        border: 'none',
                        color: 'white'
                      }}>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </span>
                      <input
                        type="email"
                        className={`form-control py-2 ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        style={{ 
                          borderRadius: '0 8px 8px 0', 
                          fontSize: '16px',
                          boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)',
                          border: '1px solid #ced4da',
                          padding: '0.75rem 1rem',
                          transition: 'all 0.3s ease'
                        }}
                      />
                      {formData.email && !errors.email && (
                        <div className="position-absolute end-0 top-50 translate-middle-y pe-3" style={{ zIndex: 5 }}>
                          <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <div className="invalid-feedback d-block" style={{
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        color: '#dc3545',
                        marginTop: '0.5rem',
                        animation: 'fadeIn 0.3s ease-in'
                      }}>
                        <FontAwesomeIcon icon={faTimesCircle} className="me-1" />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="mb-3 position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                      <label htmlFor="password" className="form-label fw-medium" style={{
                        fontSize: '0.95rem',
                        color: '#495057',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        letterSpacing: '0.5px',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <FontAwesomeIcon icon={faStar} className="me-2" style={{fontSize: '0.7rem', color: '#6a11cb'}} />
                        Password
                      </label>
                      <Link to="/forgot-password" style={{
                        fontSize: '0.85rem',
                        color: '#6a11cb',
                        fontWeight: '600',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease'
                      }}>
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text" style={{
                        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                        border: 'none',
                        color: 'white'
                      }}>
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control py-2 ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                        style={{ 
                          borderRadius: '0', 
                          fontSize: '16px',
                          boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)',
                          border: '1px solid #ced4da',
                          padding: '0.75rem 1rem',
                          transition: 'all 0.3s ease'
                        }}
                      />
                      <button
                        className="input-group-text"
                        type="button"
                        onClick={togglePasswordVisibility}
                        style={{ 
                          cursor: 'pointer', 
                          borderRadius: '0 8px 8px 0',
                          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                          border: 'none',
                          color: 'white'
                        }}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {errors.password && (
                      <div className="invalid-feedback d-block" style={{
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        color: '#dc3545',
                        marginTop: '0.5rem',
                        animation: 'fadeIn 0.3s ease-in'
                      }}>
                        <FontAwesomeIcon icon={faTimesCircle} className="me-1" />
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="form-check" style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0,
                      margin: '0.5rem 0'
                    }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        style={{
                          width: '1.2em',
                          height: '1.2em',
                          marginRight: '0.5rem',
                          cursor: 'pointer',
                          borderColor: '#6a11cb',
                          boxShadow: 'none'
                        }}
                      />
                      <label 
                        className="form-check-label" 
                        htmlFor="rememberMe"
                        style={{
                          fontSize: '0.95rem',
                          color: '#495057',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Remember me
                      </label>
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg" 
                      style={{
                        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        borderRadius: '12px',
                        padding: '14px',
                        fontWeight: '600',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 15px rgba(106, 17, 203, 0.3)'
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                          Sign In
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="position-relative my-4">
                    <hr className="my-4" style={{
                      background: 'linear-gradient(to right, transparent, rgba(106, 17, 203, 0.2), transparent)',
                      height: '2px',
                      border: 'none'
                    }} />
                    <div className="position-absolute top-50 start-50 translate-middle px-3" style={{
                      background: 'linear-gradient(to right, #ffffff, #f9f9ff)',
                      borderRadius: '20px',
                      padding: '5px 15px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                      <p className="mb-0" style={{
                        color: '#6c757d',
                        fontWeight: '500',
                        fontSize: '0.9rem'
                      }}>or continue with</p>
                    </div>
                  </div>
                  
                  {/* Social Login Buttons */}
                  <div className="d-flex justify-content-center gap-3 mb-4">
                    <button 
                      type="button" 
                      onClick={() => handleSocialLogin('facebook')}
                      className="btn social-btn"
                      style={{
                        borderRadius: '50%',
                        width: '55px',
                        height: '55px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                        transition: 'all 0.3s ease',
                        backgroundColor: '#3b5998',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 10px rgba(59, 89, 152, 0.3)'
                      }}
                    >
                      <FontAwesomeIcon icon={fabFacebookF} />
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={() => handleSocialLogin('google')}
                      className="btn social-btn"
                      style={{
                        borderRadius: '50%',
                        width: '55px',
                        height: '55px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                        transition: 'all 0.3s ease',
                        backgroundColor: '#db4437',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 10px rgba(219, 68, 55, 0.3)'
                      }}
                    >
                      <FontAwesomeIcon icon={fabGoogle} />
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <p style={{
                      color: '#6c757d',
                      fontSize: '1rem',
                      fontWeight: '500',
                      marginBottom: '0'
                    }}>
                      Don't have an account?{' '}
                      <Link to="/signup" style={{
                        color: '#6a11cb',
                        fontWeight: '600',
                        textDecoration: 'none',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                      }}>
                        Sign up
                        <span style={{
                          position: 'absolute',
                          bottom: '-2px',
                          left: '0',
                          width: '100%',
                          height: '2px',
                          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                          transform: 'scaleX(0)',
                          transformOrigin: 'bottom right',
                          transition: 'transform 0.3s ease',
                          borderRadius: '2px'
                        }}></span>
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="text-center mt-3">
              <small style={{
                color: '#6c757d',
                fontSize: '0.85rem',
                fontWeight: '500',
                padding: '8px 15px',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                Secure login powered by Cake Crafters
              </small>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .form-control {
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(106, 17, 203, 0.25);
          border-color: #8643cb;
        }
        
        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        
        .social-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 576px) {
          .card {
            margin: 0 15px;
          }
        }
        
        .login-icon {
          background: linear-gradient(135deg, rgba(106, 17, 203, 0.1) 0%, rgba(37, 117, 252, 0.1) 100%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 4px 15px rgba(106, 17, 203, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .login-icon::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(transparent, rgba(106, 17, 203, 0.1), transparent 30%);
          animation: rotate 4s linear infinite;
        }
        
        @keyframes rotate {
          100% {
            transform: rotate(1turn);
          }
        }
        
        a:hover span {
          transform: scaleX(1);
          transformOrigin: bottom left;
        }
        
        .form-check-input:checked {
          background-color: #6a11cb;
          border-color: #6a11cb;
        }
      `}</style>
    </div>
  );
}

export default Login;