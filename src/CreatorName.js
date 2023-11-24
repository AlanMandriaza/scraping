import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

function CreatorName({ creatorId }) {
  const [creatorData, setCreatorData] = useState({ name: "", profilePicUrl: "", additionalInfo: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/getCreatorName/${creatorId}`)
      .then((response) => {
        setCreatorData({
          name: response.data.name,
          profilePicUrl: response.data.profilePicUrl,
          additionalInfo: response.data.additionalInfo // Agregar información adicional aquí
        });
      })
      .catch((error) => {
        console.error("Error al obtener la información del creador:", error);
        setCreatorData({ name: "Error", profilePicUrl: "", additionalInfo: "" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [creatorId]);

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
            {creatorData.additionalInfo && (
              <p className="card-text">{creatorData.additionalInfo}</p> // Mostrar la información adicional aquí
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CreatorName;
