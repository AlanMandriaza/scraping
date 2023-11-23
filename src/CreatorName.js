import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

function CreatorName({ creatorId }) {
  const [creatorData, setCreatorData] = useState({ name: "", profilePicUrl: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/getCreatorName/${creatorId}`)
      .then((response) => {
        setCreatorData({
          name: response.data.name,
          profilePicUrl: response.data.profilePicUrl
        });
      })
      .catch((error) => {
        console.error("Error al obtener la información del creador:", error);
        setCreatorData({ name: "Error", profilePicUrl: "" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [creatorId]);

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <h1>{creatorData.name}</h1>
          {creatorData.profilePicUrl && (
            <>
              <img src={creatorData.profilePicUrl} alt="Foto de perfil del creador" />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default CreatorName;
