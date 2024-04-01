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
  const [favoriteStatus, setFavoriteStatus] = useState({}); // State to track favorites
  const [error, setError] = useState("");

  // Initialize favorite status from outfits
  useEffect(() => {
    const initialStatus = {};
    getJson(response).forEach((outfit) => {
      initialStatus[outfit.outfit_id] = false; // Default all to not favorite
    });
    setFavoriteStatus(initialStatus);
  }, [response]);

  setResponse(
    "The base64 strings provided are not decoded into images within this environment, but I'll address this as if I am able to analyze the images of clothing articles based on color, style, and texture and then combine them into elegant outfits for a 25 to 30-year-old female.\n" +
      "\n" +
      "Given that I cannot actually view these images, I will give a hypothetical scenario for the sake of providing an exemplar response that one would expect if the images were available.\n" +
      "\n" +
      "JSON Output:\n" +
      "\n" +
      "```json\n" +
      "[\n" +
      "  {\n" +
      '    "outfit_id": 0,\n' +
      '    "clothes": ["image0", "image2", "image3"],\n' +
      '    "score": 8,\n' +
      '    "considerations": "The first outfit features a classic striped top which adds a touch of playfulness. Paired with a sleek black blazer, the contrast in patterns brings a modern edge to the outfit, while maintaining an elegant silhouette. The addition of a tailored black waistcoat provides structure and creates a sophisticated layered look, perfect for a business casual setting."\n' +
      "  },\n" +
      "  {\n" +
      '    "outfit_id": 1,\n' +
      '    "clothes": ["image1", "image3"],\n' +
      '    "score": 7,\n' +
      `    "considerations": "In this second outfit, the textured black trousers are matched with a black blazer. This monochromatic pairing is timeless, and the texture differentiates each piece while also adding depth to the look. It's elegant in its simplicity, and would work well for an evening event."\n` +
      "  },\n" +
      "  {\n" +
      '    "outfit_id": 2,\n' +
      '    "clothes": ["image0", "image1"],\n' +
      '    "score": 6,\n' +
      '    "considerations": "The third outfit combines a striped top with textured trousers. This look is more casual but still retains elements of elegance through its monochrome color palette and the use of texture to add interest."\n' +
      "  },\n" +
      "  {\n" +
      '    "outfit_id": 3,\n' +
      '    "clothes": ["image2", "image3"],\n' +
      '    "score": 9,\n' +
      '    "considerations": "Outfit four is a classic combination of a black blazer and a waistcoat, presenting a very chic and professional style. The cohesive color choice emphasizes elegance, and the absence of a traditional shirt under the waistcoat adds a modern twist."\n' +
      "  },\n" +
      "  {\n" +
      '    "outfit_id": 4,\n' +
      '    "clothes": ["image0", "image2"],\n' +
      '    "score": 7,\n' +
      '    "considerations": "The final outfit pairs the striped top with the black waistcoat. The contrast of patterns and textures combined with the classic color scheme keeps this look elegant, yet easy to pull off for a day-to-day basis."\n' +
      "  }\n" +
      "]\n" +
      "```\n" +
      "\n" +
      "Please note this is a mock-up example. In reality, to accurately score the outfits and provide real considerations, one would need to see the actual clothing items to assess their style, color, and fabric texture, which are key in constructing outfits for an 'Elegant' style theme."
  );
  // toggle heart when user clicks, and save or remove outfit in IndexDB database
  const toggleHeart = async (outfit) => {
    const currentStatus = favoriteStatus[outfit.outfit_id];
    const newStatus = { ...favoriteStatus, [outfit.outfit_id]: !currentStatus };
    setFavoriteStatus(newStatus);

    if (!currentStatus) {
      try {
        console.log(outfit);
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
                    icon={
                      favoriteStatus[outfit.outfit_id] ? fasHeart : farHeart
                    }
                    style={{
                      color: favoriteStatus[outfit.outfit_id]
                        ? "pink"
                        : "black",
                    }}
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
