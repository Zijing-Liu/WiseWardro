import React, { useEffect, useState } from "react";
import {
  getImages,
  storeFavImages,
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
  const [favoriteStatus, setFavoriteStatus] = useState({}); // State to track favorites
  const [error, setError] = useState("");
  // Initialize favorite status from outfits
  setResponse(
    "To provide the outfits as requested, I will analyze the images of the clothing items provided. Please note that the actual style match might vary depending on current fashion trends and individual tastes, but I will do my best to provide outfits that are casual and trendy for a 25 to 30-year-old female.\n" +
      "\n" +
      "After analyzing the images, here are the outfit combinations:\n" +
      "\n" +
      "```json\n" +
      "[\n" +
      "    {\n" +
      '        "outfit_id": 0,\n' +
      '        "clothes": ["image0", "image1", "image2"],\n' +
      '        "score": 8,\n' +
      '        "considerations": "The black vest paired with black printed trousers creates a coordinated look. The striped tee adds a casual element suitable for daywear, while maintaining an overall chic, monochrome palette."\n' +
      "    }\n" +
      "]\n" +
      "```\n" +
      "\n" +
      "The provided image0 is a black vest, image1 is a pair of black printed trousers, and image2 is a white and black striped tee. This outfit uses neutral colors for an effortless casual style, while the addition of a pattern with the trousers gives it an edge. The score reflects that the outfit is casual but has a touch of formality because of the vest, which might not be a staple in every casual wardrobe."
  );

  useEffect(() => {
    const initialStatus = {};
    getJson(response).forEach((outfit) => {
      initialStatus[outfit.outfit_id] = false; // Default all to not favorite
    });
    setFavoriteStatus(initialStatus);
  }, [response]);

  // toggle heart when user clicks, and save or remove outfit in IndexDB database
  const toggleHeart = async (favOutfit) => {
    const currentStatus = favoriteStatus[favOutfit.outfit_id];
    const newStatus = {
      ...favoriteStatus,
      [favOutfit.outfit_id]: !currentStatus,
    };
    setFavoriteStatus(newStatus);
    if (!currentStatus) {
      try {
        const imagefiles = favOutfit.clothes.map((imageID) =>
          getImageFile(imageID)
        );
        console.log("imagefiles", imagefiles);
        await storeFavImages(imagefiles);
        await saveFavoriteOutfit(favOutfit);
        setError("");
      } catch (error) {
        console.error("Failed to save your favorite outfit", error);
        setError("Failed to save your favorite outfit");
      }
    } else {
      try {
        console.log("Attempt to remove image from db");
        await removeFavoriteOutfit(favOutfit.outfit_id);
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
    return image ? URL.createObjectURL(image.blob) : "";
  };
  const getImageFile = (imageId) => {
    const image = images.find((img) => img.id === imageId);
    return image ? image : null;
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
                    icon={
                      favoriteStatus[outfit.outfit_id] ? fasHeart : farHeart
                    }
                    style={{
                      color: favoriteStatus[outfit.outfit_id]
                        ? "pink"
                        : "#5c667e",
                    }}
                  />
                </div>
              </div>
              <div className="outfit-card__images">
                {outfit.clothes.map((id) => (
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
