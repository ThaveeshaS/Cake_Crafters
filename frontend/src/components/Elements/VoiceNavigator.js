import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const VoiceNavigator = () => {
  const [show, setShow] = useState(false);
  const [transcript, setTranscript] = useState('');
  const navigate = useNavigate();

  const handleVoiceCommand = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setTranscript(voiceText);

      // Extract page name
      const match = voiceText.match(/navigate (.+?) page/i);
      if (match && match[1]) {
        const page = match[1].toLowerCase().trim().replace(/\s+/g, '');
        const routes = {
          home: '/',
          createpost: '/create',
          cakerecipes: '/displaycakerecipe',
          decorationtips: '/decorationtips',
          cakesforevents: '/cakesforevents',
        };

        if (routes[page]) {
          navigate(routes[page]);
        } else {
          alert('Page not found: ' + page);
        }
      }
    };

    recognition.onerror = (e) => {
      alert('Voice recognition error: ' + e.error);
    };
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Activate Voice Navigator
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Voice Navigator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Say: <strong>"I want to navigate [page name] page"</strong></p>
          <Button variant="success" onClick={handleVoiceCommand}>
            🎤 Start Listening
          </Button>
          <p className="mt-3"><strong>Heard:</strong> {transcript}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default VoiceNavigator;
