import React, { useState, useEffect } from "react";
import "./StartStyling.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AnalyzeImages = ({ images, errors, setErrors }) => {
  const base_url = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [choises, setChoices] = useState([]);
  // update the formData when the images or selectedStyle changes
  const [selectedStyle, setSelectedStyle] = useState("");
  const [formData, setFormData] = React.useState(new FormData());

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
    const errors = {};
    if (!selectedStyle) {
      errors.style = "Please selected a style for your outfit";
    }
    if (!images || images.length < 3) {
      errors.images = "Please upload at least 3 images";
    }
    if (errors.images || images.style) {
      setErrors(errors);
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
      <div className="" style__errors>
        {errors.images && <p className="error">{errors.images}</p>}
        {errors.style && <p className="error">{errors.style}</p>}
      </div>
    </div>
  );
};

export default AnalyzeImages;
