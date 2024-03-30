import React, { useEffect, useState } from "react";
import { getImages } from "../../utils/indexDB";
import "./Recommendations.scss";
import { getJson } from "../../utils/getJson";
import { useNavigate } from "react-router-dom";
const Recommendations = ({ style, response }) => {
  const navigate = useNavigate();
  // console.log("recommendation page: ", typeof response, response);
  const outfits = getJson(response); // Parse JSON string using getJson function
  const [images, setImages] = useState([]);
  console.log("logging the gpt response on recommendation", outfits);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storedImages = await getImages();
        console.log("Stored images:", storedImages); // Check what is being returned
        setImages(storedImages || []);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  // find the src of images stored in indexDB
  const getImageSrc = (imageId) => {
    const image = images.find((img) => img.id === imageId);
    console.log("the id of the chosen image is", imageId);
    return image ? image.url : "";
  };

  if (images.length === 0 || !response || response.length === 0) {
    return <div className="outfit__loading">Loading...</div>;
  } else if (response.length > 0 && !outfits) {
    return (
      <div className="outfit-heading">
        <h1>Opps, GPT4 says {response}</h1>
        <button onClick={() => navigate(-1)}>Try Agian</button>
      </div>
    );
  } else {
    return (
      <div className="recommendations">
        <h1 className="outfit-heading">
          Here are some outfit ideas to look {style.toLowerCase()}:
        </h1>
        <div className="outfit-gallery">
          {outfits.map((outfit) => (
            <div key={outfit.outfit_id} className="outfit-card">
              <h3>Outfit {outfit.outfit_id}</h3>
              <div className="outfit-card__images">
                {Object.entries(outfit.clothes).map(([index, id]) => (
                  <img
                    className="outfit-card__image"
                    key={id}
                    src={getImageSrc(id)}
                    alt={id}
                  />
                ))}
              </div>
              <p>Score: {outfit.score}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default Recommendations;
