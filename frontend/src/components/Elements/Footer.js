import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import "bootstrap-icons/font/bootstrap-icons.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-white" style={{ paddingTop: '20px', paddingBottom: '10px', minHeight: '100px', background: 'linear-gradient(135deg,rgba(111, 69, 226, 0.81) 0%,rgba(95, 180, 245, 0.86) 100%)'}}>
      <div className="container h-100">
        <div className="row justify-content-center h-100">
          
          <div className="col-md-8 col-lg-6 text-center d-flex flex-column justify-content-center">
            <div className="d-flex flex-column align-items-center" style={{ gap: '12px' }}>
              <h3 className="mb-2">Cake Crafters</h3> 
              <p className="px-3 mb-2">
                Our CakeCrafters system lets you easily browse, customize, and order delicious cakes for any occasion, with options for dietary needs and hassle-free delivery.
              </p>
              <form className="d-flex justify-content-center w-100">
                <div className="input-group" style={{ maxWidth: '400px' }}>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your e-mail"
                    aria-label="Enter your e-mail"
                  />
                  <button className="btn btn-primary" type="button"
                  style={{
                    background: 'linear-gradient(45deg,rgba(181, 49, 204, 0.72),rgba(128, 70, 228, 0.77))',
                    border: 'none',
                    color: 'white'
                  }}>
                    Join our community
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

        <hr className="my-3" /> 
        
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-2">© 2025 Cake Crafters.</p> 
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
