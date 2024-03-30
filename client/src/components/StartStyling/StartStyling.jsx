import React, { useState, useEffect } from "react";
import "./StartStyling.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { storeImages } from "../../utils/indexDB";
const StartStyling = ({ setResponse, images, errors, setErrors }) => {
  const base_url = process.env.REACT_APP_BASE_URL;
  console.log(base_url);
  const navigate = useNavigate();
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
    const formDataKeys = [];
    images.forEach((image, index) => {
      formData.append(`image${index}`, image.file);
      formDataKeys.push(`image${index}`);
    });
    formData.append("style", selectedStyle);
    setFormData(formData);

    try {
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }
      console.log(`Sending request to ${base_url}/clothes`);
      await storeImages(images, formDataKeys); // Store images in IndexedDB
      const response = await axios.post(`${base_url}/clothes`, formData);
      console.log("Response from GPT-4:", response.data);
      setResponse(response.data);
      // navigate("/recommendations");
    } catch (error) {
      console.error("Error in sending request:", error);
      setErrors({ api: "Error processing request. Please try again." });
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

export default StartStyling;
