import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

function CreatorName({ creatorId }) {
  const [creatorData, setCreatorData] = useState({
    name: "",
    profilePicUrl: "",
    additionalInfo: "",
    subscriptionPrice: ""
  });
  const [loading, setLoading] = useState(true);
  const [showBio, setShowBio] = useState(false); // Estado para mostrar/ocultar la biografía

  useEffect(() => {
    axios.get(`http://localhost:5000/getCreatorName/${creatorId}`)
      .then((response) => {
        setCreatorData({
          name: response.data.name,
          profilePicUrl: response.data.profilePicUrl,
          additionalInfo: response.data.additionalInfo,
          subscriptionPrice: extractSubscriptionPrice(response.data.subscriptionPrice)
        });
      })
      .catch((error) => {
        console.error("Error al obtener la información del creador:", error);
        setCreatorData({
          name: "Error",
          profilePicUrl: "",
          additionalInfo: "",
          subscriptionPrice: ""
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [creatorId]);

  // Función para extraer el valor de la suscripción
  const extractSubscriptionPrice = (subscriptionText) => {
    const regex = /\$\d+(\.\d{2})?/; // Busca el formato $x.xx
    const match = subscriptionText.match(regex);

    if (match) {
      return match[0]; // Devuelve el valor encontrado
    } else if (subscriptionText.toLowerCase().includes('gratis')) {
      return 'Gratis'; // Si contiene "gratis", devuelve "Gratis"
    } else {
      return 'No disponible'; // Valor predeterminado si no se encuentra
    }
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
            <button className="button" onClick={() => setShowBio(!showBio)}>
              {showBio ? 'Ocultar Biografía' : 'Mostrar Biografía'}
            </button>
            {showBio && creatorData.additionalInfo && (
              <p className="card-text">{creatorData.additionalInfo}</p>
            )}
            
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
