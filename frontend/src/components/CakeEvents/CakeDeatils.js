import React, { useState, useEffect } from 'react';

function CakeDetails() {
  const [cakeEvents, setCakeEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCakeEvents = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/cake-events');
        if (!response.ok) {
          throw new Error('Failed to fetch cake events');
        }
        const data = await response.json();
        setCakeEvents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCakeEvents();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
      <h2>Cake Event Details</h2>
      {cakeEvents.length === 0 ? (
        <p>No cake events found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cakeEvents.map((event) => (
            <li key={event.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
              <p><strong>Event Type:</strong> {event.eventType}</p>
              <p><strong>Description:</strong> {event.description}</p>
              <p><strong>Cake Type:</strong> {event.cakeType}</p>
              {event.photoUrl && (
                <div>
                  <p><strong>Photo:</strong></p>
                  <img
                    src={event.photoUrl}
                    alt="Cake Event"
                    style={{ maxWidth: '100%', borderRadius: '4px', marginTop: '0.5rem' }}
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found')}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CakeDetails;