import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import {
  getFavoriteOutfits,
  saveFavoriteOutfit,
  removeFavoriteOutfit,
  getFavImages,
} from "../../utils/indexDB";
function MyOutfits() {
  const [outfits, setOutfits] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [favoriteStatus, setFavoriteStatus] = useState({}); // State to track favorites
  useEffect(() => {
    // get all outfits saved in the favorites store
    const fetchFavoriteOutfits = async () => {
      try {
        const favoriteOutfits = await getFavoriteOutfits();
        console.log("Retrieved favorite outfits:", favoriteOutfits);
        setOutfits(favoriteOutfits);
      } catch (error) {
        console.log("Failed to fetch favorite outfits:", error);
      }
    };

    const fetchFavImages = async () => {
      try {
        const favImages = await getFavImages();
        setImages(favImages);
      } catch (error) {
        console.log("Failed to fetch favorite images:", error);
      }
    };

    fetchFavoriteOutfits();
    fetchFavImages();
  }, []);

  useEffect(() => {
    // Initialize favorite status from outfits
    if (outfits.length > 0) {
      outfits.forEach((outfit) => {
        console.log("printing the outfit", outfit);
      });
      const initialStatus = {};
      outfits.forEach((outfit) => {
        initialStatus[outfit.id] = true; // Default all to favorite
      });
      setFavoriteStatus(initialStatus);
    }
  }, [outfits]);

  // find the src of images stored in indexDB
  const getImageSrc = (imageId) => {
    const image = images.find((img) => img.id === imageId);
    return image ? image.url : "";
  };
  // toggle heart when user clicks, and save or remove outfit in IndexDB database
  const toggleHeart = async (outfit) => {
    const currentStatus = favoriteStatus[outfit.outfit_id];
    const newStatus = { ...favoriteStatus, [outfit.outfit_id]: !currentStatus };
    setFavoriteStatus(newStatus);
    if (!currentStatus) {
      try {
        await removeFavoriteOutfit(outfit.outfit_id);
        setError("");
      } catch (error) {
        console.error("Failed to remove your favorite outfit", error);
        setError("Failed to remove your favorite outfit, please try again");
      }
    } else {
      try {
        await saveFavoriteOutfit(outfit);
        setError("");
      } catch (error) {
        console.error("Failed to save your favorite outfit", error);
        setError("Failed to save your favorite outfit");
      }
    }
  };
  if (outfits.length === 0) {
    return <></>;
  } else {
    return (
      <div className="my-outfits">
        <h1 className="outfit-heading">My Outfits</h1>
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
      </div>
    );
  }
}

export default MyOutfits;
