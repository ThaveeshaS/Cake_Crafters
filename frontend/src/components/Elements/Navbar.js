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
    setTimeout(() => setIsClicked(false), 200); // Reset animation after 200ms
    setTimeout(() => setShowPopup(false), 6000); // Hide popup after 6s to allow more time for transcript
  };

  return (
    <nav className="navbar-container">
      <style>
        {`
          :root {
            --primary-color: #6c5ce7;
            --primary-light: #a29bfe;
            --text-color: #2d3436;
            --light-color: #f8f9fa;
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
            animation: pulseClick 0.2s ease;
          }
          
          .voice-nav-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid var(--primary-color);
            border-radius: 10px;
            padding: 2rem;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
            z-index: 2000;
            width: 999px;
            max-width: 90vw;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: popupFadeIn 0.9s ease;
          }
          
          .voice-nav-popup .popup-content {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            align-items: center;
            text-align: center;
            width: 100%;
            max-width: 100%;
          }
          
          .voice-nav-popup p {
            margin: 0;
            font-size: 1.2rem;
            color: var(--text-color);
            font-weight: 500;
            white-space: normal;
            word-wrap: break-word;
          }
          
          .voice-nav-popup strong {
            color: var(--primary-color);
            font-weight: 700;
          }
          
          .soundwave {
            display: flex;
            gap: 0.5rem;
            height: 30px;
            align-items: center;
          }
          
          .soundwave-bar {
            width: 6px;
            height: 100%;
            background: var(--primary-color);
            border-radius: 3px;
            animation: soundwave 0.8s ease-in-out infinite;
          }
          
          .soundwave-bar:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .soundwave-bar:nth-child(3) {
            animation-delay: 0.4s;
          }
          
          .soundwave-bar:nth-child(4) {
            animation-delay: 0.6s;
          }
          
          .transcript-text {
            font-size: 1rem;
            color: var(--text-color);
            font-weight: 400;
            white-space: normal;
            max-width: 100%;
            word-wrap: break-word;
            padding: 0.5rem;
            background: var(--light-color);
            border-radius: 5px;
          }
          
          @keyframes soundwave {
            0% {
              transform: scaleY(0.3);
            }
            50% {
              transform: scaleY(1);
            }
            100% {
              transform: scaleY(0.3);
            }
          }
          
          @keyframes pulseClick {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
          
          @keyframes popupFadeIn {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8);
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
              width: 300px;
              padding: 1.5rem;
            }
            
            .voice-nav-popup .popup-content {
              gap: 1.5rem;
            }
            
            .voice-nav-popup p {
              font-size: 1rem;
              white-space: normal;
            }
            
            .soundwave {
              height: 20px;
              gap: 0.3rem;
            }
            
            .soundwave-bar {
              width: 4px;
            }
            
            .transcript-text {
              font-size: 0.9rem;
              padding: 0.3rem;
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
          adem
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
              {({ handleVoiceCommand, isListening, transcript }) => (
                <div style={{ position: 'relative' }}>
                  <button 
                    className={`nav-button ${isClicked ? 'clicked' : ''} ${isListening ? 'active' : ''}`}
                    onClick={() => handleButtonClick(handleVoiceCommand)}
                  >
                    <i className="bi bi-mic"></i>
                  </button>
                  {showPopup && (
                    <div className="voice-nav-popup">
                      <div className="popup-content">
                        <p>Say: <strong>"I want to navigate [page name] page"</strong></p>
                        <p>E.g., "home", "createpost", "cakerecipes", "decorationtips", "cakesforevents", "createdecorationtips", "createrecipe", "createcakesforevent"</p>
                        {isListening && (
                          <div className="soundwave">
                            <div className="soundwave-bar"></div>
                            <div className="soundwave-bar"></div>
                            <div className="soundwave-bar"></div>
                            <div className="soundwave-bar"></div>
                          </div>
                        )}
                        <p className="transcript-text">
                          {isListening ? 'Listening...' : transcript ? `Heard: "${transcript}"` : 'Say something...'}
                        </p>
                      </div>
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