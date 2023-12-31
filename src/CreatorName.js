import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

function CreatorName({ creatorId }) {
  const [creatorData, setCreatorData] = useState({
    name: "",
    profilePicUrl: "",
    additionalInfo: "",
    subscriptionPrice: "",
    totalElement: "",
  });
  const [loading, setLoading] = useState(true);
  const [showBio, setShowBio] = useState(false);

  useEffect(() => {
    // Esta solicitud obtiene datos del servidor Express definido en amazon.js
    axios.get(`http://localhost:5001/getCreatorData/${creatorId}`)
      .then((response) => {
        setCreatorData({
          name: response.data.name,
          profilePicUrl: response.data.profilePicUrl,
          additionalInfo: response.data.additionalInfo,
          subscriptionPrice: response.data.subscriptionPrice,
          totalElement: response.data.totalElement,
        });
      })
      .catch((error) => {
        console.error("Error al obtener la información del creador:", error);
        // Manejo de errores en caso de fallo en la solicitud
        setCreatorData({
          name: "Error",
          profilePicUrl: "",
          additionalInfo: "",
          subscriptionPrice: "",
          totalElement: "",
        });
      })
      .finally(() => {
        setLoading(false); // Finalizar el estado de carga
      });
  }, [creatorId]); // La dependencia es creatorId

  const handleBioToggle = () => {
    setShowBio(!showBio); // Alternar la visibilidad de la biografía
  };

  return (
    <div className="card" style={{ width: '18rem' }}>
      <div className="card-body">
        {loading ? (
          <p className="card-text">Cargando...</p>
        ) : (
          <>
            <h4 className="card-title">{creatorData.name}</h4>
            {creatorData.profilePicUrl && (
              <img src={creatorData.profilePicUrl} alt="Foto de perfil del creador" className="card-img-top" />
            )}
            {showBio && creatorData.additionalInfo && (
              <p className="card-text">{creatorData.additionalInfo}</p>
            )}
            <p className="card-text">Elementos totales: {creatorData.totalElement}</p>
            <button className="button" onClick={handleBioToggle}>
              {showBio ? 'Ocultar Biografía' : 'Mostrar Biografía'}
            </button>
            <button className="button">
              Suscríbete por {creatorData.subscriptionPrice}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CreatorName;
