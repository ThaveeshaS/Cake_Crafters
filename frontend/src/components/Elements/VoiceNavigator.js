import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VoiceNavigator = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const navigate = useNavigate();

  const handleVoiceCommand = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    setIsListening(true);

    recognition.onstart = () => {
      setTranscript('Listening...');
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setTranscript(voiceText);
      setIsListening(false);

      // Extract page name
      const match = voiceText.match(/navigate (.+?) page/i);
      if (match && match[1]) {
        const page = match[1].toLowerCase().trim().replace(/\s+/g, '');
        const routes = {
          Home: '/',
          createpost: '/create',
          cakerecipes: '/displaycakerecipe',
          decorationtips: '/decorationtips',
          cakesforevents: '/cakesforevents',
          createdecorationtips: '/create-decoration-tips',
          createrecipe: '/addnewcakerecipe',
          createcakesforevent: '/create-user-project',
        };

        if (routes[page]) {
          navigate(routes[page]);
        } else {
          alert('Page not found: ' + page);
        }
      } else {
        alert('Please say: "I want to navigate [page name] page"');
      }
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      alert('Voice recognition error: ' + e.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return children({ handleVoiceCommand, isListening, transcript });
};

export default VoiceNavigator;