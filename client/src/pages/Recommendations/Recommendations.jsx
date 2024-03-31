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
import { faV, faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
const Recommendations = ({ style, response }) => {
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
  // console.log("recommendation page: ", typeof response, response);
  response =
    response ||
    "Based on the images provided, I can compile a single outfit that aligns with an Elegant style for a 25 to 40-year-old female. Since there is only one piece per clothing item type, there will be one outfit. Here's the outfit breakdown:\n" +
      "\n" +
      "[{\n" +
      '"outfit_id":0,\n' +
      '"clothes":["image1","image2","image3","image4"],\n' +
      '"score":8,\n' +
      '"considerations":"The outfit consists of classic black shoes, which are a timeless element of elegant fashion. The wide-legged denim trousers offer a contemporary twist that can still fit within sophisticated attire if styled correctly. The white shirt provides a crisp and clean look that is versatile for elegant styling. Lastly, the trench coat adds a refined and polished finish to the ensemble, contributing to the overall elegance. The combination is cohesive and modern while adhering to the principles of elegant style, hence the score of 8. The only point of contention that prevents a full score is the casual nature of the denim, which is not always associated with high elegance but can be elevated with the right accessories and shoes."\n' +
      "}]";
  const outfits = getJson(response); // Parse JSON string using getJson function
  const [images, setImages] = useState([]);
  // console.log("logging the gpt response on recommendation", outfits);

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
  const reTry = async () => {
    const clearDB = await clearImages();
    navigate(-1);
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
        <button className="primary__btn" onClick={reTry}>
          Try New Looks
        </button>
      </div>
    );
  }
};

export default Recommendations;
