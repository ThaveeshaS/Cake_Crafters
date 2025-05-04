import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import VoiceNavigator from './VoiceNavigator';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Navbar() {
  const location = useLocation();
  const [isClicked, setIsClicked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleButtonClick = (startVoiceRecognition) => {
    setIsClicked(true);
    setShowPopup(true);
    startVoiceRecognition();
    setTimeout(() => setIsClicked(false), 200);
    setTimeout(() => setShowPopup(false), 8000); // Increased timeout for better UX
  };

  return (
    <nav className="navbar-container">
      <style>
        {`
          :root {
            --primary-color: #6c5ce7;
            --primary-light: #a29bfe;
            --primary-dark: #5649c0;
            --text-color: #2d3436;
            --light-color: #f8f9fa;
            --success-color: #00b894;
            --error-color: #d63031;
          }
          
          .navbar-container {
            background: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 1000;
          }
          
          .navbar-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
          }
          
          .nav-list {
            display: flex;
            justify-content: center;
            align-items: center;
            list-style: none;
            padding: 0;
            margin: 0;
            gap: 2rem;
          }
          
          .nav-item {
            position: relative;
          }
          
          .nav-link {
            color: var(--text-color);
            text-decoration: none;
            font-weight: 500;
            font-size: 1.1rem;
            padding: 0.5rem 0;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .nav-link:hover {
            color: var(--primary-color);
          }
          
          .nav-link.active {
            color: var(--primary-color);
            font-weight: 600;
          }
          
          .nav-link.active:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: var(--primary-color);
            border-radius: 3px;
          }
          
          .nav-button {
            background: none;
            border: none;
            color: var(--text-color);
            font-weight: 500;
            font-size: 1.1rem;
            padding: 0.5rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.3rem;
            cursor: pointer;
            position: relative;
          }
          
          .nav-button:hover {
            color: var(--primary-color);
          }
          
          .nav-button.active {
            color: var(--primary-color);
            font-weight: 600;
          }

          .nav-button.active:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: var(--primary-color);
            border-radius: 3px;
          }
          
          .nav-button.clicked {
            animation: pulseClick 0.3s ease;
          }
          
          /* Enhanced Voice Popup Styles */
          .voice-nav-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 16px;
            padding: 2.5rem;
            box-shadow: 0 12px 24px rgba(108, 92, 231, 0.2);
            z-index: 2000;
            width: 600px;
            max-width: 90vw;
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: popupFadeIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid rgba(108, 92, 231, 0.1);
            overflow: hidden;
          }
          
          .voice-nav-popup::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
          }
          
          .popup-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }
          
          .popup-header i {
            font-size: 1.8rem;
            color: var(--primary-color);
          }
          
          .popup-title {
            font-size: 1.4rem;
            font-weight: 600;
            color: var(--text-color);
            margin: 0;
          }
          
          .popup-instructions {
            background: var(--light-color);
            border-radius: 12px;
            padding: 1.5rem;
            width: 100%;
            margin-bottom: 2rem;
            text-align: center;
          }
          
          .instruction-title {
            font-size: 1.1rem;
            font-weight: 500;
            color: var(--text-color);
            margin-bottom: 0.5rem;
          }
          
          .command-examples {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1rem;
          }
          
          .command-chip {
            background: white;
            border: 1px solid var(--primary-light);
            border-radius: 20px;
            padding: 0.4rem 0.8rem;
            font-size: 0.85rem;
            color: var(--primary-dark);
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(108, 92, 231, 0.1);
          }
          
          .voice-feedback {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }
          
          .soundwave-container {
            position: relative;
            width: 120px;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .soundwave {
            display: flex;
            gap: 0.5rem;
            height: 40px;
            align-items: flex-end;
          }
          
          .soundwave-bar {
            width: 8px;
            height: 10px;
            background: linear-gradient(to top, var(--primary-color), var(--primary-light));
            border-radius: 4px;
            animation: soundwave 1.2s ease-in-out infinite;
          }
          
          .soundwave-bar:nth-child(1) {
            animation-delay: 0.1s;
            height: 15px;
          }
          
          .soundwave-bar:nth-child(2) {
            animation-delay: 0.3s;
            height: 25px;
          }
          
          .soundwave-bar:nth-child(3) {
            animation-delay: 0.5s;
            height: 35px;
          }
          
          .soundwave-bar:nth-child(4) {
            animation-delay: 0.7s;
            height: 25px;
          }
          
          .soundwave-bar:nth-child(5) {
            animation-delay: 0.9s;
            height: 15px;
          }
          
          .transcript-container {
            width: 100%;
            background: var(--light-color);
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
          }
          
          .transcript-label {
            font-size: 0.9rem;
            color: var(--text-color);
            opacity: 0.7;
            margin-bottom: 0.5rem;
            display: block;
          }
          
          .transcript-text {
            font-size: 1.2rem;
            color: var(--text-color);
            font-weight: 500;
            margin: 0;
            min-height: 1.5em;
          }
          
          .transcript-text.recognized {
            color: var(--success-color);
            font-weight: 600;
          }
          
          .transcript-text.error {
            color: var(--error-color);
          }
          
          .popup-footer {
            margin-top: 1.5rem;
            font-size: 0.85rem;
            color: var(--text-color);
            opacity: 0.7;
            text-align: center;
          }
          
          .close-button {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.2rem;
            color: var(--text-color);
            opacity: 0.5;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .close-button:hover {
            opacity: 1;
            color: var(--error-color);
          }
          
          @keyframes soundwave {
            0%, 100% {
              height: 10px;
            }
            50% {
              height: 40px;
            }
          }
          
          @keyframes pulseClick {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.3);
            }
            100% {
              transform: scale(1);
            }
          }
          
          @keyframes popupFadeIn {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
          
          @media (max-width: 768px) {
            .nav-list {
              gap: 1rem;
            }
            
            .nav-link, .nav-button {
              font-size: 1rem;
              padding: 0.5rem;
            }
            
            .voice-nav-popup {
              padding: 1.5rem;
              width: 90%;
            }
            
            .popup-header {
              flex-direction: column;
              text-align: center;
              gap: 0.5rem;
            }
            
            .popup-title {
              font-size: 1.2rem;
            }
            
            .popup-instructions {
              padding: 1rem;
            }
            
            .instruction-title {
              font-size: 1rem;
            }
            
            .command-chip {
              font-size: 0.75rem;
              padding: 0.3rem 0.6rem;
            }
            
            .soundwave-container {
              width: 100px;
              height: 50px;
            }
            
            .soundwave-bar {
              width: 6px;
            }
            
            .transcript-container {
              padding: 1rem;
            }
            
            .transcript-text {
              font-size: 1rem;
            }
          }
        `}
      </style>

      <div className="navbar-content">
        <ul className="nav-list">
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`}
              to="/create">
              Create Post
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/displaycakerecipe' ? 'active' : ''}`}
              to="/displaycakerecipe">
              Cake Recipes
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/decorationtips' ? 'active' : ''}`}
              to="/decorationtips">
              Decoration Tips
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${location.pathname === '/cakesforevents' ? 'active' : ''}`}
              to="/cakesforevents">
              Cakes for Events
            </Link>
          </li>
          <li className="nav-item">
            <VoiceNavigator>
              {({ handleVoiceCommand, isListening, transcript, isRecognized, error }) => (
                <div style={{ position: 'relative' }}>
                  <button 
                    className={`nav-button ${isClicked ? 'clicked' : ''} ${isListening ? 'active' : ''}`}
                    onClick={() => handleButtonClick(handleVoiceCommand)}
                    aria-label="Voice navigation"
                  >
                    <i className="bi bi-mic"></i>
                  </button>
                  {showPopup && (
                    <div className="voice-nav-popup">
                      <button 
                        className="close-button" 
                        onClick={() => setShowPopup(false)}
                        aria-label="Close voice navigation"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                      
                      <div className="popup-header">
                        <i className="bi bi-mic-fill"></i>
                        <h3 className="popup-title">Voice Navigation</h3>
                      </div>
                      
                      <p>I want to navigate [page neme] page</p>

                      <div className="popup-instructions">
                        <p className="instruction-title">Try saying commands like:</p>
                        <div className="command-examples">
                          <span className="command-chip">Home</span>
                          <span className="command-chip">Create Post</span>
                          <span className="command-chip">Cake Recipes</span>
                          <span className="command-chip">Create Recipe</span>
                          <span className="command-chip">Decoration Tips</span>
                          <span className="command-chip">Create Decoration Tips</span>
                          <span className="command-chip">Cakes For Events</span>
                          <span className="command-chip">Create Cakes For Event</span>
                        </div>
                      </div>
           
                      <div className="voice-feedback">
                        <div className="soundwave-container">
                          {isListening ? (
                            <div className="soundwave">
                              <div className="soundwave-bar"></div>
                              <div className="soundwave-bar"></div>
                              <div className="soundwave-bar"></div>
                              <div className="soundwave-bar"></div>
                              <div className="soundwave-bar"></div>
                            </div>
                          ) : (
                            <i className="bi bi-mic-mute" style={{ fontSize: '2rem', color: '#ccc' }}></i>
                          )}
                        </div>
                        
                        <div className="transcript-container">
                          <span className="transcript-label">
                            {isListening ? 'Listening...' : 'Waiting for command...'}
                          </span>
                          <p className={`transcript-text ${isRecognized ? 'recognized' : ''} ${error ? 'error' : ''}`}>
                            {error ? `Error: ${error}` : transcript || (isListening ? 'Speak now...' : '')}
                          </p>
                        </div>
                      </div>
                      
                      <p className="popup-footer">
                        The popup will close automatically after 8 seconds or click the X to close now.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </VoiceNavigator>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;