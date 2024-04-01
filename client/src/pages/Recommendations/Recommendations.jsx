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
const Recommendations = ({ style }) => {
  const response =
    "I'll analyze the images provided and create elegant outfits suitable for a 25 to 30-year-old female. For each outfit, I'll give them an identifier, describe the pieces, and score them based on how well they match the Elegant attire style.\n" +
    "\n" +
    "---\n" +
    "\n" +
    "**Outfit 1:**\n" +
    "- Cream trousers - A sophisticated pair of cream-colored trousers with a tailored fit, ideal for elegant attire. (Clothes ID: 0)\n" +
    "- Striped shirt - A chic, short-sleeved shirt with black stripes on a white background, combining casual with refined. (Clothes ID: 2)\n" +
    "- Trench coat - A classic beige trench coat to overlay, providing both style and comfort. (Clothes ID: 3)\n" +
    "\n" +
    "**Score:** 9\n" +
    "**Considerations:** This outfit strikes a balance between smart and stylish, suitable for a variety of elegant occasions, though the striped shirt adds a hint of casual flair that may not fit the most formal settings.\n" +
    "\n" +
    "```json\n" +
    "[\n" +
    "  {\n" +
    '    "outfit_id": 1,\n' +
    '    "clothes": ["image0", "image2", "image3"],\n' +
    '    "score": 9,\n' +
    '    "considerations": "The outfit is suitable for elegant settings but maintains a touch of casual style with the striped shirt. The beige trench coat elevates the overall look."\n' +
    "  }\n" +
    "]\n" +
    "```\n" +
    "\n" +
    "---\n" +
    "\n" +
    "**Outfit 2:**\n" +
    "- Green trousers - Elegant, olive-green trousers offer a gracefully understated base for the outfit. (Clothes ID: 1)\n" +
    "- Black blouse - A long-sleeved black blouse with a v-neckline, providing a sleek and versatile top. (Clothes ID: 4)\n" +
    "\n" +
    "**Score:** 8\n" +
    "**Considerations:** The combination of olive-green and black presents a polished look that’s perfect for an elegant setting. However, the lack of additional outerwear might reduce its suitability for certain environments or weather conditions.\n" +
    "\n" +
    "```json\n" +
    "[\n" +
    "  {\n" +
    '    "outfit_id": 2,\n' +
    '    "clothes": ["image1", "image4"],\n' +
    '    "score": 8,\n' +
    '    "considerations": "A refined pairing of green trousers and a black blouse exudes elegance, though additional layering could provide more versatility."\n' +
    "  }\n" +
    "]\n" +
    "```\n" +
    "\n" +
    "---\n" +
    "\n" +
    "The above outfits have been curated from the images provided and should serve as elegant attire for a young professional female. Please note that the scores are subjective and could vary based on individual taste and the specifics of the occasion.";

  const [filled, setFilled] = useState(false);
  const [error, setError] = useState("");
  // toggle heart when user clicks, and save or remove outfit in IndexDB database
  const toggleHeart = async (outfit) => {
    const newFilledState = !filled;
    setFilled(newFilledState);
    // Reconstruct outfit to include image paths
    const favOutfit = {
      ...outfit,
      iamgePaths: Object.entries(outfit.clothes).map((id) => ({
        id,
        imagePath: getImageSrc(id),
      })),
    };
    if (newFilledState) {
      try {
        console.log("attempt to save image to db");
        const saved = await saveFavoriteOutfit(favOutfit);
        setError("");
      } catch (error) {
        setError("Failed to save your favoriate outfit", error);
      }
    } else {
      try {
        console.log("attempt to remove image from db");
        const remove = removeFavoriteOutfit(favOutfit.id);
        setError("");
      } catch (error) {
        setError("Failed to r your favoriate outfit, please try again", error);
      }
    }
  };

  const navigate = useNavigate();
  const outfits = getJson(response); // Parse JSON string using getJson function
  const [images, setImages] = useState([]);
  console.log("logging the gpt response on recommendation", outfits);
  console.log("logging the outfits", outfits);
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
    // console.log("the id of the chosen image is", imageId);
    return image ? image.url : "";
  };

  if (images.length === 0 || !response || response.length === 0) {
    // case1: no response from api
    return <div className="outfit__loading">Loading...</div>;
  } else if (!outfits) {
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
        <div>{error.length > 0 && error}</div>
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
        <button className="primary__btn">Try New Looks</button>
      </div>
    );
  }
};

export default Recommendations;
