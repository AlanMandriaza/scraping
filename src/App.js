import React, { useState, useEffect } from 'react';
import CreatorName from './CreatorName';
import axios from 'axios';

function App() {
  const [creatorIds, setCreatorIds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reemplace 'http://localhost:5000/getCreatorIds' con la URL de su servidor Express
    const fetchCreatorIds = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getCreatorIds');
        setCreatorIds(response.data.creatorIds);
        setError(null); // Limpiar cualquier error anterior
      } catch (error) {
        console.error('Error fetching creator IDs:', error);
        setError('Error fetching creator IDs'); // Establecer el error
      }
    };

    fetchCreatorIds();
  }, []);

  return (
    <div className="App d-flex flex-wrap justify-content-center">
      {error ? (
        <div className="alert alert-danger">
          {error}
        </div>
      ) : (
        creatorIds.map(id => (
          <CreatorName key={id} creatorId={id} />
        ))
      )}
    </div>
  );
}

export default App;
