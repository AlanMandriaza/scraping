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
  const [showBio, setShowBio] = useState(false);

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

  const extractSubscriptionPrice = (subscriptionText) => {
    const regex = /\$\d+(\.\d{2})?/;
    const match = subscriptionText.match(regex);

    if (match) {
      return match[0];
    } else if (subscriptionText.toLowerCase().includes('gratis')) {
      return 'Gratis';
    } else {
      return 'No disponible';
    }
  };
  const handleButtonClick = () => {
    if (creatorData.subscriptionPrice !== "No disponible") {
      const creatorUsername = creatorId.toLowerCase().replace(" ", "");
      window.open(`https://www.onlyfans.com/${creatorUsername}`, "_blank");
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
            {showBio && creatorData.additionalInfo && (
              <p className="card-text">{creatorData.additionalInfo}</p>
            )}
            <button className="button" onClick={() => setShowBio(!showBio)}>
              {showBio ? 'Ocultar Biografía' : 'Mostrar Biografía'}
            </button>
            <button
              className="button" // Utiliza la clase CSS personalizada
              onClick={handleButtonClick} // Maneja el clic del botón
            >
              Suscríbete por {creatorData.subscriptionPrice}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CreatorName;
