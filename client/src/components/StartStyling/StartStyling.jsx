import React, { useState, useEffect } from "react";
import "./StartStyling.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AnalyzeImages = ({ images }) => {
  const base_url = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  // update the formData when the images or selectedStyle changes
  const [selectedStyle, setSelectedStyle] = useState("");
  const [formData, setFormData] = React.useState(null);
  // const [isFormDataReady, setIsFormDataReady] = useState(false); // New state to track readiness

  const handleStyleClick = (style) => {
    setSelectedStyle(style);
  };

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

  const handleClick = async () => {
    if (!selectedStyle) {
      alert("Please selected a style for your outfit");
      return;
    }
    if (!images || images.length === 0) {
      alert("Please upload images");
      return;
    }
    // construct the formdata to include image files and the selected style
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`image${index}`, image.file);
    });
    formData.append("style", selectedStyle);
    setFormData(formData);
    // Log FormData contents

    try {
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const response = await axios.post(`${base_url}/clothes`, formData);
      console.log("File uploaded successfully:", response.data);
      // navigate("/recommendations");
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
