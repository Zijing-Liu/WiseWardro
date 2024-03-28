import React, { useState } from "react";
import "./StartStyling.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AnalyzeImages = ({ uploadedeImages }) => {
  const base_url = process.env.REACT_APP_BASE_URL;
  console.log("baseUrl is", base_url);
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] = useState(null);
  const styles = [
    "Streetwear",
    "Boho-chic",
    "Casual",
    "Business Casual",
    "Formal",
    "Minimalist",
    "Elegant",
    "Athleisure",
    "Girly girl",
    "NYC Style",
    "Preepy Fashion",
    "Punk Fashion",
    "Gothic Fashion",
  ];

  const handleStyleClick = (style) => {
    setSelectedStyle(style);
  };

  const handleClick = async () => {
    if (!selectedStyle) {
      alert("Please selected a style for your outfit");
    }
    try {
      // send styling options to api call
      // Create a Blob from the JSON string
      const blob = new Blob([JSON.stringify(uploadedeImages)], {
        type: "application/json",
      });
      console.log("request body size is", blob.size);
      const response = await axios.post(`${base_url}/clothes`, {
        style: selectedStyle,
        images: uploadedeImages,
      });

      console.log(response);
      navigate("/recommendations");
    } catch (error) {
      console.log("error message ", error);
    }
  };

  return (
    <div className="style">
      <div className="style__options">
        {styles.map((style) => (
          <button
            key={style}
            className={`style__option ${
              selectedStyle === style ? "style__option--selected" : ""
            }`}
            onClick={() => handleStyleClick(style)}
          >
            {style}
          </button>
        ))}
      </div>

      <button className="style__btn" onClick={handleClick}>
        Start Styling
      </button>
    </div>
  );
};

export default AnalyzeImages;
