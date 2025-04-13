import React from 'react';
import { Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import "bootstrap-icons/font/bootstrap-icons.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="d-flex justify-content-between flex-wrap">
          
          <div className="col-md-4 mb-4">
            <h3>Cake Crafters</h3>
            <p>Our CakeCrafters system lets you easily browse, customize, and order delicious cakes for any occasion, with options for dietary needs and hassle-free delivery.</p>
            <form>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your e-mail"
                  aria-label="Enter your e-mail"
                />
                <button className="btn btn-primary" type="button">
                  Join our community
                </button>
              </div>
            </form>
          </div>

          {/* Right Side Content */}
          <div className="d-flex justify-content-end flex-wrap col-md-8">
            
            {/* Quick Links */}
            <div className="col-md-3 mb-4">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-white text-decoration-none">Home</Link></li>
                <li><Link to="#" className="text-white text-decoration-none">Product</Link></li>
                <li><Link to="/aboutus" className="text-white text-decoration-none">About us</Link></li>
                <li><Link to="/contactus" className="text-white text-decoration-none">Contact us</Link></li>
              </ul>
              <Link to="/customerfeedback" className="text-white text-decoration-none">
                <h5>Customer Feedback</h5>
              </Link>
            </div>

            {/* Policies */}
            <div className="col-md-3 mb-4">
              <h5>Policies</h5>
              <ul className="list-unstyled">
                <li><Link to="/TermsAndConditions" className="text-white text-decoration-none">Terms and conditions</Link></li>
                <li><Link to="/PrivacyPolicy" className="text-white text-decoration-none">Privacy policy</Link></li>
              </ul>
            </div>

            {/* Help & Support & Follow Us */}
            <div className="col-md-3 mb-4">
              <h5>Help & Support</h5>
              <ul className="list-unstyled">
                <li><Link to="/Help" className="text-white text-decoration-none">Help</Link></li>
                <li><Link to="/Tips" className="text-white text-decoration-none">Tips</Link></li>
                <li><Link to="/CustomerService" className="text-white text-decoration-none">Customer service</Link></li>
              </ul>

              <h5>Follow Us</h5>
              <div className="d-flex">
                <a href="#" className="text-white me-3 fs-4"><i className="bi bi-google"></i></a>
                <a href="#" className="text-white me-3 fs-4"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-white me-3 fs-4"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-white fs-4"><i className="bi bi-whatsapp"></i></a>
              </div>
            </div>

          </div>
        </div>

        {/* Copyright Section */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <p className="mb-0">© 2025 Cake Crafters.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
