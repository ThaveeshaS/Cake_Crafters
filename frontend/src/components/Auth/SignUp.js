import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  faUserPlus,
  faFacebookF,
  faGoogle
} from '@fortawesome/free-solid-svg-icons';
// Need to import additional brand icons
import { faFacebookF as fabFacebookF, faGoogle as fabGoogle } from '@fortawesome/free-brands-svg-icons';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear specific field error when user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Password strength checker
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };
  
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 4) return 'Medium';
    return 'Strong';
  };
  
  const getStrengthColor = () => {
    if (passwordStrength === 0) return '#d3d3d3';
    if (passwordStrength <= 2) return '#ff4d4d';
    if (passwordStrength <= 4) return '#ffa500';
    return '#00cc00';
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        // Here you would typically make an API call to register the user
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated delay
        console.log('User registered:', formData);
        navigate('/login');
      } catch (error) {
        setErrors({ form: 'Registration failed. Please try again.' });
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
      background: 'radial-gradient(circle, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)',
      padding: '20px'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            <div className="card shadow-lg border-0" style={{
              borderRadius: '20px',
              overflow: 'hidden',
              animation: 'fadeIn 0.7s ease-out'
            }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="signup-icon mb-3">
                    <FontAwesomeIcon 
                      icon={faUserPlus} 
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
                    textShadow: '0px 1px 2px rgba(0,0,0,0.1)'
                  }}>Create Your Account</h2>
                  <p className="text-muted">Fill in your details to get started</p>
                </div>
                
                {errors.form && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                    <div>{errors.form}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3 position-relative">
                    <label htmlFor="username" className="form-label fw-medium">Username</label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light">
                        <FontAwesomeIcon icon={faUser} className="text-primary" />
                      </span>
                      <input
                        type="text"
                        className={`form-control py-2 ${errors.username ? 'is-invalid' : ''}`}
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Enter your username"
                        style={{ borderRadius: '0 8px 8px 0', fontSize: '16px' }}
                      />
                      {formData.username && !errors.username && (
                        <div className="position-absolute end-0 top-50 translate-middle-y pe-3" style={{ zIndex: 5 }}>
                          <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                        </div>
                      )}
                    </div>
                    {errors.username && <div className="invalid-feedback d-block">{errors.username}</div>}
                  </div>

                  <div className="mb-3 position-relative">
                    <label htmlFor="email" className="form-label fw-medium">Email Address</label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light">
                        <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
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
                        style={{ borderRadius: '0 8px 8px 0', fontSize: '16px' }}
                      />
                      {formData.email && !errors.email && (
                        <div className="position-absolute end-0 top-50 translate-middle-y pe-3" style={{ zIndex: 5 }}>
                          <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                        </div>
                      )}
                    </div>
                    {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                  </div>

                  <div className="mb-3 position-relative">
                    <label htmlFor="password" className="form-label fw-medium">Password</label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light">
                        <FontAwesomeIcon icon={faLock} className="text-primary" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control py-2 ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Create a password"
                        style={{ borderRadius: '0', fontSize: '16px' }}
                      />
                      <button
                        className="input-group-text bg-light"
                        type="button"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: 'pointer', borderRadius: '0 8px 8px 0' }}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                    
                    {formData.password && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small>Password Strength:</small>
                          <small className="fw-bold" style={{ color: getStrengthColor() }}>{getStrengthText()}</small>
                        </div>
                        <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                          <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{ 
                              width: `${passwordStrength * 20}%`,
                              backgroundColor: getStrengthColor(),
                              transition: 'width 0.3s ease'
                            }} 
                            aria-valuenow={passwordStrength * 20} 
                            aria-valuemin="0" 
                            aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-4 position-relative">
                    <label htmlFor="confirmPassword" className="form-label fw-medium">Confirm Password</label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light">
                        <FontAwesomeIcon icon={faLock} className="text-primary" />
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={`form-control py-2 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm your password"
                        style={{ borderRadius: '0', fontSize: '16px' }}
                      />
                      <button
                        className="input-group-text bg-light"
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        style={{ cursor: 'pointer', borderRadius: '0 8px 8px 0' }}
                      >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
                  </div>

                  <div className="d-grid mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg" 
                      style={{
                        background: 'linear-gradient(135deg,rgb(119, 0, 247) 0%, #2575fc 100%)',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        borderRadius: '12px',
                        padding: '14px',
                        fontWeight: '600',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                  
                  <div className="position-relative my-4">
                    <hr className="my-4" />
                    <div className="position-absolute top-50 start-50 translate-middle bg-white px-3">
                      <p className="mb-0 text-muted">or continue with</p>
                    </div>
                  </div>
                  
                  {/* Social Login Buttons */}
                  <div className="d-flex justify-content-center gap-3 mb-4">
                    <button 
                      type="button" 
                      onClick={() => handleSocialLogin('facebook')}
                      className="btn btn-outline-primary social-btn"
                      style={{
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        transition: 'all 0.3s ease',
                        backgroundColor: '#f8f9fa',
                        borderColor: '#dee2e6'
                      }}
                    >
                      <FontAwesomeIcon icon={fabFacebookF} style={{ color: '#3b5998' }} />
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={() => handleSocialLogin('google')}
                      className="btn btn-outline-danger social-btn"
                      style={{
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        transition: 'all 0.3s ease',
                        backgroundColor: '#f8f9fa',
                        borderColor: '#dee2e6'
                      }}
                    >
                      <FontAwesomeIcon icon={fabGoogle} style={{ color: '#db4437' }} />
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary fw-medium text-decoration-none">
                        Log in
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="text-center mt-3">
              <small className="text-muted">By signing up, you agree to our Terms and Privacy Policy</small>
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
        
        .signup-icon {
          background: rgba(106, 17, 203, 0.1);
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 4px 15px rgba(106, 17, 203, 0.2);
        }
      `}</style>
    </div>
  );
}

export default SignUp;