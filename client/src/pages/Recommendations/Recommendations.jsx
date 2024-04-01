import React, { useEffect, useState } from "react";
import {
  getImages,
  clearImages,
  hasImages,
  saveFavoriteOutfit,
  removeFavoriteOutfit,
} from "../../utils/indexDB";
import "./Recommendations.scss";
import { getJson } from "../../utils/getJson";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";

const Recommendations = ({ response, setResponse, style }) => {
  const [filled, setFilled] = useState(false);
  const [error, setError] = useState("");
  // toggle heart when user clicks, and save or remove outfit in IndexDB database
  const toggleHeart = async (outfit) => {
    const newFilledState = !filled;
    setFilled(newFilledState);
    // Reconstruct outfit to include image paths
    // const favOutfit = {
    //   ...outfit,
    //   iamgePaths: Object.entries(outfit.clothes).map((outfit_id) => ({
    //     outfit_id,
    //     imagePath: getImageSrc(outfit_id),
    //   })),
    // };
    if (newFilledState) {
      try {
        console.log("Attempt to save image to db");
        await saveFavoriteOutfit(outfit);
        setError("");
      } catch (error) {
        console.error("Failed to save your favorite outfit", error);
        setError("Failed to save your favorite outfit");
      }
    } else {
      try {
        console.log("Attempt to remove image from db");
        await removeFavoriteOutfit(outfit.outfit_id);
        setError("");
      } catch (error) {
        console.error("Failed to remove your favorite outfit", error);
        setError("Failed to remove your favorite outfit, please try again");
      }
    }
  };

  const navigate = useNavigate();
  const outfits = getJson(response); // Parse JSON string using getJson function
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storedImages = await getImages();
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
    // console.log("the id of the chosen image is", imageId);
    return image ? image.url : "";
  };

  if (images.length === 0 || !response || response.length === 0) {
    // case1: no response from api
    return <div className="outfit__loading">Loading...</div>;
  } else if (!outfits || outfits.length === 0) {
    // case2: there are response, but gpt failed to answer the request, outfits in null
    return (
      <div className="recommendations">
        <h1 className="outfit__heading">
          Opps, our AI Advisor just sloped away
        </h1>
        <p className="outfit__error-text">{response}</p>
        <button className="primary__btn" onClick={() => navigate(-1)}>
          Try Agian
        </button>
      </div>
    );
  } else {
    // case3: success request, outfits json data retrieved
    return (
      <div className="recommendations">
        <h1 className="outfit-heading">
          Here are some outfit ideas to look {style.toLowerCase()}:
        </h1>
        <div className="error">{error.length > 0 && error}</div>
        <div className="outfit-gallery">
          {outfits.map((outfit) => (
            <div key={outfit.outfit_id} className="outfit-card">
              <div className="outfit-card__header">
                <h2 className="outfit-card__text outfit-card__heading">
                  Outfit {outfit.outfit_id}
                </h2>
                <div onClick={() => toggleHeart(outfit)}>
                  <FontAwesomeIcon
                    className="icon"
                    icon={filled ? fasHeart : farHeart}
                    style={{ color: filled ? "pink" : "black" }}
                  />
                </div>
              </div>
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
              <p className="outfit-card__text">Score: {outfit.score}</p>
              <p className="outfit-card__text">{outfit.considerations}</p>
            </div>
          ))}
        </div>
        <button className="primary__btn" onClick={() => navigate(-1)}>
          Try New Looks
        </button>
      </div>
    );
  }
};

export default Recommendations;
